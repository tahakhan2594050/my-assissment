import { useState, useEffect } from 'react'
import { Users, FileText, BarChart3, Settings, Trash2, Edit, Plus, Eye, TrendingUp, Activity, Shield, Crown, Zap, Globe, Calendar, Clock, Star, Award } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [creations, setCreations] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  // Fetch admin data
  const fetchAdminData = async () => {
    try {
      console.log('Fetching admin data...');
      
      // For testing: make requests without auth headers
      const [usersRes, creationsRes, statsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/creations'),
        axios.get('/api/admin/stats')
      ]);

      console.log('Admin data responses:', {
        users: usersRes.data,
        creations: creationsRes.data,
        stats: statsRes.data
      });

      setUsers(usersRes.data.users || [])
      setCreations(creationsRes.data.creations || [])
      setStats(statsRes.data.stats || {})
    } catch (error) {
      console.error('Admin data fetch error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(`Failed to load admin data: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  // Delete user
  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user and all their creations?')) return

    try {
      await axios.delete(`/api/admin/users/${userId}`)
      toast.success('User deleted successfully')
      fetchAdminData()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  // Delete creation
  const deleteCreation = async (creationId) => {
    if (!confirm('Are you sure you want to delete this creation?')) return

    try {
      await axios.delete(`/api/admin/creations/${creationId}`)
      toast.success('Creation deleted successfully')
      fetchAdminData()
    } catch (error) {
      toast.error('Failed to delete creation')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
          <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin animation-delay-300"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-purple-200">AI Content Platform Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full">
                <span className="text-green-300 text-sm font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Advanced Sidebar */}
          <div className="w-80 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 h-fit">
            <nav className="space-y-3">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
                { id: 'users', label: 'User Management', icon: Users, color: 'from-purple-500 to-pink-500', count: users.length },
                { id: 'creations', label: 'Content Hub', icon: FileText, color: 'from-green-500 to-emerald-500', count: creations.length },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
                { id: 'settings', label: 'System Settings', icon: Settings, color: 'from-gray-500 to-slate-500' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-4 text-left rounded-xl transition-all duration-300 group ${
                    activeTab === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-purple-500/25 scale-105`
                      : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-102'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 transition-all duration-300 ${
                      activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === item.id ? 'bg-white/20' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Quick Stats in Sidebar */}
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-purple-200">
                  <span>Active Users</span>
                  <span className="font-bold text-white">{stats.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>Total Content</span>
                  <span className="font-bold text-white">{stats.totalCreations || 0}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>Published</span>
                  <span className="font-bold text-green-400">{stats.publishedCreations || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Dashboard Overview
                  </h2>
                  <div className="flex items-center space-x-2 text-purple-200">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                
                {/* Advanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      title: 'Total Users', 
                      value: stats.totalUsers || 0, 
                      icon: Users, 
                      color: 'from-blue-500 to-cyan-500',
                      bgColor: 'from-blue-500/20 to-cyan-500/20',
                      change: '+12%',
                      changeColor: 'text-green-400'
                    },
                    { 
                      title: 'Total Content', 
                      value: stats.totalCreations || 0, 
                      icon: FileText, 
                      color: 'from-green-500 to-emerald-500',
                      bgColor: 'from-green-500/20 to-emerald-500/20',
                      change: '+8%',
                      changeColor: 'text-green-400'
                    },
                    { 
                      title: 'Published Items', 
                      value: stats.publishedCreations || 0, 
                      icon: Globe, 
                      color: 'from-purple-500 to-pink-500',
                      bgColor: 'from-purple-500/20 to-pink-500/20',
                      change: '+15%',
                      changeColor: 'text-green-400'
                    },
                    { 
                      title: 'AI Articles', 
                      value: stats.articles || 0, 
                      icon: Award, 
                      color: 'from-orange-500 to-red-500',
                      bgColor: 'from-orange-500/20 to-red-500/20',
                      change: '+23%',
                      changeColor: 'text-green-400'
                    }
                  ].map((stat, index) => (
                    <div key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} backdrop-blur-md rounded-2xl border border-white/20 p-6 group hover:scale-105 transition-all duration-300`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`px-2 py-1 ${stat.changeColor} bg-white/10 rounded-full text-xs font-bold`}>
                          {stat.change}
                        </div>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-white mt-1">{stat.value.toLocaleString()}</p>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full"></div>
                    </div>
                  ))}
                </div>

                {/* Advanced Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-purple-400" />
                        Recent Activity
                      </h3>
                      <button className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {creations.slice(0, 5).map((creation, index) => (
                        <div key={creation.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white truncate">{creation.title || 'Untitled'}</p>
                            <p className="text-sm text-white/60">by {creation.user?.email}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              creation.type === 'article' ? 'bg-blue-500/20 text-blue-300' :
                              creation.type === 'blog-title' ? 'bg-green-500/20 text-green-300' :
                              'bg-purple-500/20 text-purple-300'
                            }`}>
                              {creation.type}
                            </span>
                            <p className="text-xs text-white/40 mt-1">
                              {new Date(creation.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Health */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-green-400" />
                        System Health
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">Optimal</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Database', status: 'Healthy', percentage: 98, color: 'bg-green-500' },
                        { label: 'API Response', status: 'Fast', percentage: 95, color: 'bg-blue-500' },
                        { label: 'User Activity', status: 'High', percentage: 87, color: 'bg-purple-500' },
                        { label: 'Storage', status: 'Good', percentage: 76, color: 'bg-orange-500' }
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{item.label}</span>
                            <span className="text-white/60 text-sm">{item.status}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    User Management
                  </h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg">
                    <Plus className="w-4 h-4 mr-2 inline" />
                    Add User
                  </button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">Content</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {users.map((user, index) => (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <img 
                                    className="h-12 w-12 rounded-full border-2 border-purple-400/50 group-hover:border-purple-400 transition-colors" 
                                    src={user.imageUrl || '/default-avatar.png'} 
                                    alt="" 
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-xs text-white/60">
                                    Member #{index + 1}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{user.email}</div>
                              <div className="text-xs text-white/60">
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-white">{user.creationCount}</span>
                                <div className="text-xs text-white/60">
                                  <div>creations</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'creations' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      Content Hub
                    </h2>
                    <p className="text-purple-200 mt-1">Manage all AI-generated content</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="all" className="bg-slate-800">All Types</option>
                      <option value="article" className="bg-slate-800">Articles</option>
                      <option value="blog-title" className="bg-slate-800">Blog Titles</option>
                      <option value="image" className="bg-slate-800">Images</option>
                    </select>
                    <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg">
                      <Plus className="w-4 h-4 mr-2 inline" />
                      Create Content
                    </button>
                  </div>
                </div>

                {/* Content Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-500/20 backdrop-blur-md rounded-xl border border-blue-400/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-300 text-sm font-medium">Articles</p>
                        <p className="text-2xl font-bold text-white">{stats.articles || 0}</p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-md rounded-xl border border-green-400/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-300 text-sm font-medium">Blog Titles</p>
                        <p className="text-2xl font-bold text-white">{stats.blogTitles || 0}</p>
                      </div>
                      <Star className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <div className="bg-purple-500/20 backdrop-blur-md rounded-xl border border-purple-400/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-300 text-sm font-medium">Images</p>
                        <p className="text-2xl font-bold text-white">{stats.images || 0}</p>
                      </div>
                      <Eye className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                  <div className="bg-orange-500/20 backdrop-blur-md rounded-xl border border-orange-400/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-300 text-sm font-medium">Published</p>
                        <p className="text-2xl font-bold text-white">{stats.publishedCreations || 0}</p>
                      </div>
                      <Globe className="w-8 h-8 text-orange-400" />
                    </div>
                  </div>
                </div>
                
                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {creations.map((creation, index) => (
                    <div key={creation.id} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 group hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${
                          creation.type === 'article' ? 'bg-blue-500/20 text-blue-400' :
                          creation.type === 'blog-title' ? 'bg-green-500/20 text-green-400' :
                          creation.type === 'image' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {creation.type === 'article' ? <FileText className="w-6 h-6" /> :
                           creation.type === 'blog-title' ? <Star className="w-6 h-6" /> :
                           creation.type === 'image' ? <Eye className="w-6 h-6" /> :
                           <FileText className="w-6 h-6" />}
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          creation.type === 'article' ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' :
                          creation.type === 'blog-title' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                          creation.type === 'image' ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' :
                          'bg-orange-500/20 text-orange-300 border-orange-400/30'
                        }`}>
                          {creation.type}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                          {creation.title || 'Untitled Content'}
                        </h3>
                        <p className="text-white/60 text-sm line-clamp-3">
                          {creation.content?.substring(0, 150)}...
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                          <div>
                            <p className="text-white text-sm font-medium">{creation.user?.email?.split('@')[0]}</p>
                            <p className="text-white/60 text-xs">{new Date(creation.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                          Published
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-1">
                          <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCreation(creation.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-white/40 text-xs">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {creations.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Content Yet</h3>
                    <p className="text-white/60 mb-6">Start creating amazing AI-generated content</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg">
                      <Plus className="w-5 h-5 mr-2 inline" />
                      Create Your First Content
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Content Performance</h3>
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-white/60">Analytics coming soon...</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">User Engagement</h3>
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <p className="text-white/60">Engagement metrics coming soon...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  System Settings
                </h2>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-white/60">System settings panel coming soon...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel