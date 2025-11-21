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
import { Lock, Mail, Shield, ChevronRight, ShieldUser } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Por favor, completa todos los campos");
        return;
      }

      if (!email.includes("@")) {
        setError("Por favor, ingresa un correo válido");
        return;
      }

      console.log("Intento de acceso:", { email, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch {
      setError("Error al procesar tu solicitud. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center p-4">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-foreground" />
                Correo Institucional
              </label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@institucion.gob.mx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className={`pl-12 h-12 text-base border-2 transition-all duration-200 ${
                    focused === "email"
                      ? "border-accent bg-accent/5"
                      : "border-border"
                  }`}
                  disabled={isLoading}
                  aria-label="Correo institucional"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-foreground" />
                Contraseña
              </label>
              <div className="relative group">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className={`pl-12 h-12 text-base border-2 transition-all duration-200 ${
                    focused === "password"
                      ? "border-accent bg-accent/5"
                      : "border-border"
                  }`}
                  disabled={isLoading}
                  aria-label="Contraseña"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

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
