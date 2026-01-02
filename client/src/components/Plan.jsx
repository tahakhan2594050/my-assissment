import React from "react";
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <section
      className="
        relative px-6 sm:px-12 lg:px-24 py-24
        bg-gradient-to-b from-[#DCECFB] via-[#E8F0FF] to-white
      "
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-2xl mx-auto z-20">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-slate-700 text-[42px] font-semibold">
            Choose Your Plan
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Start for free and scale up as you grow. Find the perfect plan for
            your content creation needs.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="mt-14 max-smm:mx-8">
          <PricingTable />
        </div>
      </div>
    </section>
  );
};

export default Plan;
