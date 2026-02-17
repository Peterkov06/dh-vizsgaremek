import { NextRequest, NextResponse } from "next/server";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export const BASE_URL = "https://localhost:7261/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : null;
    const setCookie = response.headers.get("set-cookie");
    return NextResponse.json(data ?? {}, {
      status: response.status,
      headers: setCookie
        ? {
            "set-cookie": setCookie,
          }
        : {},
    });
  } catch (error) {
    console.error("Registration error: ", error);
    return NextResponse.json(
      { message: "A regisztráció során hiba történt" },
      { status: 500 },
    );
  }
}
