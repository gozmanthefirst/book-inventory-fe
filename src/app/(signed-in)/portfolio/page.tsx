// External Imports
import { Suspense } from "react";

// Local Imports
import { Portfolio } from "@/features/portfolio/components/portfolio";

const PortfolioPage = async () => {
  return (
    <Suspense>
      <div className="flex flex-1 flex-col py-4">
        <Portfolio />
      </div>
    </Suspense>
  );
};

export default PortfolioPage;
