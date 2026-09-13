import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createBrowserClient(url, anonKey, {
    cookies: {
      getAll() {
        return document.cookie
          .split(";")
          .map((cookie) => cookie.trim())
          .filter(Boolean)
          .map((cookie) => {
            const [name, ...rest] = cookie.split("=");
            return {
              name,
              value: decodeURIComponent(rest.join("=")),
            };
          });
      },
      setAll(cookies) {
        cookies.forEach((cookie) => {
          const options = cookie.options;
          const cookieValue = `${cookie.name}=${encodeURIComponent(cookie.value)}; ${options ? `Path=${options.path ?? "/"}; ` : ""}${options?.maxAge ? `Max-Age=${options.maxAge}; ` : ""}${options?.sameSite ? `SameSite=${options.sameSite}; ` : ""}${options?.secure ? "Secure; " : ""}${options?.httpOnly ? "HttpOnly; " : ""}`;
          document.cookie = cookieValue;
        });
      },
    },
  });
}
