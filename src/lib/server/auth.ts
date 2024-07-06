import type { RequestEvent } from "@sveltejs/kit"

export const authenticateUser = (event: RequestEvent) => {
	// get the cookies from the request
	const { cookies } = event

	// get the user token from the cookie
	const userToken = cookies.get("auth")

	// if the user token is not valid, return null
	// this is where you would check the user token against your database
	// to see if it is valid and return the user object
	if (userToken === "employeeusertoken") {
		const user = {

			role: "EMPLOYEE",
		}
		return user
	}
	if (userToken === "adminusertoken") {
		const user = {
			role: "ADMIN",
		}
		return user
	}

	return null
}