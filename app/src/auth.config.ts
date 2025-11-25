// ===== auth.config.ts =====
/* eslint-disable @typescript-eslint/no-explicit-any */
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales incompletas");
        }

        const res = await postJSON(`${API_BASE}/auth/signin`, {
          email: credentials.email,
          password: credentials.password,
          provider: "credentials",
        });

        if (!res.ok || res.data?.status !== 200) {
          throw new Error(res.data?.message || "Credenciales inválidas");
        }

        const data = res.data?.data;
        if (!data?.id) {
          throw new Error("Respuesta inválida del servidor");
        }

        return {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          token: data.token,
        } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: "/admin/main",
    error: "/auth/error",
  },
  secret: process.env.NEXT_AUTH_SECRET,
  trustHost: true,
};

export default authConfig;
