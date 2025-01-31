import type { RequestEvent } from "@sveltejs/kit";
import { mysqlconnFn } from "$lib/db/mysql";

export const authenticateUser = async (event: RequestEvent) => {
    const { cookies } = event;
    const userToken = cookies.get("auth");

    if (!userToken) return null;

    let role = "EMPLOYEE"; // Default to EMPLOYEE

    if (userToken === "adminusertoken") {
        role = "ADMIN"; // Set to ADMIN if the token matches
    } else if (userToken !== "employeeusertoken") {
        return null; // Reject unknown tokens
    }

    try {
        const mysqlconn = await mysqlconnFn();
        const [rows]: any = await mysqlconn.query(
            "SELECT name, email FROM employee WHERE role = ? LIMIT 1",
            [role]
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