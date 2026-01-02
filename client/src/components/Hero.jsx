import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import { motion } from 'framer-motion'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section
      className="
        relative flex flex-col justify-center items-center text-center
        min-h-screen px-6 sm:px-12 lg:px-24 
        bg-white
        overflow-hidden
      "
    >
      {/* Centered #e2eefd in the middle only */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-b 
          from-white 
          via-[#e2eefd] 
          to-white
          pointer-events-none
        "
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="
            text-4xl sm:text-6xl lg:text-7xl 
            font-extrabold leading-tight tracking-tight 
            text-gray-800
          "
        >
          Powerful{" "}
          <span className="bg-gradient-to-r from-[#A1C4FD] to-[#C2E9FB] text-transparent bg-clip-text">
            AI Tools
          </span>
          <br className="hidden sm:block" />
          for Modern Creators
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mt-5 text-[#4a4a5e] text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Transform your creative journey with AI-powered tools that help you
          write, design, and innovate — all in one clean, powerful workspace.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.6 } },
          }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <motion.button
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate('/ai')}
            className="
              bg-gradient-to-r from-[#A1C4FD] to-[#C2E9FB] 
              text-white px-8 sm:px-12 py-3 rounded-full font-semibold
              shadow-[0_4px_20px_rgba(153,197,255,0.4)]
              hover:scale-[1.05] active:scale-95 transition
            "
          >
            Start Creating
          </motion.button>

          <motion.button
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5 }}
            className="
              flex items-center gap-2 
              bg-white px-8 sm:px-12 py-3 rounded-full border border-gray-200
              text-[#333] hover:bg-gray-50 hover:scale-[1.05] active:scale-95 
              transition
            "
          >
            <Play size={18} className="text-[#99c5ff]" />
            Watch Demo
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center justify-center gap-3 mt-10 text-gray-600 text-sm"
        >
          <span>
            Start Creating<span className="font-semibold text-[#99c5ff]"> NOW</span>{" "}
             and unleash your imagination like never before.
          </span>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
