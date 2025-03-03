// External Imports
import { redirect } from "next/navigation";

// Local Imports
import { getUser } from "@/features/auth/actions/get-user";
import { getMyBooks } from "@/features/my-books/actions/get-my-books";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

const HomePage = async () => {
  const [{ data: myBooks }, { data: user }] = await Promise.all([
    runParallelAction(getMyBooks()),
    runParallelAction(getUser()),
  ]);

  if (!user) {
    redirect("/sign-in");
  } else {
    if (myBooks?.length) {
      redirect("/my-books");
    } else {
      redirect("/search");
    }
  }
};

export default HomePage;
