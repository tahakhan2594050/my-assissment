import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import React, { useState } from 'react'
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  const [activePage, setActivePage] = useState('/ai')

  // 🎨 All gradients start with WHITE → Light Color
  const colorStyles = {
    '/ai': {
      sidebar: 'from-white to-[#d7c2ff]',
      button: 'from-white to-[#d7c2ff]'
    },
    '/ai/write-article': {
      sidebar: 'from-white to-[#bfe6ff]',      // LIGHT BLUE
      button: 'from-white to-[#bfe6ff]'
    },
    '/ai/blog-titles': {
      sidebar: 'from-white to-[#ffd6eb]',      // LIGHT PINK
      button: 'from-white to-[#ffd6eb]'
    },
    '/ai/generate-images': {
      sidebar: 'from-white to-[#d9fcd3]',      // LIGHT GREEN
      button: 'from-white to-[#d9fcd3]'
    },
    '/ai/remove-background': {
      sidebar: 'from-white to-[#ffe2c2]',      // LIGHT ORANGE
      button: 'from-white to-[#ffe2c2]'
    },
    '/ai/remove-object': {
      sidebar: 'from-white to-[#e9d8ff]',      // LIGHT PURPLE
      button: 'from-white to-[#e9d8ff]'
    },
    '/ai/review-resume': {
      sidebar: 'from-white to-[#ffd4d4]',      // LIGHT RED
      button: 'from-white to-[#ffd4d4]'
    },
    '/ai/community': {
      sidebar: 'from-white to-[#d3ffe8]',      // LIGHT MINT GREEN
      button: 'from-white to-[#d3ffe8]'
    }
  }

  const activeColors = colorStyles[activePage] || colorStyles['/ai']

  return (
    <div
      className={`w-64 ${
        activePage === '/ai' || activePage === '/ai/community'
          ? 'bg-gradient-to-b from-white via-gray-50 to-white'
          : `bg-gradient-to-b ${activeColors.sidebar}`
      } backdrop-blur-2xl border-r border-gray-200/50 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 shadow-xl ${
        sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="my-8 w-full flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60 blur-lg group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
          <div className="absolute -inset-1 rounded-full bg-white/60 opacity-80 blur-sm"></div>
          <img
            src={user.imageUrl}
            alt="User"
            className="relative w-16 h-16 rounded-full border-3 border-white shadow-2xl ring-2 ring-blue-100 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h1 className="mt-4 text-lg font-bold text-gray-800 tracking-tight">
          {user.fullName}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          <Protect plan="premium" fallback="Free Plan">Premium Member</Protect>
        </p>

        <div className="px-5 mt-8 text-sm font-medium w-full space-y-2">
          {[
            { to: '/ai', label: 'Dashboard', Icon: House },
            { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
            { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
            { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
            { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
            { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
            { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
            { to: '/ai/community', label: 'Community', Icon: Users }
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => {
                setSidebar(false)
                setActivePage(to)
              }}
              className={({ isActive }) => {
                // Make Dashboard and Community button always white
                const whiteButton = to === '/ai' || to === '/ai/community'
                return `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? whiteButton
                      ? 'bg-white text-gray-900 shadow-xl shadow-blue-100/50 scale-105'
                      : `bg-gradient-to-r ${colorStyles[to].button} text-gray-900 shadow-xl scale-105`
                    : `text-gray-600 ${whiteButton ? 'hover:bg-white/80' : 'hover:bg-white/50 hover:shadow-lg'} hover:scale-102`
                }`
              }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-r-full shadow-lg"></span>
                  )}

                  <Icon
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-gray-900 scale-110' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-200/50 p-4 px-6 flex items-center justify-between bg-gradient-to-r from-white/40 via-white/60 to-white/40 backdrop-blur-xl">
        <div
          onClick={openUserProfile}
          className="flex gap-3 items-center cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 blur-md group-hover:opacity-80 transition-all"></div>
            <img
              src={user.imageUrl}
              className="relative w-10 h-10 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform"
              alt=""
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
              {user.fullName}
            </h1>
            <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="Free">Premium</Protect> Plan
            </p>
          </div>
        </div>

        <LogOut
          onClick={signOut}
          className="w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-all hover:scale-110 active:scale-95"
        />
      </div>
    </div>
  )
}

export default Sidebar
