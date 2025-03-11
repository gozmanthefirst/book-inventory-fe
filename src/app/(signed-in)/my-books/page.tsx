import { Suspense } from "react";

import { MyBooks } from "@/features/my-books/components/my-books";

const MyBooksPage = async () => {
  return (
    <Suspense>
      <div className="flex flex-1 flex-col py-4">
        <MyBooks />
      </div>
    </Suspense>
  );
};

export default MyBooksPage;
