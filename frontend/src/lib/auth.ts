import { BASE_URL } from "@/app/api/auth/register/route";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export type User = {
  nickname: string;
  fullname: string;
  email: string;
  role: "Student" | "Teacher" | "Parent";
};

// export async function getCurrentUser(): Promise<User | null> {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("access_token");
//   const refreshToken = cookieStore.get("refresh_token");

//   if (!accessToken && !refreshToken) {
//     return null;
//   }

//   if (!accessToken && refreshToken) {
//     const refreshed = await refreshAccessToken(refreshToken.value);
//     if (!refreshed) {
//       return null;
//     }
//     return null;
//   }

//   const user = await fetchUserWithToken(accessToken!.value);

//   if (!user && refreshToken) {
//     const newAccessToken = await refreshAccessToken(refreshToken.value);
//     if (!newAccessToken) {
//       return null;
//     }

//     return await fetchUserWithToken(newAccessToken);
//   }

//   return user;
// }

// async function fetchUserWithToken(accessToken: string): Promise<User | null> {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/me`, {
//       headers: {
//         Cookie: `access_token=${accessToken}`,
//       },
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       return null;
//     }
//     console.log(response);
//     return await response.json();
//   } catch (error) {
//     console.error("Get current user error:", error);
//     return null;
//   }
// }

export async function checkLogin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");

  if (!refreshToken) {
    redirect("/login");
  } else if (!accessToken) {
    return new NextResponse(null, {
      status: 401,
    });
  }

  return null;
}
