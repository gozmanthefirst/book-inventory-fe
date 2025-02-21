// External Imports
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// Local Imports
import { getUser } from "@/features/auth/actions/get-user";
import { Container } from "@/shared/components/container";
import { Header } from "@/shared/components/header";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

interface Props {
  children: ReactNode;
}

const BooksLayout = async ({ children }: Props) => {
  const { data: user } = await runParallelAction(getUser());

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <Container className="flex min-h-dvh flex-col">
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
    </Container>
  );
};

export default BooksLayout;
