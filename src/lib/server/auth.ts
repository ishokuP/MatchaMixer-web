import type { RequestEvent } from "@sveltejs/kit";
import { mysqlconnFn } from "$lib/db/mysql";

export const authenticateUser = async (event: RequestEvent) => {
    const { cookies } = event;
    const userToken = cookies.get("auth");
    const userEmail = cookies.get("user_email");

    if (!userToken || !userEmail) return null;

    let role: string;
    if (userToken === "adminusertoken") {
        role = "ADMIN";
    } else if (userToken === "employeeusertoken") {
        role = "Employee";
    } else {
        return null;
    }

    try {
        const mysqlconn = await mysqlconnFn();
        const [rows]: any = await mysqlconn.query(
            "SELECT name, email, role FROM employee WHERE email = ? LIMIT 2",
            [userEmail]
        );

        if (rows.length === 0) return null;

        return {
            role,
            name: rows[0].name,
            email: rows[0].email
        };
    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
};