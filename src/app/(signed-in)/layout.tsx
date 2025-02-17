// External Imports
import { ReactNode } from "react";

// Local Imports
import { Container } from "@/shared/components/container";
import { Header } from "@/shared/components/header";

type Params = Promise<{ username: string }>;

interface Props {
  children: ReactNode;
}

const BooksLayout = async ({ children }: Props) => {
  return (
    <Container className="flex min-h-dvh flex-col">
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
    </Container>
  );
};

export default BooksLayout;
