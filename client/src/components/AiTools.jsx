import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignUp } = useClerk();

  const handleActivate = (path) => {
    if (user) {
      navigate(path);
    } else {
      openSignUp();
    }
  };

  const handleKeyDown = (e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate(path);
    }
  };

  return (
    <section
      className="
        relative min-h-screen px-6 sm:px-12 lg:px-24 xl:px-32 py-20
        bg-gradient-to-b 
        from-white 
        via-[#e2eefd] 
        to-white
        overflow-hidden
      "
    >
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent z-10"></div>

      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-40 w-[400px] h-[400px] bg-[#A1C4FD]/30 blur-[160px] rounded-full"></div>
        <div className="absolute -bottom-32 -left-40 w-[400px] h-[400px] bg-[#C2E9FB]/30 blur-[160px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-20 text-center max-w-2xl mx-auto"
      >
        <h2 className="text-[2.5rem] font-extrabold text-gray-800 sm:text-5xl tracking-tight">
          Powerful{" "}
          <span className="bg-gradient-to-r from-[#A1C4FD] to-[#C2E9FB] text-transparent bg-clip-text">
            AI Tools
          </span>
        </h2>
        <p className="text-[#4a4a5e] mt-3 text-lg leading-relaxed">
          Explore a new generation of smart tools designed to boost your
          creativity and productivity — all in one elegant workspace.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
        }}
        className="relative z-20 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-center"
      >
        {AiToolsData.map((tool, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            role="button"
            tabIndex={0}
            aria-pressed="false"
            onClick={() => handleActivate(tool.path)}
            onKeyDown={(e) => handleKeyDown(e, tool.path)}
            className="group relative p-8 rounded-3xl cursor-pointer backdrop-blur-xl shadow-md border border-white/50 transition-all duration-300 hover:-translate-y-2"
            style={{
              background: tool.color,
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              borderColor: "rgba(255,255,255,0.6)",
            }}
          >
            <div
              className="relative w-16 h-16 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform"
              style={{
                background: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(10px)",
              }}
            >
              <tool.Icon className="w-8 h-8 text-gray-900" />
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              {tool.title}
            </h3>
            <p className="text-gray-700 text-sm mt-3 leading-relaxed">
              {tool.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AiTools;
