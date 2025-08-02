import React, { useEffect, useState } from "react";
import { dummyCreationData } from "../assets/assets";
import { Gem, Sparkles } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";

const Dashbord = () => {
  const [creation, setCreation] = useState<Creation[]>([]);
  const getCreation = async () => {
    // Fetch creations from the API
    setCreation(dummyCreationData);
  };
  useEffect(() => {
    getCreation();
  }, []);
  return (
    <div className="h-full overflow-y-scroll p-6 ">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creation card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm ">Total Creations</p>
            <h2 className="text-xl font-semibold">{creation.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588f2] to-[#0bb0d7] text-white flex items-center justify-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>
        {/* Active Plan Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm ">Active Plan</p>
            <h2 className="text-xl font-semibold"><Protect plan="premium" fallback="free">Premium</Protect></h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e823ca] to-[#ed08d6] text-white flex items-center justify-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <p className="mt-6 mb-4"> Recent Creations</p>
        {creation.map((item) => (
          <div key={item.id}>
            <CreationItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashbord;
