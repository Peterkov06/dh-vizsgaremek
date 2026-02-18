import { cookies } from "next/headers";


export async function getCurrentUser() {
    const cookieStore = await cookies();
    const accessCookie = cookieStore.get("access_token");
    const refreshCookie = cookieStore.get("refresh_token");

    if (!accessCookie || !refreshCookie) {
        return null;
    }
}