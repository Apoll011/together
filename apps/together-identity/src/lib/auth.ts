import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, twoFactor, username } from "better-auth/plugins";
import { clientPromise as client, getDb } from "@/lib/db";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import type { GlobalRole, AppRoles } from "@/types/auth";
import { oauthProvider } from "@better-auth/oauth-provider";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("Missing environment variable: BETTER_AUTH_SECRET");
}


export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_IDENTITY_URL ?? "http://localhost:3001",
  basePath: "/api/auth",
  
  database: mongodbAdapter(await getDb(), {client: await client}),

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,       // refresh if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5-minute client-side cache
    },
    storeSessionInDatabase: true
  },

  silenceWarnings: {
    oauthAuthServerConfig: true
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // Set to parent domain in production for cross-app SSO
      // domain: ".together.app",
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    sendResetPassword: async ({ user, url }) => {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get("token") ?? url;
      await sendPasswordResetEmail(user.email, token);
    },

    resetPasswordTokenExpiresIn: 60 * 15, // 15 minutes
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 hours

    sendVerificationEmail: async ({ user, url }) => {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get("token") ?? url;
      await sendVerificationEmail(user.email, token);
    },
  },

  /*socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    },
  },*/

  plugins: [
    twoFactor({
      issuer: "Together",
      totpOptions: { period: 30, digits: 6 },
      backupCodes: {
        enabled: true,
        count: 10,
        length: 10,
      },
    }),
    username({
      minUsernameLength: 4,
      maxUsernameLength: 25
    }),
    jwt(),
    oauthProvider({
      loginPage: "/login",
      consentPage: "/consent",
    })
  ],

  user: {
    additionalFields: {
      roles: {
        type: "string[]",
        required: false,
        defaultValue: ["user"] satisfies GlobalRole[],
        fieldName: "roles",
      },
      appRoles: {
        type: "string",
        required: false,
        defaultValue: JSON.stringify({} satisfies AppRoles),
        fieldName: "appRoles",
      }
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      requireEmailVerification: true,
    },
  },
});


export async function getUserById(id: string) {
  const db = await getDb();
  return db.collection("users").findOne({ _id: id as unknown as never });
}

export type Auth = typeof auth;
