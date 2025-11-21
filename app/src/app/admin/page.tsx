import LoginForm from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/loginvoto.jpg')",
        }}
      />

      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>

      {/* Dark overlay for readability */}
      <div className="fixed inset-0 -z-10 bg-black/40 dark:bg-black/50" />

      {/* Primary gradient base */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-background/70 via-background/50 to-primary/5" />

        {/* Decorative circles - top right */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />

        {/* Decorative circles - bottom left */}
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-accent/2 rounded-full blur-3xl" />
      </div>

      {/* Top decorative bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-accent to-transparent" />

      {/* Center content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
