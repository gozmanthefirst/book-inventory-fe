// Local Imports
import { authClient } from "@/shared/lib/auth/auth-client";

export const signOut = async () => {
  try {
    await authClient.signOut();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
