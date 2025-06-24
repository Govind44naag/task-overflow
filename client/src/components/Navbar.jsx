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
<div ref={menuref} className='relative'>
  <button
    onClick={handleMenuToggle}
    className='flex items-center gap-2 bg-slate-500 px-3 py-2 rounded-full cursor-pointer
      hover:bg-slate-400 transition duration-300 border border-transparent hover:border-purple-400 shadow-sm'
  >
    {/* Avatar */}
    <div className='relative'>
      {user.avatar ? (
        <img src={user.avatar} alt='Avatar' className='w-9 h-9 rounded-full shadow-md' />
      ) : (
        <div className='w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md'>
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
      {/* Status dot */}
      <span className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse' />
    </div>

    {/* Username and Email */}
    <div className='hidden md:flex flex-col items-start max-w-[120px] truncate'>
      <span className='text-sm font-medium text-white truncate'>{user.name}</span>
      <span className='text-xs text-gray-200 truncate'>{user.email}</span>
    </div>

    {/* Chevron */}
    <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
  </button>

  {/* Dropdown Menu */}
  {menuOpen && (
    <ul
      className='absolute top-14 right-0 w-60 bg-white rounded-xl shadow-2xl border border-purple-500 z-50 overflow-hidden animate-fadeIn'
    >
      {/* Profile Settings */}
      <li>
        <button
          onClick={() => {
            setMenuOpen(false)
            navigate('/profile')
          }}
          className='w-full px-5 py-3 text-left hover:bg-purple-50 text-sm text-gray-700 flex items-center gap-3 transition-colors'
        >
          <Settings className='w-5 h-5 text-purple-600' />
          <span>Profile Settings</span>
        </button>
      </li>

      {/* Divider */}
      <div className='border-t border-gray-200 mx-2' />

      {/* Logout */}
      <li>
        <button
          onClick={handleLogout}
          className='w-full px-5 py-3 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-3 transition-colors'
        >
          <LogOut className='w-5 h-5' />
          <span>Logout</span>
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
