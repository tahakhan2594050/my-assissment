import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (object.split(" ").length > 1) {
        return toast.error("Please enter only one object name");
      }

      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
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
      bg-gradient-to-br from-white via-white to-purple-50"
    >
      {/* LEFT PANEL */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 bg-white/90 backdrop-blur-xl
        border border-purple-200 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-purple-600" />
          <h1 className="text-xl font-semibold text-purple-700">
            Object Removal
          </h1>
        </div>

        <p className="mt-6 text-sm font-medium text-gray-700">Upload Image</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-3 mt-2 text-sm outline-none rounded-lg border 
          border-purple-300 bg-purple-50 text-gray-700 
          focus:ring-2 focus:ring-purple-300"
          required
        />

        <p className="mt-6 text-sm font-medium text-gray-700">
          Object name to remove
        </p>

        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={3}
          className="w-full p-3 mt-2 outline-none text-sm rounded-lg border 
          border-purple-300 bg-purple-50 text-gray-700
          focus:ring-2 focus:ring-purple-300"
          placeholder="e.g., spoon (Only one object name)"
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2
          bg-gradient-to-r from-purple-400 to-purple-600
          text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer
          shadow-md hover:opacity-90 transition"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>

      {/* RIGHT PANEL */}
      <div
        className="w-full max-w-lg p-6 bg-white/90 backdrop-blur-xl rounded-2xl
        border border-purple-200 shadow-lg hover:shadow-xl transition-all 
        flex flex-col min-h-96"
      >
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-purple-600" />
          <h1 className="text-xl font-semibold text-purple-700">
            Processed Image
          </h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400">
              <Scissors className="w-10 h-10" />
              <p>Upload an image and click "Remove Object"</p>
            </div>
          </div>
        ) : (
          <img
            src={content}
            alt="result"
            className="mt-4 w-full h-full object-contain rounded-md 
            border border-purple-100 shadow"
          />
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
