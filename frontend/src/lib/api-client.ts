"use client";

import { useRouter } from "next/router";

export default async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshResponse = await fetch(`api/auth/refresh`, {
      method: "GET",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      return await fetch(url, {
        ...options,
        credentials: "include",
      });
    } else {
      const router = useRouter();
      router.push("/login");
    }
  }
  return response;
}
