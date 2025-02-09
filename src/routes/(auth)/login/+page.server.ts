import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { mysqlconnFn } from '$lib/db/mysql';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
	};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get("email");
		const password = form.get("password");

		if (!email || !password) {
			return fail(400, { error: "Email and password are required." });
		}

		try {
			const connection = await mysqlconnFn();
			const [rows]: any = await connection.query(
				"SELECT name, email, role FROM employee WHERE email = ? AND password = ?",
				[email, password]
			);

			if (rows.length === 0) {
				return fail(401, { error: "Invalid email or password." });
			}

			const user = rows[0];

			const userRole = user.role.toLowerCase(); 
			const token = userRole === 'admin' ? 'adminusertoken' : 'employeeusertoken';

			cookies.set("auth", token, {
				path: "/",
				httpOnly: true,
				sameSite: "strict",
				secure: process.env.NODE_ENV === "production",
				maxAge: 60 * 60 * 24 * 7,
			});

			cookies.set("user_role", user.role, { path: "/", httpOnly: true });
			cookies.set("user_name", user.name, { path: "/", httpOnly: true });
			cookies.set("user_email", user.email, { path: "/", httpOnly: true });

			throw redirect(303, "/"); 
		} catch (error) {
			console.error("Login failed:", error);
			return fail(500, { error: "Internal server error." });
		} finally{
			throw redirect(303, "/");
		}
	},
};