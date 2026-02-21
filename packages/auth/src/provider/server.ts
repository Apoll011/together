"use server";

import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { AppUserMetadata } from "../types";
import { normalizeMetadata } from "../normalize";

/**
 * Returns normalized metadata for current user
 */
export async function readPublicMetadata(): Promise<AppUserMetadata | null> {
  const user = await currentUser();
  if (!user) return null;

  return normalizeMetadata(user.publicMetadata);
}

export async function readPrivateMetadata() {
  const user = await currentUser();
  if (!user) return null;

  return user.privateMetadata;
}

/**
 * Update public metadata safely (merge strategy)
 */
export async function updatePublicMetadata(
  data: Partial<AppUserMetadata>
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  return await client.users.updateUser(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      ...data,
    },
  });
}

/**
 * Update private metadata
 */
export async function updatePrivateMetadata(
  data: Record<string, any>
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  await client.users.updateUser(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      ...data,
    },
  });
}

export async function requireServerAuth() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}