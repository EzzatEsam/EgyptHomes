import NextAuth, { DefaultSession } from "next-auth";
import { UserDTO } from "./user";
declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: UserDTO;
  }

  interface User {
    id: string;
    user: UserDTO;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: Date;
    userData: UserDTO;
  }
}
