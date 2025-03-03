// External Imports
import { redirect } from "next/navigation";

// Local Imports
import { getUser } from "@/features/auth/actions/get-user";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

const HomePage = async () => {
  const { data: user } = await runParallelAction(getUser());

  if (!user) {
    redirect("/sign-in");
  } else {
    redirect("/my-books");
  }
};

export default HomePage;
