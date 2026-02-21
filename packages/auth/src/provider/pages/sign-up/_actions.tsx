'use server'

import { updatePublicMetadata } from "../../server";

export const completeOnboarding = async (interests: string[] ) => {

  if (!Array.isArray(interests) || interests.length === 0) {
    return { error: "Invalid interests" };
  }

  try {
    const res = await updatePublicMetadata({
        onboardingComplete: true,
        togetherInterests: interests,
    });

    return { message: true };
  } catch (err: any) {
    console.error("[interests] Update failed:", err);
    return{ error: "Failed to save" };
  }
}