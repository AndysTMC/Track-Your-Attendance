import { generateAdminKey } from "@/app/utils/backend";
import OPS from "@/app/utils/db_ops";

export async function POST(request: Request) {
	const adminPass = process.env.ADMIN_PASS;
	const { adminPass: passProvided } = await request.json();
	if (passProvided === adminPass) {
		const adminKey = generateAdminKey();
		OPS.setAdminKey(adminKey);
		const responseHeaders = new Headers();
		responseHeaders.append(
			"Set-Cookie",
			`adminKey=${adminKey}; Path=/; HttpOnly; Max-Age=3600; SameSite=Strict;`
		);
		return new Response(JSON.stringify({ message: "Admin verified" }), {
			status: 200,
			headers: responseHeaders,
		});
	}
	return new Response("Invalid admin pass", { status: 401 });
}
