    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      });

      const setCookie = response.headers.get("set-cookie");
      if (response.status === 204) {
        return new NextResponse(null, {
          status: response.status,
          headers: setCookie
            ? {
                "Set-Cookie": setCookie,
              }
            : {},
        });
      }
    } catch (error) {
      console.error("Login error: ", error);
      return NextResponse.json(
        { message: "Az access token érvényesítése során hiba történt" },
        { status: 500 },
      );
    }