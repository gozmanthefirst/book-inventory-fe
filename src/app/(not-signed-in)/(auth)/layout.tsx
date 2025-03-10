// External Imports
import { ReactNode } from "react";

// Local Imports
import { getUser } from "@/features/auth/actions/get-user";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { Container } from "@/shared/components/container";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { redirect } from "next/navigation";

interface Props {
  children: ReactNode;
}

const AuthLayout = async ({ children }: Props) => {
  const { data: user } = await runParallelAction(getUser());

  if (user) {
    redirect("/search");
  }

  return (
    <Container className="flex min-h-dvh flex-col">
      <AuthHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </Container>
  );
};

export default AuthLayout;
