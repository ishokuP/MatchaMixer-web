import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './logout/$types';

export const GET: RequestHandler = async ({ cookies }) => {
    const authCookie  = cookies.get('auth')
	console.log(authCookie)
	if (!authCookie) {
		throw redirect(303,'/login')
	}

	if (authCookie === 'adminusertoken') {
		throw redirect(303, '/admin/events')
	} else if (authCookie === 'employeeusertoken') {
		throw redirect(303, '/employee/events')
	} else {
	throw redirect(303, '/login');
		
	}


};
