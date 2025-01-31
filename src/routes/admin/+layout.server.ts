import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    console.log("🌍 Layout Server - User from locals:", locals.user);

    return {
        user: locals.user ?? null  // Ensure `user` is always defined
    };
};