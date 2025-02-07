// External Imports
import { ReactNode } from "react";

// Local Imports
import { Container } from "@/shared/components/container";
import { LogoHeader } from "@/shared/components/logo-header";

type Params = Promise<{ username: string }>;

interface Props {
  children: ReactNode;
  params: Params;
}

const BooksLayout = async ({ children, params }: Props) => {
  return (
    <Container className="flex min-h-dvh flex-col">
      <LogoHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </Container>
  );
};

export default BooksLayout;
