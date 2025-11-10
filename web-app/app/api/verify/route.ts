import { INVALID_CREDENTIALS_C } from "@/app/utils/backend";
import OPS from "@/app/utils/db_ops";
import { generateChecksum } from "@/app/utils/hybrid";
import { errorResponse } from "@/app/utils/static_responses";

export async function POST(request: Request) {
	try {
		const { regNo, checksum }: { regNo: string; checksum: string } =
			await request.json();
		if (!regNo || !checksum) {
			return errorResponse(INVALID_CREDENTIALS_C);
		}
		if (await OPS.isInMaintenance()) {
			return errorResponse("Error at backend");
		}
		if (await OPS.hasUser(regNo)) {
			const userData = await OPS.getUserData(regNo);
			const holidays = await OPS.getHolidays();
			const specialWorkingDays = await OPS.getSpecialWorkingDays();
			if (
				generateChecksum(
					JSON.stringify({ userData, holidays, specialWorkingDays })
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
