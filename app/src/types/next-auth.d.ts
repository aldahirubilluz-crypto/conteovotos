// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
};

declare module "next-auth" {
  interface Session {
    user: UserResponse;
  }
}

declare module "next-auth/jwt" {
  type JWT = UserResponse;
}
