// External Imports
import { Suspense } from "react";

// Local Imports
import { MyBooks } from "@/features/my-books/components/my-books";

const SearchPage = async () => {
  return (
    <Suspense>
      <div className="flex flex-1 flex-col py-4">
        <MyBooks />
      </div>
    </Suspense>
  );
};

export default SearchPage;
