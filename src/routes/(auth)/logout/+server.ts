import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete("auth", {path: '/'} )
	throw redirect(303, "/")
}