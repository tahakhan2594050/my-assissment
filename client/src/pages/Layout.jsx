import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X, Settings } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import {SignIn, useUser } from '@clerk/clerk-react'

const Layout = () => {

  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const {user} = useUser()

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen'>

      <nav className='w-full px-8 min-h-16 flex items-center justify-between border-b border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-sm'>
        <img 
          className='cursor-pointer w-32 sm:w-44 hover:scale-105 transition-transform duration-300' 
          src={assets.logo} 
          alt="" 
          onClick={()=>navigate('/')} 
        />
        
        {/* Admin Panel Button in Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Admin Panel</span>
          </button>
          
          {
            sidebar ? 
            <X 
              onClick={()=> setSidebar(false)} 
              className='w-6 h-6 text-gray-600 sm:hidden hover:text-gray-900 hover:rotate-90 transition-all cursor-pointer'
            />
            : 
            <Menu 
              onClick={()=> setSidebar(true)} 
              className='w-6 h-6 text-gray-600 sm:hidden hover:text-gray-900 hover:scale-110 transition-all cursor-pointer'
            />
          }
        </div>
      </nav>
      <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
          <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>
          <div className='flex-1 bg-[#F4F7FB]'>
            <Outlet />
          </div>
      </div>
      
      
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}

export default Layout