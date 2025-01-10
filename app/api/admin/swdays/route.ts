import { SpecialWorkingDay } from "@/app/utils/hybrid";
import OPS from "@/app/utils/db_ops";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "../middleware";

export async function GET(request: NextRequest) {
	try {
		const specialWorkingDays = await OPS.getSpecialWorkingDays();
		return NextResponse.json({specialWorkingDays});
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const verifyResponse = await verifyAdmin(request);
		if (verifyResponse.status != 200) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 }
			);
		}
		const { add, date, replacementDay } = await request.json();
		if (add) {
			const specialWorkingDay: SpecialWorkingDay = {
				date,
				replacementDay,
			};
			if (await OPS.hasSpecialWorkingDay(date)) {
				throw new Error("Special Working Day already exists");
			}
			await OPS.addSpecialWorkingDay(date, replacementDay);
		} else {
			if (!(await OPS.hasSpecialWorkingDay(date))) {
				throw new Error("Special Working Day does not exist");
			}
			await OPS.removeSpecialWorkingDay(date);
		}
		const specialWorkingDays = await OPS.getSpecialWorkingDays();
		return NextResponse.json({specialWorkingDays});
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
