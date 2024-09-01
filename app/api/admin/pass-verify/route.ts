
import { generateAdminKey } from '@/app/utils/backend';
import OPS from '@/app/utils/db_ops';

export async function POST(request: Request) {
    const adminPass = process.env.ADMIN_PASS;
    const { adminPass:passProvided } = await request.json();
    if (passProvided === adminPass) {
        const adminKey = generateAdminKey();
        OPS.setAdminKey(adminKey);
        return new Response(JSON.stringify({message: "Admin verified"}), {
            status: 200,
            headers: {
                'Set-Cookie': `adminKey=${adminKey}; Path=/admin; HttpOnly; Max-Age=3600; SameSite=Strict;`,
            },
        });
    } 
    return new Response('Invalid admin pass', { status: 401 });
}

