import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkles } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Dashboard = () => {
 
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  const getDashboardData = async ()=>{
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers : {Authorization: `Bearer ${await getToken()}`}
      })

      if (data.success) {
        setCreations(data.creations)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(()=>{
    getDashboardData()
  }, [])

  return (
    <div
      className="
        h-full overflow-y-scroll p-8
        bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F1F5F9]
        relative
      "
    >
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className='relative z-10'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome back! 👋</h1>
        <p className='text-gray-600 mb-8'>Here's what's happening with your creations today.</p>
        
        <div className='flex justify-start gap-6 flex-wrap mb-8'>
          
          {/* Total Creations Card  */}
          <div className='group relative flex justify-between items-center w-80 p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300'>
              <div className='absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
              <div className='relative text-slate-700'>
                <p className='text-sm font-medium text-gray-500 uppercase tracking-wide'>Total Creations</p>
                <h2 className='text-4xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text'>{creations.length}</h2>
              </div>
              <div className='relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center shadow-lg shadow-blue-300/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                <Sparkles className='w-7 text-white' />
              </div>
          </div>

          {/* Active Plan Card  */}
          <div className='group relative flex justify-between items-center w-80 p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300'>
              <div className='absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
              <div className='relative text-slate-700'>
                <p className='text-sm font-medium text-gray-500 uppercase tracking-wide'>Active Plan</p>
                <h2 className='text-4xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text'>
                  <Protect plan='premium' fallback="Free">Premium</Protect>
                </h2>
              </div>
              <div className='relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center shadow-lg shadow-purple-300/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                <Gem className='w-7 text-white' />
              </div>
          </div>

        </div>
      </div>

      {
        loading ? 
        (
          <div className='relative z-10 flex flex-col justify-center items-center h-96'>
            <div className='relative'>
              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-xl opacity-50 animate-pulse'></div>
              <div className='relative animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600'></div>
            </div>
            <p className='mt-6 text-gray-600 font-medium animate-pulse'>Loading your creations...</p>
          </div>
        )
        :
        (
          <div className='relative z-10 space-y-4'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-800'>Recent Creations</h2>
              <span className='text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full border border-gray-200'>{creations.length} items</span>
            </div>
            {
              creations.length > 0 ? (
                creations.map((item)=> <CreationItem key={item.id} item={item}/>)
              ) : (
                <div className='flex flex-col items-center justify-center h-64 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200'>
                  <Sparkles className='w-16 h-16 text-gray-300 mb-4' />
                  <p className='text-gray-500 text-lg font-medium'>No creations yet</p>
                  <p className='text-gray-400 text-sm mt-2'>Start creating something amazing!</p>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default Dashboard
