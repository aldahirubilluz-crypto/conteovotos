// ===== auth.ts =====
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const API_BASE = process.env.API_BASE_URL;

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {}
  return { ok: res.ok, status: res.status, data };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Login con credentials
      if (account?.provider === "credentials" && user) {
        token.id = (user as any).id;
        token.name = (user as any).name ?? null;
        token.email = (user as any).email ?? null;
        (token as any).role = (user as any).role ?? "ADMIN";
        (token as any).accessToken = (user as any).token;
        return token;
      }

      // Login con Google
      if (account?.provider === "google") {
        const email = (profile as any)?.email || token.email;

        if (email) {
          const signinRes = await postJSON(`${API_BASE}/auth/signin`, {
            email,
            provider: "google",
          });

          if (!signinRes.ok || signinRes.data?.status !== 200) {
            throw new Error(
              signinRes.data?.message || "No se pudo iniciar sesión con Google"
            );
          }

          const data = signinRes.data?.data;
          token.id = data.id;
          token.email = data.email;
          token.name = data.name;
          (token as any).role = data.role;
          (token as any).accessToken = data.token;
          (token as any).provider = "google";
          return token;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).role = (token as any).role ?? "ADMIN";
        (session.user as any).token = (token as any).accessToken;
      }
      return session;
    },
  },

  secret: process.env.NEXT_AUTH_SECRET,
});