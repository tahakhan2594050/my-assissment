import { Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenrateImages = () => {
  const imageStyle = [
    'Realistic',
    'Ghibli style',
    'Anime style',
    'Cartoon style',
    'Fantasy style',
    'Realistic style',
    '3D style',
    'Potrait style',
  ];

  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setContent(''); // Clear previous content

      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        if (data.warning) {
          toast.success('Image generated! (Using fallback)', { duration: 3000 });
        } else {
          toast.success('Image generated successfully!');
        }
      } else {
        toast.error(data.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate image. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 text-slate-700
      bg-gradient-to-b from-white via-[#EEFFF8] to-[#D1FFEC]"
    >
      {/* LEFT PANEL */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 bg-white/90 backdrop-blur-xl
        border border-green-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-7 text-green-600" />
          <h1 className="text-2xl font-bold text-slate-900">AI Image Generator</h1>
        </div>

        <p className="mt-6 text-sm font-semibold text-slate-700">Describe Your Image</p>

        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-3 mt-2 outline-none text-sm rounded-lg border border-gray-300
          bg-white shadow-sm focus:border-green-500 focus:shadow-md transition-all"
          placeholder="Describe what you want to see in the image..."
          required
        />

        <p className="mt-5 text-sm font-semibold text-slate-700">Style</p>

        <div className="mt-3 flex gap-2 flex-wrap">
          {imageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-2 rounded-full cursor-pointer border shadow-sm transition-all 
              ${
                selectedStyle === item
                  ? 'bg-green-100 text-green-700 border-green-400 shadow-md'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* TOGGLE */}
        <div className="my-6 flex items-center gap-3">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all"></div>
            <span
              className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full 
            shadow-sm transition-all peer-checked:translate-x-5"
            ></span>
          </label>
          <p className="text-sm font-medium">Make this image Public</p>
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2
          bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
          text-white px-4 py-2 mt-6 text-sm rounded-lg shadow-md transition-all"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* RIGHT PANEL */}
      <div
        className="w-full max-w-lg p-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-green-200 
        shadow-xl hover:shadow-2xl transition-all flex flex-col min-h-[450px]"
      >
        <div className="flex items-center gap-3">
          <Image className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold text-slate-900">Generated Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-10 h-10" />
              <p>Enter a description and click “Generate Image” to get started.</p>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex-1 overflow-hidden">
            <img
              src={content}
              alt="Generated"
              className="w-full h-full rounded-xl object-cover shadow-lg border"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrateImages;
