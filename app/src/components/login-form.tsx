/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Lock,
  Mail,
  Shield,
  ChevronRight,
  ShieldUser,
  EyeOff,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Label } from "./ui/label";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Error de autenticación", {
          description:
            "Credenciales incorrectas. Por favor, verifica tu email y contraseña.",
        });
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("¡Bienvenido!", {
          description: "Has iniciado sesión correctamente.",
        });

        router.push("/admin/main");
        router.refresh();
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      toast.error("Error inesperado", {
        description:
          "Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo.",
      });
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/admin/main",
      });
    } catch (error) {
      console.error("Error durante Google login:", error);
      toast.error("Error inesperado", {
        description: "Ocurrió un error al iniciar sesión con Google.",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center p-2">
        <div className="relative">
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-linear-to-br from-accent via-accent/50 to-transparent opacity-20 blur-xl" />

          <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary/80 shadow-2xl flex items-center justify-center border-4 border-accent/30 hover:shadow-3xl transition-shadow duration-300">
            <Shield className="w-12 h-12 text-white drop-shadow-lg" />
          </div>

          <div className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full" />
          <div className="absolute bottom-2 left-0 w-2 h-2 bg-accent/70 rounded-full" />
        </div>

        <h1 className="text-3xl font-bold text-foreground text-center tracking-tight">
          Comité Electoral
        </h1>
      </div>

      <Card className="border-0 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-accent to-transparent" />

        <div className="absolute inset-0 opacity-5">
          <ShieldUser />
        </div>

        <CardHeader className="space-y-4 pb-8 relative z-10">
          <CardDescription className="text-center text-xs font-semibold text-foreground uppercase tracking-widest">
            Sistema de Identificación
          </CardDescription>
          <p className="text-center text-sm text-muted-foreground leading-relaxed px-2">
            Ingrese sus credenciales para continuar
          </p>
        </CardHeader>

        <CardContent className="relative z-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>

              <div className="relative">
                <Mail className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-muted-foreground" />

                <Input
                  id="email"
                  placeholder="nombre@gmail.com"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                  className="pl-9 h-11 border-border/50 focus-visible:ring-primary"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <a
                  href="/auth/identify"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-muted-foreground" />

                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={onChange}
                  className="pl-9 pr-9 h-11 border-border/50 focus-visible:ring-primary"
                  required
                  disabled={isLoading}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 inset-y-0 my-auto h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold mt-8 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 group"
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">O</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full h-12 border border-border hover:bg-accent/50 text-card-foreground rounded-xl"
            >
              <img
                src="/icons/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              {googleLoading ? "Verificando..." : "Continuar con Google"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
