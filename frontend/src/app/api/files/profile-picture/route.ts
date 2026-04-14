import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../../auth/register/route";
import { debuglog } from "util";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const cookies = request.headers.get("cookie") ?? "";
    const response = await fetch(`${BASE_URL}/files/profile-picture`, {
      method: "POST",
      body: body,
      headers: {
        cookie: cookies,
      },
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
    console.error("Upload error: ", error);
    return NextResponse.json(
      { message: "A kép feltöltése során hiba történt" },
      { status: 500 },
    );
  }
}
