// External Imports
import { Suspense } from "react";

// Local Imports
import { getUser } from "@/features/auth/actions/get-user";
import { Search } from "@/features/search/components/search";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

const SearchPage = async () => {
  const [{ data: user }] = await Promise.all([runParallelAction(getUser())]);

  console.log("USER:", user);

  return (
    <Suspense>
      <div className="flex flex-1 flex-col py-4">
        <Search />
      </div>
    </Suspense>
  );
};

export default SearchPage;
