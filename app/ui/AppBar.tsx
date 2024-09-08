import { useState, useEffect } from "react";
import { RxExit } from "react-icons/rx";
import { ImQrcode } from "react-icons/im";
import { BsFillPeopleFill } from "react-icons/bs";
import { GrDocumentUpdate } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { scrape, exit, setInQueueINF, setFetchInProgress, setRequestProcessing } from "../redux/userSlice";
import useEveryTime from "@/app/hooks/EveryTime";
import Image from 'next/image';


export default function AppBar({backgroundDim, setBackgroundDim}: {backgroundDim: boolean, setBackgroundDim: (dim: boolean) => void}) {
    const dispatch = useDispatch<AppDispatch>();
    const maxRefetchCount = Number(process.env.MAX_REFETCH_COUNT) || 5;
    const { inQueue, userData, error, errorStatusCode, fetchInProgress, requestProcessing } = useSelector((state: RootState) => state.user);
    const [refetchMode, setRefetchMode] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const handleRefetchClick = () => {
        const regNo = localStorage.getItem('TYASRMAPREGNO') ?? null;
        const dKey = localStorage.getItem('TYASRMAPDKEY') ?? null;
        dispatch(setInQueueINF());
        dispatch(setFetchInProgress(true));
        dispatch(scrape({ regNo, password: null, dKey, refetch: true }));
        setRefetchMode(true);
    }
    const refetchUserData = async () => {
        const regNo = localStorage.getItem('TYASRMAPREGNO') ?? null;
        const dKey = localStorage.getItem('TYASRMAPDKEY') ?? null;
        if (fetchInProgress == false) {
            setRefetchMode(false);
        } else {
            if (!requestProcessing) {
                dispatch(setRequestProcessing(true));
                dispatch(scrape({ regNo, password: null, dKey, refetch: false }));
            }
        }
    }
    const { setActive: setRefetching } = useEveryTime(refetchUserData, 1000);
    useEffect(() => {
        if (errorStatusCode != null && [400, 401, 503].includes(errorStatusCode)) {
            dispatch(exit());
        }
        if (errorStatusCode && [200].includes(errorStatusCode)) {
            setRefetchMode(false);
        }
        if (refetchMode) { setRefetching(true); }
        if (!refetchMode) { setRefetching(false); }
    }, [dispatch, refetchMode, fetchInProgress, errorStatusCode, setRefetching]);
    return (
        <div className="fixed w-full h-auto bottom-0 flex flex-col items-center">
            <div className={`
                    w-full p-2 flex items-center justify-center bg-transparent
                    `}>
                <div className={`
                        w-auto h-auto
                        bg-black 
                        rounded-lg ${!showQr ? 'bsm:rounded-full' : ''}
                        flex flex-col items-center justify-center
                        select-none
                        shadow-lg shadow-zinc-700
                        `}>
                    {
                        showQr ? (
                            <div className={`
                                w-48 h-48 bsm:w-52 bsm:h-52
                                my-12 bsm:my-20 transition-all duration-500
                            `}>
                                <Image src="/LTSQR.png" alt="QR" fill={false} layout="responsive" width={200} height={200} />
                            </div>
                        ) : null
                    }
                    { showQr ? (
                        <hr className="w-full text-white"></hr>
                        ): null 
                    }
                    <div className={`
                        h-16 bsm:h-16 flex items-center justify-center gap-x-2 bsm:gap-x-4
                    `}
                    >
                        <div className={`
                            w-auto
                            h-12 bsm:h-12
                            px-2 
                            ms-2
                            bg-white flex text-center items-center justify-center text-black
                            rounded-lg bsm:rounded-full
                            `}>
                            <h1 className={`
                                font-black 
                                text-base bsm:text-lg
                                `}>TYA-SRMAP</h1>
                        </div>
                        <div className={`
                            w-auto
                            h-12 bsm:h-12
                            px-2 bsm:px-4 pt-2
                            ${!showQr ? 'bg-transparent hover:bg-zinc-900' : 'bg-zinc-900'}
                            flex flex-col
                            items-center justify-center text-black
                            rounded-lg bsm:rounded-full
                            cursor-pointer
                            `}
                            onClick={() => { setBackgroundDim(!backgroundDim); setShowQr(!showQr) }}
                        >
                            <ImQrcode className={`
                                text-white
                                text-lg
                                `} />
                            <h2 className="text-white text-ssm">Share</h2>
                        </div>
                        {
                            refetchMode ? (
                                <div className={`
                                w-auto
                                h-12 bsm:h-12
                                px-2 bsm:px-4 pt-2
                                bg-transparent
                                flex flex-col
                                items-center justify-center text-black
                                rounded-lg bsm:rounded-full
                                cursor-wait
                                `}>
                                    <div className="flex items-center justify-center gap-x-1">
                                        <BsFillPeopleFill className={`
                                        text-white
                                        text-lg
                                        `} />
                                        <h6 className="text-white text-sm">{inQueue != Infinity ? Math.max(0, inQueue) : '?'}</h6>
                                    </div>
                                    <h2 className="text-white text-ssm">In Queue</h2>
                                </div>
                            ) : (
                                <div className={`
                                w-auto
                                h-12 bsm:h-12
                                px-2 bsm:px-4 pt-2
                                bg-transparent hover:bg-zinc-900
                                flex flex-col
                                items-center justify-center text-black
                                rounded-lg bsm:rounded-full
                                cursor-pointer
                                `}
                                    onClick={handleRefetchClick}
                                >
                                    <GrDocumentUpdate className={`
                                    text-white
                                    text-lg
                                    `} />
                                    <h2 className="text-white text-ssm">Refetch: {maxRefetchCount - (userData?.scrapingInfo.refetchCount ?? 5)}</h2>
                                </div>
                            )
                        }
                        <div className={`
                            w-auto
                            h-12 bsm:h-11
                            px-2 bsm:px-4 pt-2
                            me-2
                            bg-transparent hover:bg-zinc-900
                            flex flex-col
                            items-center justify-center text-black
                            rounded-lg bsm:rounded-full
                            cursor-pointer
                            `}
                            title="Exit"
                            onClick={() => dispatch(exit())}
                        >
                            <RxExit className={`
                                text-white
                                text-xl
                                `} />
                            <h2 className="text-white text-ssm">Exit</h2>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}