import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { AxiosError } from "axios";

const Community = () => {
  const [creations, setCreations] = useState<Community[]>([]);
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const { getToken } = useAuth();
  const fetchCreation = async () => {
    try {
      const res = await axiosInstance.get("/user/published-creation", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      setCreations(res.data);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      fetchCreation();
    }
  }, [user]);
  const imageLikeToggle = async (id: number) => {
    try {
      const res = await axiosInstance.post(
        "/user/toggle-like",
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      toast.success(res.data);
      await fetchCreation();
    } catch (err) {
      console.log(err);
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      Creations
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
          >
            <img
              src={creation.content}
              alt="image"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>
              <div className="flex gap-1 items-center">
                <p>{creation.likedBy.length}</p>
                <Heart
                  onClick={() => imageLikeToggle(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.likedBy.includes(user?.id as string)
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    </div>
  );
};

export default Community;
