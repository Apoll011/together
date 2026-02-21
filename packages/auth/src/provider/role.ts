"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { AppRole } from "../types";
import { AppKey } from "@repo/together-apps/types";

export async function addAppRole(
  app: AppKey,
  role: AppRole
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const roles = user.publicMetadata.role ?? { main: ["user"], apps: {}, features: {} };

  const existing = roles.apps?.[app] ?? [];

  await client.users.updateUser(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      role: {
        ...roles,
        apps: {
          ...roles.apps,
          [app]: [...new Set([...existing, role])],
        },
      },
    },
  });
}