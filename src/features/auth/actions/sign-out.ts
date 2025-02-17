// Local Imports
import { signOut as signout } from "@/shared/lib/auth/auth-client";

export const signOut = async () => {
  try {
    await signout();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
