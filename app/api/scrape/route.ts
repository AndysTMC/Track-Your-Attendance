import { getPortal, scrape } from '@/app/utils/portal';
import { BACKEND_CHECK_C, CANT_FETCH_C, CANT_REFETCH_C, COOLDOWN_CHECK_C, Credentials, CREDENTIALS_CHECK_C, DATA_NA_WITH_REGNO, DKEY_CHECK_C, DKEY_NOT_PROVIDED_C, ERROR_AT_BACKEND_C, FAILED_AUTH_C, FAILED_AUTH_CHECK_C, FAILED_DECRYPT_C, FAILED_SCRAPE_C, FAILED_SCRAPE_CHECK_C, FAILED_TO_FETCH_DATA, generateDKey, handleScrapeErrors, IN_MAINTENANCE_C, INVALID_AUTH_C, INVALID_AUTH_CHECK_C, INVALID_CREDENTIALS, NA_C, NEITHER_PASSWORD_NOR_DKEY_PROVIDED, PLEASE_TRY_AGAIN, PLEASE_TRY_AGAIN_LATER, Portal, PORTAL_ERROR_C, PORTAL_ERROR_CHECK_C, QueueItem, REFETCH_LIMIT_REACHED_C, REFETCH_POSSIBLITY_CHECK_C, REGNO_CHECK_C, REGNO_DATA_CHECK_C, REGNO_IN_QUEUE_CHECK_C, REGNO_NOT_PROVIDED_C, SCRAPE_IN_PROGRESS_CHECK_C, ScrapeData, SERVER_CHECK_C, SERVER_IN_MAINTENANCE_C, TIME_LIMIT_NOT_REACHED_C, User } from '@/app/utils/backend';
import { UserData } from '@/app/utils/hybrid'
import { Queue } from '@/app/utils/backend';
import OPS from '@/app/utils/db_ops';
import { EventEmitter } from 'events';
import { encrypt, decrypt } from '@/app/utils/backend';

const queueEmitter = new EventEmitter();
let queue: Queue = new Queue();
let isProcessing: boolean = false;

async function processQueue() {
  isProcessing = true;
  while (!queue.isEmpty()) {
    const queueItem: QueueItem | undefined = queue.dequeue();
    if (queueItem) { await executeScrape(queueItem); }
  }
  isProcessing = false;
}

async function enqueueHelper(regNo: string, encryptedPassword: string, dKey: string,  refetch: boolean, portal: Portal) {
  let credentials: Credentials = { regNo, encryptedPassword};
  let item: QueueItem = { credentials, refetch, dKey, portal };
  queue.enqueue(item);
  await OPS.updateUserScrapeProgress(regNo, true);
  queueEmitter.emit('itemAdded');
}

async function executeScrape(item: QueueItem) {
  const regNo = item.credentials.regNo;
  let decryptedPassword: string = '';
  try {
    decryptedPassword = decrypt(item.credentials.encryptedPassword, item.dKey);
    let data: ScrapeData | null = null;
    let count = 0;
    let maxScrapeRetry = Number(process.env.MAX_SCRAPE_RETRY) ?? 3;
    while (!data && count < maxScrapeRetry) {
      try {
        data = await scrape(regNo, decryptedPassword, item.portal);
      } catch (err: any) {
        await handleScrapeErrors(err, item.credentials.regNo, decryptedPassword);
        if (await OPS.hasInvalidAuth(regNo, decryptedPassword)) {
          await OPS.updateUserScrapeProgress(regNo, false);
          return;
        }
      }
      count++;
    }
    // console.log(data);
    if (!data) { 
      if (await OPS.hasUser(regNo)) { await OPS.updateUserScrapeProgress(regNo, false); }
      return; 
    }
    try {
      if (await OPS.hasUser(item.credentials.regNo)) {
        const user = await OPS.getUser(item.credentials.regNo);
        if (!user) { return; }
        const scrapingInfo = user.userData.scrapingInfo;
        const previoslyScraped = new Date(scrapingInfo.lastScraped);
        scrapingInfo.lastScraped = new Date().toISOString();
        if (item.refetch) scrapingInfo.refetchCount++;
        if (previoslyScraped.getDate() !== new Date().getDate()) scrapingInfo.refetchCount = 0;
        user.userData = { ...data, scrapingInfo };
        await OPS.addOrUpdateUser(item.credentials.regNo, user);
        await OPS.updateUserScrapeProgress(regNo, false);
      } else {
        const scrapingInfo = { lastScraped: new Date().toISOString(), refetchCount: 0 };
        const userData: UserData = { ...data, scrapingInfo };
        const user: User = { userData, userCredentials: item.credentials, scrapeInProgress: false };
        await OPS.addOrUpdateUser(item.credentials.regNo, user);
        console.info("User added to database");
      }
    } catch (err: any) { 
      console.error(err);
      await OPS.updateUserScrapeProgress(regNo, false);
    }
  } catch (err: any) {
    await handleScrapeErrors(err, item.credentials.regNo, decryptedPassword);
    await OPS.updateUserScrapeProgress(regNo, false);
  }
}

queueEmitter.on('itemAdded', () => {
  if (!isProcessing) processQueue();
});

const dataResponse = async (regNo: string) => {
  return new Response(JSON.stringify({ userData: await OPS.getUserData(regNo) }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const dKeyResponse = (regNo: string, dKey: string) => {
  return new Response(JSON.stringify({ regNo, dKey }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const inQueueResponse = async (regNo: string) => {
  return new Response(JSON.stringify({ inQueue: queue.inFront(regNo), inProgress: await OPS.getScrapeInProgress(regNo)}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const serviceUnavailableResponse = (message: string) => {
  return new Response(JSON.stringify({ error: message }), {
    status: 503,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const serverMalfunctionResponse = (message: string) => {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const unauthorizedResponse = (message: string) => {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const noContentResponse = (message: string) => {
  return new Response(JSON.stringify({ error: message }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const badResponse = (error: string) => {
  return new Response(JSON.stringify({ error }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


const handleResponses = (err: any, regNo: string) => {
  const [errorType, errorLocation, errorMessage] = err.message.split(":::");
  switch (errorType) {
    case IN_MAINTENANCE_C:
    case ERROR_AT_BACKEND_C:
      return serviceUnavailableResponse(errorMessage);
    case FAILED_DECRYPT_C:
      return badResponse(errorMessage)
    case CANT_REFETCH_C:
      switch (errorLocation) {
        case REFETCH_POSSIBLITY_CHECK_C:
          return noContentResponse(errorMessage);
        case DKEY_CHECK_C:
          return badResponse(errorMessage);
        default:
          return badResponse('Unknown')
      }
    case CANT_FETCH_C:
      switch (errorLocation) {
        case REGNO_CHECK_C:
        case CREDENTIALS_CHECK_C:
        case DKEY_CHECK_C:
          return badResponse(errorMessage);
        case REGNO_DATA_CHECK_C:
          return noContentResponse(errorMessage);
        case FAILED_AUTH_CHECK_C:
        case FAILED_SCRAPE_CHECK_C:
        case PORTAL_ERROR_CHECK_C:
          return serverMalfunctionResponse(errorMessage);
        case REGNO_IN_QUEUE_CHECK_C:
        case SCRAPE_IN_PROGRESS_CHECK_C:
          return inQueueResponse(regNo);
        case COOLDOWN_CHECK_C:
          return dataResponse(regNo);
        case INVALID_AUTH_CHECK_C:
        case CREDENTIALS_CHECK_C:
          return unauthorizedResponse(errorMessage)
        default:
          return badResponse('Unknown')
      }
    default:
      return badResponse('Unknown')
  }
}

export async function POST(request: Request): Promise<void | Response> {
  let { regNo, password, dKey, refetch }:
    { regNo: string, password: string, dKey: string, refetch: boolean } = await request.json();
  try {
    if (await OPS.isInMaintenance()) { throw new Error([IN_MAINTENANCE_C, SERVER_CHECK_C, SERVER_IN_MAINTENANCE_C].join(':::')) }
    if (!regNo) { throw new Error([CANT_FETCH_C, REGNO_CHECK_C, REGNO_NOT_PROVIDED_C].join(':::')); }
    if (queue.hasUser(regNo)) { throw new Error([CANT_FETCH_C, REGNO_IN_QUEUE_CHECK_C, NA_C].join(':::')); }
    if (await OPS.getScrapeInProgress(regNo)) { throw new Error([CANT_FETCH_C, SCRAPE_IN_PROGRESS_CHECK_C, NA_C].join(':::')); }
    if (password === null && dKey === null) { throw new Error([CANT_FETCH_C, CREDENTIALS_CHECK_C, NEITHER_PASSWORD_NOR_DKEY_PROVIDED].join(':::')); }
    if (refetch) {
      if (!dKey) { throw new Error([CANT_REFETCH_C, DKEY_CHECK_C, DKEY_NOT_PROVIDED_C].join(':::')); }
    }
    let encryptedPassword: string = '';
    if (password !== null) {
      const [newEncryptedPassword, newDKey] = encrypt(password);
      encryptedPassword = newEncryptedPassword; dKey = newDKey;
      if (await OPS.hasCoolDown(regNo)) {
        await OPS.updateUserEncryptedPassword(regNo, encryptedPassword);
        return dKeyResponse(regNo, dKey);
      };
    } else if (dKey !== null) {
      if (!(await OPS.hasUser(regNo))) { throw new Error([CANT_FETCH_C, REGNO_DATA_CHECK_C, DATA_NA_WITH_REGNO].join(':::')); }
      encryptedPassword = await OPS.getUserEncryptedPassword(regNo); password = decrypt(encryptedPassword, dKey);
    }
    if (refetch) {
      if (!(await OPS.isRefetchPossible(regNo))) {
        throw new Error([CANT_REFETCH_C, REFETCH_POSSIBLITY_CHECK_C, REFETCH_LIMIT_REACHED_C].join(':::')); 
      }
    }
    let portal: Portal | null = null;
    let errorType, errorLocation, errorMessage;
    try {
      portal = await getPortal(regNo, password);
    } catch (err: any) {
      errorType = err.message.split(":::")[0];
      errorLocation = err.message.split(":::")[1];
      errorMessage = err.message.split(":::")[2];
    }

    if (await OPS.hasInvalidAuth(regNo, password) || errorType === INVALID_AUTH_C) { 
      await OPS.removeInvalidAuth(regNo);
      throw new Error([CANT_FETCH_C, INVALID_AUTH_CHECK_C, INVALID_CREDENTIALS].join(':::'));
     }
    
    if (await OPS.hasFailedAuth(regNo) || errorType === FAILED_AUTH_C) {
      await OPS.removeFailedAuth(regNo);
      throw new Error([CANT_FETCH_C, FAILED_AUTH_CHECK_C, PLEASE_TRY_AGAIN].join(':::'));
    }
    
    if (await OPS.hasFailedScrape(regNo) || errorType === FAILED_SCRAPE_C) {
      await OPS.removeFailedScrape(regNo);
      throw new Error([CANT_FETCH_C, FAILED_SCRAPE_CHECK_C, FAILED_TO_FETCH_DATA].join(':::'));
    }
    
    if (await OPS.hasPortalError(regNo) || errorType === PORTAL_ERROR_C) { 
      await OPS.removePortalError(regNo);
      throw new Error([CANT_FETCH_C, PORTAL_ERROR_CHECK_C, PLEASE_TRY_AGAIN_LATER].join(':::')); 
    }
    
    if (!(await OPS.hasUser(regNo)) || !(await OPS.hasCoolDown(regNo)) || refetch) {
      if (portal) enqueueHelper(regNo, encryptedPassword, dKey, refetch, portal);
    }
    if (await OPS.hasUser(regNo) && !(await OPS.getScrapeInProgress(regNo))) return dataResponse(regNo);
    return dKeyResponse(regNo, dKey);
  } catch (err: any) {
    console.log(err)
    return handleResponses(err, regNo);
  }
}

