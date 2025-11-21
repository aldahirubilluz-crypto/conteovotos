// src/app/dashboard/layout.tsx
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
import MainSidebar from "@/components/sidebar-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();

  // if (!session?.user) {
  //   redirect("/auth/login");
  // }

  return <MainSidebar>{children}</MainSidebar>;
}
