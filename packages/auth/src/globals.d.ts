import type { AppUserMetadata } from "./types";

declare module "@clerk/types" {
  type UserPublicMetadata = AppUserMetadata;
}

export {};