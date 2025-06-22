import React, {  useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Settings, Zap ,LogOut} from 'lucide-react';
import { useRef } from 'react';
const Navbar = ({user={},onLogout}) => {
    const navigate=useNavigate()
    const menuref=useRef(null)
    const [menuOpen,setMenuOpen]=useState(false)

    useEffect(()=>{
        const handleClickOutSide=(even)=>{
            if(menuref.current && !menuref.current.contains(event.target)){
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown',handleClickOutSide)
        return ()=>document.removeEventListener('mousedown',handleClickOutSide)
    },[])



    const handleMenuToggle=()=>setMenuOpen((prev)=>!prev)
    const handleLogout=()=>{
        setMenuOpen(false)
        onLogout()
    }
  return (
  <header className='sticky top-0 z-50 bg-slate-900 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>
  <div className='flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto'>
    
    {/* Logo */}
    <div 
      className='flex items-center gap-2 cursor-pointer group' 
      onClick={() => navigate('/')}
    >
      <div className='relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br
        from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg group-hover:shadow-purple-300/50
        group-hover:scale-105 transition-all duration-300'>
        <Zap className='w-6 h-6 text-white' />
        <div className='absolute -bottom-1 -middle-1 w-3 h-3 bg-white rounded-full shadow-md animate-ping' />
      </div>
      <span className='text-xl md:text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500
        to-indigo-500 bg-clip-text text-transparent tracking-wide'>
        Task~Overflow
      </span>
    </div>

    {/* Right Controls */}
    <div className='flex items-center gap-2 sm:gap-4'>

      {/* Settings button (visible on md and up) */}
      <button
        className='p-2 text-blue-200 hover:text-purple-500 transition-colors duration-300
        hover:bg-purple-50 rounded-full hidden sm:inline-flex'
        onClick={() => navigate('/profile')}
      >
        <Settings className='w-5 h-5' />
      </button>

      {/* User Dropdown */}
      <div ref={menuref} className='relative '>
        <button
          onClick={handleMenuToggle}
          className='flex items-center gap-2 bg-green-100 px-2 sm:px-3 py-2 rounded-full cursor-pointer 
          hover:bg-purple-50 transition-colors duration-300 border border-transparent 
          hover:border-purple-200'
        >
          <div className='relative'>
            {user.avatar ? (
              <img src={user.avatar} alt='Avatar' className='w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-sm' />
            ) : (
              <div className='w-8 h-8 flex items-center justify-center rounded-full
              bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md'>
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse' />
          </div>

          {/* Username (hide on small) */}
          <div className='text-left hidden md:block'>
            <p className='text-sm font-medium text-gray-800 truncate max-w-[100px]'>{user.name}</p>
            <p className='text-xs text-gray-500 font-normal truncate max-w-[100px]'>{user.email}</p>
          </div>

          <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <ul className='absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-xl border border-purple-500 z-50 overflow-hidden animate-fadeIn'>
            <li className='p-2'>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/profile')
                }}
                className='w-full px-4 py-2.5 text-left hover:bg-purple-50 text-sm text-gray-700 
                transition-colors flex items-center gap-2 group'
                role='menuitem'
              >
                <Settings className='w-4 h-4 text-gray-700' />
                Profile Setting
              </button>
            </li>
            <li className='p-2'>
              <button
                onClick={handleLogout}
                className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm 
                hover:bg-red-50 text-red-600'
              >
                <LogOut className='w-4 h-4' />
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  </div>
</header>

  )
}

export default Navbar
