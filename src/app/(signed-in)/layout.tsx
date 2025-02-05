// External Imports
import { ReactNode } from "react";

// Local Imports
import { Container } from "@/shared/components/container";

type Params = Promise<{ username: string }>;

interface Props {
  children: ReactNode;
  params: Params;
}

const BooksLayout = async ({ children, params }: Props) => {
  return (
    <Container className="min-h-dvh">
      <div className="flex-1">{children}</div>
    </Container>
  );
};

export default BooksLayout;
