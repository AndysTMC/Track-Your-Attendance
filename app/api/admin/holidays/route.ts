
import { Holiday } from '@/app/utils/hybrid';
import OPS from '@/app/utils/db_ops';

export async function GET(request: Request) {
    try {
        return new Response(JSON.stringify(OPS.getHolidays()), {
            headers: {
                'content-type': 'application/json',
            },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: {
                'content-type': 'application/json',
            },
            status: 500,
        });
    }
}

export async function POST(request: Request) {
    try {
        const {add, date, name} = await request.json();
        if (add) {
            if(await OPS.hasHoliday(date)) {
                throw new Error('Holiday already exists');
            }
            const holiday: Holiday = {date, name};
            await OPS.addHoliday(date, name);
            return new Response(JSON.stringify(holiday), {
                headers: {
                    'content-type': 'application/json',
                },
            });
        } else {
            if (!(await OPS.hasHoliday(date))) {
                throw new Error('Holiday does not exist');
            }
            OPS.removeHoliday(date);
            return new Response(JSON.stringify({date}), {
                headers: {
                    'content-type': 'application/json',
                },
            });
        }
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: {
                'content-type': 'application/json',
            },
            status: 500,
        });
    }
}
