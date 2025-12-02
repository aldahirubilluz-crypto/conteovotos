"use client";

import {
  PackageOpen,
  Settings,
  LogOut,
  PanelLeftIcon,
  Files,
  Warehouse,
  Users,
  CirclePlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

const navItems = [
  { name: "Registar", href: "/admin/main", icon: Warehouse },
  { name: "Puestos", href: "/admin/main/positions", icon: CirclePlus },
  { name: "Candidatos", href: "/admin/main/candidates", icon: Users },
  { name: "Documentos", href: "/admin/main/documents", icon: Files },
  { name: "Configuración", href: "/admin/main/configuration", icon: Settings },
];

export default function MainSidebar({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex max-h-screen w-full bg-background text-foreground">
        <Sidebar
          collapsible="icon"
          className="hidden sm:flex flex-col shadow-lg border-r border-border/40 bg-background/90 backdrop-blur-md"
        >
          <SidebarHeader>
            <div className="px-4 py-4 font-bold text-lg flex items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-2">
                <PackageOpen className="h-6 w-6 text-primary" />
                <span>CONTEO</span>
              </div>
              <ModeToggle />
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4 flex-1">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.name}
                    className={`flex items-center gap-3 px-3 py-6 rounded-lg transition-all ${
                      pathname === item.href
                        ? "bg-primary/20 text-primary font-semibold"
                        : "hover:bg-primary/10"
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="px-4 py-4">
            <div className="text-sm mb-3 opacity-70">{session.user?.email}</div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full flex items-center justify-center gap-2 transition-all hover:scale-105"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </Button>
          </SidebarFooter>

          <SidebarRail className="hidden sm:block" />
        </Sidebar>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute lg:hidden m-4"
            >
              <PanelLeftIcon className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-64 p-0 bg-background/95 rounded-l-2xl"
          >
            <VisuallyHidden>
              <SheetTitle>Menú de navegación</SheetTitle>
            </VisuallyHidden>

            <Sidebar
              collapsible="none"
              className="flex flex-col h-full rounded-l-2xl"
            >
              <SidebarHeader className="px-4 py-4 font-bold text-lg flex items-center gap-2">
                <PackageOpen className="h-6 w-6 text-primary" />
                CONTEO
              </SidebarHeader>

              <SidebarContent className="px-3 py-4 flex-1">
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        className={`flex items-center gap-2 px-3 py-6 rounded transition-colors ${
                          pathname === item.href
                            ? "bg-primary/20 text-primary font-semibold"
                            : "hover:bg-muted/60"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="px-4 py-4">
                <div className="text-sm mb-3 opacity-70">
                  {session.user?.email}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 transition-all hover:scale-105"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </Button>
              </SidebarFooter>
            </Sidebar>
          </SheetContent>
        </Sheet>

        <main className="flex w-full h-full max-h-screen overflow-auto p-3 lg:p-4 bg-background/90">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
