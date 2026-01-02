import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Logo animation — fully transparent background
  const logoClasses = `
    w-32 sm:w-44 cursor-pointer transition-all duration-500 ease-in-out 
    hover:scale-110 hover:rotate-2
    drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]
  `

  // Button styling with ice blue background and white text
  const buttonClasses = `
    flex items-center gap-2 rounded-full text-sm cursor-pointer 
    bg-[#99c5ff] text-white 
    px-8 py-2.5 font-semibold
    shadow-lg shadow-[#99c5ff]/40
    transition-all duration-500 ease-in-out 
    hover:bg-white hover:text-[#99c5ff]
    hover:scale-[1.07] hover:shadow-[#99c5ff]/70 active:scale-[0.96]
  `

  const arrowClasses = 'w-4 h-4 transition-transform duration-300 group-hover:translate-x-1'

  return (
    <div
      className={`
        fixed top-0 left-0 w-full flex justify-between items-center
        py-4 px-4 sm:px-20 xl:px-32
        transition-all duration-500 ease-in-out
        ${scrolled ? 'backdrop-blur-md bg-white/5' : 'bg-transparent backdrop-blur-0'}
        z-10 pointer-events-auto
      `}
    >
      <img
        src={assets.logo}
        alt="logo"
        className={logoClasses}
        onClick={() => navigate('/')}
        style={{ backgroundColor: 'transparent' }}
      />

      {user ? (
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: 'w-10 h-10',
              userButtonPopoverCard: 'shadow-2xl'
            }
          }}
        />
      ) : (
        <button onClick={openSignIn} className={`group ${buttonClasses}`}>
          Get started
          <ArrowRight className={arrowClasses} />
        </button>
      )}
    </div>
  )
}

export default Navbar
