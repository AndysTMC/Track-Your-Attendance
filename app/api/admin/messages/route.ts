import OPS from "@/app/utils/db_ops";
import { verifyAdmin } from "../middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const messages = await OPS.getMessages();
		return NextResponse.json({messages});
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { add, message } = await request.json();
		const verifyResponse = await verifyAdmin(request);
		if (verifyResponse.status != 200) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 }
			);
		}
		if (add) {
			await OPS.addMessage(message);
		} else {
			await OPS.removeMessage(message);
		}
		const messages = await OPS.getMessages();
		return NextResponse.json({messages});
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
