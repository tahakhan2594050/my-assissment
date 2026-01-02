import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ReviewResume = () => {

    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('')

    const { getToken } = useAuth()
      
    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        try {
          setLoading(true)

          const formData = new FormData()
          formData.append('resume', input)

          const { data } = await axios.post(
            '/api/ai/resume-review',
            formData,
            { headers: { Authorization: `Bearer ${await getToken()}` } }
          )

          if (data.success) {
            setContent(data.content)
          } else {
            toast.error(data.message)
          }

        } catch (error) {
          toast.error(error.message)
        }

        setLoading(false)
    }

    return (
      <div
        className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6
        bg-gradient-to-br from-white via-white to-red-50'
      >

        {/* LEFT PANEL */}
        <form
          onSubmit={onSubmitHandler}
          className='w-full max-w-lg p-6 bg-white/90 backdrop-blur-xl 
          rounded-2xl border border-red-200 shadow-lg hover:shadow-xl transition-all'
        >
            <div className='flex items-center gap-3'>
              <Sparkles className='w-6 text-red-500'/>
              <h1 className='text-xl font-semibold text-red-700'>Resume Review</h1>
            </div>

            <p className='mt-6 text-sm font-medium text-gray-700'>Upload Resume</p>

            <input 
              onChange={(e)=>setInput(e.target.files[0])}
              type="file"
              accept='application/pdf'
              className='w-full p-3 mt-2 outline-none text-sm rounded-lg border 
              border-red-300 bg-red-50 text-gray-700 focus:ring-2 focus:ring-red-300'
              required
            />

            <p className='text-xs text-gray-500 font-light mt-1'>
              Supports PDF resume only.
            </p>

            <button
              disabled={loading}
              className='w-full flex justify-center items-center gap-2
              bg-gradient-to-r from-red-400 to-red-600 text-white 
              px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer
              shadow-md hover:opacity-90 transition'
            >
              {loading
                ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
                : <FileText className='w-5' />
              }
              Review Resume
            </button>
        </form>

        {/* RIGHT PANEL */}
        <div
          className='w-full max-w-lg p-6 bg-white/90 backdrop-blur-xl rounded-2xl
          border border-red-200 shadow-lg hover:shadow-xl transition-all
          flex flex-col min-h-96 max-h-[600px]'
        >
            <div className='flex items-center gap-3'>
              <FileText className='w-5 h-5 text-red-500' />
              <h1 className='text-xl font-semibold text-red-700'>Analysis Results</h1>
            </div>

            {!content ? (
              <div className='flex-1 flex justify-center items-center'>
                <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                  <FileText className='w-9 h-9' />
                  <p>Upload a resume and click "Review Resume"</p>
                </div>
              </div>
            ) : (
              <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
                <div className='reset-tw'>
                  <Markdown>{content}</Markdown>
                </div>
              </div>
            )}
        </div>

      </div>
    )
}

export default ReviewResume;
