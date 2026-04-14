import { BASE_URL } from "@/app/api/auth/register/route";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type User = {
  nickname: string;
  fullName: string;
  email: string;
  profilePicUrl: string;
  role: "Student" | "Teacher" | "Parent";
};

export default async function getCurrentUser(): Promise<User | null> {
  const cookieSore = await cookies();
  const accessToken = cookieSore.get("access_token");

  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `access_token=${accessToken.value}`,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Hibás access token: ", error);
    return null;
  }
}
