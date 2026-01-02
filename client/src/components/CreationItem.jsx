import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { ChevronDown, ChevronUp, Image as ImageIcon, FileText } from 'lucide-react'

const CreationItem = ({item}) => {

    const [expanded, setExpanded] = useState(false)

    const typeColors = {
      image: 'from-green-400 to-emerald-500',
      article: 'from-blue-400 to-cyan-500',
      blog: 'from-purple-400 to-pink-500',
      resume: 'from-orange-400 to-red-500',
      default: 'from-gray-400 to-gray-500'
    }

    const typeIcons = {
      image: ImageIcon,
      article: FileText,
      blog: FileText,
      resume: FileText,
      default: FileText
    }

    const gradient = typeColors[item.type] || typeColors.default
    const Icon = typeIcons[item.type] || typeIcons.default

  return (
    <div 
      onClick={()=> setExpanded(!expanded)} 
      className='group relative p-6 max-w-5xl bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300'
    >
        <div className='flex justify-between items-start gap-4'>
            <div className='flex-1'>
                <h2 className='text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-2'>{item.prompt}</h2>
                <p className='text-sm text-gray-500 mt-2 flex items-center gap-2'>
                  <span className='capitalize font-medium'>{item.type}</span>
                  <span className='w-1 h-1 rounded-full bg-gray-400'></span>
                  <span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </p>
            </div>
            <div className='flex items-center gap-3'>
              <div className={`flex items-center gap-2 bg-gradient-to-r ${gradient} text-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold uppercase tracking-wide`}>
                <Icon className='w-4 h-4' />
                {item.type}
              </div>
              {expanded ? 
                <ChevronUp className='w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors' /> 
                : 
                <ChevronDown className='w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors' />
              }
            </div>
        </div>
        {
            expanded && (
                <div className='mt-6 pt-6 border-t border-gray-200'>
                    {item.type === 'image' ? (
                        <div className='flex justify-center'>
                            <img 
                              src={item.content} 
                              alt="creation" 
                              className='rounded-xl shadow-2xl w-full max-w-2xl border-4 border-white hover:scale-105 transition-transform duration-300'
                            />
                        </div>
                    ) : (
                        <div className='max-h-96 overflow-y-auto text-sm text-slate-700 bg-gray-50/50 rounded-xl p-6 border border-gray-200'>
                            <div className='reset-tw prose prose-sm max-w-none'>
                                <Markdown>{item.content}</Markdown>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    </div>
  )
}

export default CreationItem
