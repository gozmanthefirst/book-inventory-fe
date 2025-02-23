// Local Imports
import { authClient } from "@/shared/lib/auth/auth-client";

export const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
  });
};
