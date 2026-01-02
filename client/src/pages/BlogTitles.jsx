import { useAuth } from '@clerk/clerk-react';
import { Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Travel',
    'Food',
  ];

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;

      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { prompt },
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
      className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 
      text-slate-700 bg-gradient-to-b from-white via-[#FFF3FA] to-[#FFE6F2]"
    >
      {/* LEFT CARD */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 rounded-2xl bg-white/90 backdrop-blur-xl
        shadow-xl border border-pink-200 transition-all hover:shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-7 text-pink-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-wide">
            AI Title Generator
          </h1>
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-700">Keyword</p>

        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-3 mt-2 outline-none text-sm rounded-lg border border-gray-300
          focus:border-pink-500 bg-white shadow-sm focus:shadow-md transition-all"
          placeholder="The future of artificial intelligence..."
          required
        />

        <p className="mt-6 text-sm font-semibold text-slate-700">Category</p>

        <div className="mt-3 flex gap-2 flex-wrap">
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-2 rounded-full cursor-pointer border shadow-sm transition-all
              ${
                selectedCategory === item
                  ? 'bg-pink-100 text-pink-700 border-pink-300 shadow-md'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2
          bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700
          text-white px-4 py-2 mt-7 text-sm rounded-lg shadow-lg transition-all"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Title
        </button>
      </form>

      {/* RIGHT CARD */}
      <div
        className="w-full max-w-lg p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-pink-200
        shadow-xl hover:shadow-2xl transition-all flex flex-col min-h-[450px] max-h-[650px] overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-2">
          <Hash className="w-6 h-6 text-pink-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-wide">
            Generated Titles
          </h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-10 h-10" />
              <p>Enter a keyword and click “Generate Title” to get started.</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex-1 overflow-y-auto pr-2">
            <div className="prose prose-sm text-slate-700 leading-relaxed bg-white 
            p-5 rounded-xl shadow-inner border">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
