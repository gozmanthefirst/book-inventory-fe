// External Imports
import { ReactNode } from "react";

// Local Imports
import { Container } from "@/shared/components/container";
import { LogoHeader } from "@/shared/components/logo-header";

interface Props {
  children: ReactNode;
}

const AuthLayout = async ({ children }: Props) => {
  return (
    <Container className="flex min-h-dvh flex-col">
      <LogoHeader className="fixed" />
      <div className="flex flex-1 flex-col">{children}</div>
    </Container>
  );
};

export default AuthLayout;
