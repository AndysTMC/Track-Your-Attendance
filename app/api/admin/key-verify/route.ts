import OPS from "@/app/utils/db_ops";
import { parse } from 'cookie';


export async function POST(request: Request) {
    const { adminKey } = await request.json();
    if (adminKey != await OPS.getAdminKey()) {
        return new Response(JSON.stringify({ message: "Invalid admin key" }), {
            status: 401,
            headers: {
                'content-type': 'application/json',
            },
        });
    }
    return new Response(JSON.stringify(await OPS.getAdminKey()), {
        status: 200,
        headers: {
            'content-type': 'application/json',
        },
    });
}