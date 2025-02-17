// External Imports
import { ReactNode } from "react";

// Local Imports
import { AuthHeader } from "@/features/auth/components/auth-header";
import { Container } from "@/shared/components/container";

interface Props {
  children: ReactNode;
}

const AuthLayout = async ({ children }: Props) => {
  return (
    <Container className="flex min-h-dvh flex-col">
      <AuthHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </Container>
  );
};

export default AuthLayout;
