import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import OPS from "@/app/utils/db_ops";
import { NextRequest, NextResponse } from "next/server";

export const verifyAdmin = async (req: NextRequest) => {
	const adminKey = req.cookies.get("adminKey")?.value;
	if (adminKey !== (await OPS.getAdminKey())) {
		return NextResponse.json(
			{ error: "Unauthorized access" },
			{ status: 403 }
		);
	}
	return NextResponse.next();
};
