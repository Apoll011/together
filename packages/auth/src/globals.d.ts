import type { AppUserMetadata } from "./types";

declare module "@clerk/types" {
  type UserPublicMetadata = AppUserMetadata;
}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean
    }
  };
}

export {};