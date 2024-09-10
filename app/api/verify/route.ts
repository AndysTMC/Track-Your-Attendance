import OPS from "@/app/utils/db_ops";
import { generateChecksum } from "@/app/utils/hybrid";
import { errorResponse } from "@/app/utils/static_responses";

export async function POST(request: Request) {
	try {
		const { regNo, checksum }: { regNo: string; checksum: string } =
			await request.json();
		if (!regNo || !checksum) {
			return errorResponse("Invalid credentials");
		}
		if (await OPS.isInMaintenance()) {
			return errorResponse("Error at backend");
		}
		if (await OPS.hasUser(regNo)) {
			if (
				generateChecksum(
					JSON.stringify(await OPS.getUserData(regNo))
				) == checksum
			) {
				return new Response(JSON.stringify({ isValid: true }), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				});
			}
		}
		return new Response(JSON.stringify({ isValid: false }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (err: any) {
		return errorResponse("Error at backend");
	}
}
