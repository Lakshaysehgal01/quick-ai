import { useAuth } from "@clerk/clerk-react";
import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axios";
import Markdown from "react-markdown";
import type { AxiosError } from "axios";

const BlogTitle = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Health",
    "Lifestyle",
    "Travel",
    "Education",
    "Food",
    "Business",
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>(
    blogCategories[0]
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/ai/generate-blog-title",
        {
          prompt: inputValue,
          category: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      setContent(res.data);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          <Sparkles className="w-6 text-[#8e37eb]" />
          <h1 className="text-xl font-semibold">Ai Title Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artifical intelligance is ..."
          required
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item, index) => (
            <span
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-purple-50 text-purple-700"
                  : "border-gray-300 text-gray-500"
              } transition-all duration-100`}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#c341f6] to-[#8e37eb] text-white py-2 px-4 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Title
        </button>
      </form>

      {/* Right Col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8e37eb]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9 " />
              <p>Enter a topic and click "Generate title" to get started</p>
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

export default BlogTitle;
