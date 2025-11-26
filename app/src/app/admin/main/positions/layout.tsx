// src/app/admin/main/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NextAuthProvider from "@/components/providers/session-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/admin");
  }
  
  return (
    <NextAuthProvider session={session}>
        {children}
    </NextAuthProvider>
  );
}