import { Holiday } from "@/app/utils/hybrid";
import OPS from "@/app/utils/db_ops";
import { verifyAdmin } from "../middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const holidays = await OPS.getHolidays();
		return NextResponse.json({holidays});
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { add, date, name } = await request.json();
		const verifyResponse = await verifyAdmin(request);
		if (verifyResponse.status != 200) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 }
			);
		}
		if (add) {
			if (await OPS.hasHoliday(date)) {
				throw new Error("Holiday already exists");
			}
			await OPS.addHoliday(date, name);
		} else {
			if (!(await OPS.hasHoliday(date))) {
				throw new Error("Holiday does not exist");
			}
			await OPS.removeHoliday(date);
		}
		const holidays = await OPS.getHolidays();
		return NextResponse.json({holidays});
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
