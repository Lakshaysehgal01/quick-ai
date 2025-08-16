import { useAuth } from "@clerk/clerk-react";
import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axios";

const RemoveObject = () => {
  const [inputValue, setInputValue] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const { getToken } = useAuth();
  const [objectName, setObjectName] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (objectName.split(" ").length > 1) {
        return toast("Please Enter only 1 object name");
      }
      if (!inputValue) {
        toast.error("Please upload a image");
        return;
      }
      const formData = new FormData();

      formData.append("image", inputValue);
      formData.append("object", objectName);
      const res = await axiosInstance.post(
        "/ai/remove-image-object",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      setContent(res.data);
    } catch (error) {
      console.log(error);
      //@ts-ignore
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInputValue(e.target.files[0]);
    }
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left col */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          type="file"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
          accept="image/*"
          onChange={handleChange}
        />
        <p className="mt-6 text-sm font-medium">
          Describe object name to remove
        </p>
        <textarea
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or spoon, Only one object at a time"
          required
          onChange={(e) => setObjectName(e.target.value)}
          value={objectName}
          rows={4}
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#417df6] to-[#8e37eb] text-white py-2 px-4 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>

      {/* Right Col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9 " />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img src={content} alt="ai-image" className="w-full h-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
