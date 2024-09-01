import { SpecialWorkingDay } from '@/app/utils/hybrid';
import OPS from '@/app/utils/db_ops';

export async function GET(request: Request) {
    try {
        return new Response(JSON.stringify(OPS.getSpecialWorkingDays()), {
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
        const {add, date, replacementDay} = await request.json();
        if (add) {
            const specialWorkingDay: SpecialWorkingDay = {date, replacementDay};
            if(await OPS.hasSpecialWorkingDay(date)) {
                throw new Error('Special Working Day already exists');
            }
            await OPS.addSpecialWorkingDay(date, replacementDay);
            return new Response(JSON.stringify(specialWorkingDay), {
                headers: {
                    'content-type': 'application/json',
                },
            });
        } else {
            if (!(await OPS.hasSpecialWorkingDay(date))) {
                throw new Error('Special Working Day does not exist');
            }
            await OPS.removeSpecialWorkingDay(date);
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

