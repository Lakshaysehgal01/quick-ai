import { useAuth } from "@clerk/clerk-react";
import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axios";
import Markdown from "react-markdown";
import type { AxiosError } from "axios";

const ReviewResume = () => {
  const [inputValue, setInputValue] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const { getToken } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!inputValue) {
        toast.error("Please upload a image");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", inputValue);
      const res = await axiosInstance.post("/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      setContent(res.data.message);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
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
          <Sparkles className="w-6 text-[#00da83]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <input
          type="file"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
          accept="application/pdf"
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF resume only
        </p>
        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00da83] to-[#009bb3] text-white py-2 px-4 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <FileText className="w-5" />
          )}
          Review Resume
        </button>
      </form>

      {/* Right Col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] ">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#00da83]" />
          <h1 className="text-xl font-semibold">Analysis Result</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-9 h-9 " />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
