import { loginAction, SendGoogleToken, TryGetUser } from "@/app/actions";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";

export const authConfig: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;
        const result = await loginAction(email, password);
        if (!result.success) {
          throw new Error(result.errors![0]);
        }
        console.log(result.data);
        return {
          id: result.data!.user.id,
          user: result.data!.user,
          accessToken: result.data!.accessToken,
          refreshToken: result.data!.refreshToken,
          accessTokenExpires: result.data!.expiresAt,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account && account.provider === "google") {
        const googleToken = account.id_token;

        const result = await SendGoogleToken(googleToken!);
        if (!result.success) {
          console.log(result.errors);
          throw new Error("Failed to send google token");
        }
        token.accessToken = result.data!.accessToken;
        token.refreshToken = result.data!.refreshToken;
        token.accessTokenExpires = result.data!.expiresAt;
        token.userData = result.data!.user;
        console.log("token", token);
      } else if (user) {
        console.log("user", user);
        const { accessToken, refreshToken, accessTokenExpires } = user;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.accessTokenExpires = accessTokenExpires;
        token.userData = user.user;
      } else {
        const result = await TryGetUser(token.accessToken);
        if (!result.success) throw new Error(result.errors![0]);
        else {
          token.userData = {
            email: result.data!.email,
            id: result.data!.id,
            firstName: result.data!.firstName,
            lastName: result.data!.lastName,
            phoneNumber: result.data!.phoneNumber,
            pictureUrl: result.data!.pictureUrl,
          };
        }
      }

      if (token.accessTokenExpires < new Date()) {
        console.log("refreshing token");
        const result = await fetch(
          `${process.env.SERVER_ADDR}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refreshToken: token.refreshToken,
              accessToken: token.accessToken,
            }),
          }
        );

        if (result.ok) {
          const { accessToken, expiresAt } = await result.json();
          const expiresAtDate = new Date(expiresAt);
          token.accessToken = accessToken;
          token.accessTokenExpires = expiresAtDate;
        } else {
          throw new Error("Failed to refresh token");
        }
      }

      console.log("final token", token);
      return token;
    },
    session: async ({ session, token, user }) => {
      session.accessToken = token.accessToken;
      console.log(user);
      session.user = token.userData;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  //   pages: {
  //     signIn: "/auth/signin",
  //     signOut: "/auth/signout",
  //     error: "/auth/error", // Error code passed in query string as ?error=
  //     verifyRequest: "/auth/verify-request", // (used for check email message)
  //     newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  //   },
};

export function getAuth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig);
}
