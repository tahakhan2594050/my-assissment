import { Eraser, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", input);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
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
      bg-gradient-to-br from-white via-white to-orange-50"
    >
      {/* LEFT PANEL */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 bg-white/90 backdrop-blur-xl 
        border border-orange-200 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-orange-600" />
          <h1 className="text-xl font-semibold text-orange-700">
            Background Removal
          </h1>
        </div>

        <p className="mt-6 text-sm font-medium text-gray-700">Upload Image</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-3 mt-2 outline-none text-sm rounded-lg border 
          border-orange-300 bg-orange-50 text-gray-700 
          focus:ring-2 focus:ring-orange-300"
          required
        />

        <p className="text-xs text-gray-500 font-light mt-1">
          Supports JPG, PNG, and other image formats
        </p>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2
          bg-gradient-to-r from-orange-400 to-orange-600
          text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer
          shadow-md hover:opacity-90 transition"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          Remove Background
        </button>
      </form>

      {/* RIGHT PANEL */}
      <div
        className="w-full max-w-lg p-6 bg-white/90 backdrop-blur-xl rounded-2xl 
        border border-orange-200 shadow-lg hover:shadow-xl transition-all 
        min-h-96 flex flex-col"
      >
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-orange-600" />
          <h1 className="text-xl font-semibold text-orange-700">
            Processed Image
          </h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400">
              <Eraser className="w-10 h-10" />
              <p>Upload an image and click "Remove Background"</p>
            </div>
          </div>
        ) : (
          <img
            src={content}
            alt="output"
            className="mt-4 w-full h-full object-contain rounded-md 
            border border-orange-100 shadow"
          />
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
