import { useEffect, useState } from 'react'
import { Gem, Sparkles } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import toast from 'react-hot-toast'

// Set axios defaults
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
axios.defaults.baseURL = API_BASE_URL

console.log('API Base URL:', API_BASE_URL)

const Dashboard = () => {
 
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getToken } = useAuth()

  const getDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Making API call to:', `${API_BASE_URL}/api/user/get-user-creations`)
      
      // First try without authentication for testing
      const response = await axios.get('/api/user/get-user-creations', {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      console.log('API Response:', response.data)

      if (response.data.success) {
        setCreations(response.data.creations || [])
        if (response.data.note) {
          toast.success(response.data.note)
        }
      } else {
        setError(response.data.message || 'Failed to fetch creations')
        toast.error(response.data.message || 'Failed to fetch creations')
      }
    } catch (error) {
      console.error('API Error:', error)
      
      let errorMessage = 'Network error occurred'
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - server is taking too long to respond'
      } else if (error.response) {
        // Server responded with error status
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server - check if server is running'
      } else {
        // Something else happened
        errorMessage = error.message || 'Unknown error occurred'
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
      
      // Set dummy data as fallback
      const fallbackCreations = [
        {
          id: 'fallback-1',
          title: 'Fallback Article',
          content: 'This is fallback content shown when API is not available',
          type: 'article',
          created_at: new Date().toISOString(),
          user_id: 'fallback-user'
        }
      ]
      setCreations(fallbackCreations)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
        
        {/* Debug Info */}
        <div className='mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
          <p className='text-sm text-blue-700'>
            <strong>API URL:</strong> {API_BASE_URL}
          </p>
          {error && (
            <p className='text-sm text-red-700 mt-2'>
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>
        
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
                  {error && (
                    <button 
                      onClick={getDashboardData}
                      className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                    >
                      Retry Connection
                    </button>
                  )}
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