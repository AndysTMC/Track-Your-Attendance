import { NextRequest, NextResponse } from "next/server";
import OPS from "@/app/utils/db_ops";
import { verifyAdmin } from "../middleware";

export async function GET(request: NextRequest) {
	try {
		const verifyResponse = await verifyAdmin(request);
		if (verifyResponse.status != 200) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 }
			);
		}
		const adminData = await OPS.getAdminData();
		return NextResponse.json({ adminData }, { status: 200 });
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
