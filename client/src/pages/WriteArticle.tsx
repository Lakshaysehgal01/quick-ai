import { useAuth } from "@clerk/clerk-react";
import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import Markdown from "react-markdown";

const WriteArticle = () => {
  const articleLengthOptions = [
    { length: 800, label: "Short (500-800 words)" },
    { length: 1200, label: "Medium (800-1200 words)" },
    { length: 1600, label: "Long (1200+ words)" },
  ];
  const [selectedLength, setSelectedLength] = useState(articleLengthOptions[0]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/ai/generate-article",
        {
          prompt: inputValue,
          length: selectedLength.length,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      setContent(res.data);
    } catch (error) {
      toast.error(error as string);
      console.log(error);
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
          <Sparkles className="w-6 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artifical intelligance is ..."
          required
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {articleLengthOptions.map((item, index) => (
            <span
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.length === item.length
                  ? "bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-500"
              } transition-all duration-100`}
              onClick={() => setSelectedLength(item)}
            >
              {item.label}
            </span>
          ))}
        </div>
        <br />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#226bff] to-[#65adff] text-white py-2 px-4 mt-6 text-sm rounded-lg cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Article
        </button>
      </form>

      {/* Right Col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-9 h-9 " />
              <p>Enter a topic and click "Generate article" to get started</p>
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

export default WriteArticle;
