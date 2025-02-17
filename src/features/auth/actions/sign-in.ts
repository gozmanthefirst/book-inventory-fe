// Local Imports
import { signIn } from "@/shared/lib/auth/auth-client";

export const signInWithGoogle = async () => {
  await signIn.social({
    provider: "google",
  });
};
