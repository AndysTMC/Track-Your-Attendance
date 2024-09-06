
import { Holiday } from '@/app/utils/hybrid';
import OPS from '@/app/utils/db_ops';
import { verifyAdmin } from '../middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const holidays = await OPS.getHolidays();
        return NextResponse.json(holidays);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const {add, date, name} = await request.json();
        const verifyResponse = await verifyAdmin(request);
        if (verifyResponse.status != 200) {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
        }
        if (add) {
            if(await OPS.hasHoliday(date)) {
                throw new Error('Holiday already exists');
            }
            const holiday: Holiday = {date, name};
            await OPS.addHoliday(date, name);
            return NextResponse.json(holiday);
        } else {
            if (!(await OPS.hasHoliday(date))) {
                throw new Error('Holiday does not exist');
            }
            OPS.removeHoliday(date);
            return NextResponse.json({date});
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
