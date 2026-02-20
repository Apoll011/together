'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export const completeOnboarding = async (interests: string[] ) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'No signed-in user' }
  }

  if (!Array.isArray(interests) || interests.length === 0) {
    return { error: "Invalid interests" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        togetherInterests: interests,
      },
    });

    return { message: true };
  } catch (err: any) {
    console.error("[interests] Clerk update failed:", err);
    return{ error: "Failed to save" };
  }
}