// External Imports
import { Suspense } from "react";

// Local Imports
import { Search } from "@/features/search/components/search";

const SearchPage = async () => {
  return (
    <Suspense>
      <div className="flex flex-1 flex-col py-4">
        <Search />
      </div>
    </Suspense>
  );
};

export default SearchPage;
