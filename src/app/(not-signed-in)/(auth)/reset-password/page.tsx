// External Imports
import { Suspense } from "react";

// Local Imports
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

const ResetPasswordPage = () => {
  return (
    <Suspense>
      <main className="flex flex-1 flex-col items-center justify-center">
        <ResetPasswordForm />
      </main>
    </Suspense>
  );
};

export default ResetPasswordPage;
