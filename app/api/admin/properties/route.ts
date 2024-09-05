
import OPS from '@/app/utils/db_ops';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '../middleware';



export async function POST(request: NextRequest) {
    try {
        const verifyResponse = await verifyAdmin(request);
        if (verifyResponse.status != 200) {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
        }
        const { semStartDate, semEndDate, inMaintenance } = await request.json();
        await OPS.setProperties({ semStartDate, semEndDate, inMaintenance });
        return NextResponse.json({ semStartDate, semEndDate, inMaintenance });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
