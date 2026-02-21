"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Feature } from "../types";

export async function grantFeature(
  app: Feature,
  feature: Feature
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const roles = user.publicMetadata.role ?? { main: ["user"], apps: {}, features: {} };
  const existing = roles.features?.[app] ?? [];

  await client.users.updateUser(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      role: {
        ...roles,
        features: {
          ...roles.features,
          [app]: [...new Set([...existing, feature])],
        },
      },
    },
  });
}