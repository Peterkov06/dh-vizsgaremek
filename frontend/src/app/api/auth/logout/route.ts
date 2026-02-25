import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../register/route";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  if (!accessToken) {
    return Response.json("Nincs frissítési token", { status: 401 });
  }
  try {
    console.log("Itt voltam");
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "GET",
      headers: {
        Cookie: `access_token=${accessToken.value}`,
      },
      credentials: "include",
    });

    console.log(response.ok);

    if (response.ok) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
      return res;
    }
    return new NextResponse(null, {
      status: response.status,
    });
  } catch (error) {
    console.error("Login error: ", error);
    return NextResponse.json(
      { message: "A bejelentkezés során hiba történt" },
      { status: 500 },
    );
  }
}
