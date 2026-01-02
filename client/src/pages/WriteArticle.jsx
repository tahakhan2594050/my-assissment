import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" }
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const prompt = `Write an article about ${input} in ${selectedLength.text}. Format it using proper headings, subheadings, paragraphs, bullet points, and clear markdown structure. Make it clean and readable.`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 text-slate-700 
      bg-gradient-to-b from-white via-[#F7FBFF] to-[#E9F7FF] rounded-xl"
    >

      {/* LEFT PANEL */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 rounded-2xl 
        bg-white/90 backdrop-blur-xl shadow-xl border border-blue-100"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-cyan-600" />
          <h1 className="text-xl font-semibold text-slate-900">Article Configuration</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Article Topic</p>

        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-3 mt-2 outline-none text-sm rounded-lg border border-gray-300 
          focus:border-cyan-500 shadow-sm bg-white"
          placeholder="The future of artificial intelligence is..."
          required
        />

        <p className="mt-5 text-sm font-medium">Article Length</p>

        <div className="mt-3 flex gap-3 flex-wrap">
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              key={index}
              className={`text-xs px-4 py-2 rounded-full cursor-pointer border shadow-sm 
                transition-all ${
                  selectedLength.text === item.text
                    ? "bg-cyan-100 text-cyan-700 border-cyan-300 shadow-md"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 
          bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700
          text-white px-4 py-2 mt-6 text-sm rounded-lg shadow-lg transition-all"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Article
        </button>
      </form>

      {/* RIGHT PANEL */}
      <div
        className="w-full max-w-2xl p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-blue-100 
        shadow-xl flex flex-col min-h-[450px] max-h-[650px] overflow-hidden"
      >
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-cyan-600" />
          <h1 className="text-xl font-semibold text-slate-900">Generated Article</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-10 h-10" />
              <p>Enter a topic and click “Generate article” to get started.</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex-1 overflow-y-auto pr-2">
            <div className="reset-tw prose prose-sm prose-headings:text-slate-800 prose-p:text-slate-700 
            prose-li:text-slate-700 prose-strong:text-slate-900 prose-h1:text-cyan-700 prose-h2:text-cyan-700 
            prose-h3:text-cyan-700 bg-white p-5 rounded-xl shadow-inner border">

              {/* MARKDOWN RENDER */}
              <Markdown>{content}</Markdown>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
