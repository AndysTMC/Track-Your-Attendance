import OPS from "@/app/utils/db_ops";
import { parse } from "cookie";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const { adminKey } = await request.json();
	if (adminKey != (await OPS.getAdminKey())) {
		return new Response(JSON.stringify({ message: "Invalid admin key" }), {
			status: 401,
			headers: {
				"content-type": "application/json",
			},
		});
	}
	return new Response(JSON.stringify(await OPS.getAdminKey()), {
		status: 200,
		headers: {
			"content-type": "application/json",
		},
	});
}
