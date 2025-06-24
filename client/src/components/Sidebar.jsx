import React, { useEffect, useState } from 'react'
import {
  menuItems,
  PRODUCTIVITY_CARD,
  SIDEBAR_CLASSES,
  LINK_CLASSES,
  TIP_CARD
} from '../assets/dummy'
import { Sparkles, Lightbulb, Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((t) => t.completed).length || 0
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const username = user?.name || "User"
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileOpen])

  const renderMenuItems = (isMobile = false) => (
    <ul className='space-y-2'>
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                LINK_CLASSES.base,
                isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
                isMobile ? 'justify-start' : 'lg:justify-start'
              ].join(' ')
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>{icon}</span>
            <span className={`${isMobile ? 'block' : 'hidden lg:block'} ${LINK_CLASSES}`}>
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`${SIDEBAR_CLASSES} hidden lg:flex flex-col`}>
        <div className='p-5 border-b border-purple-100'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md'>
              {initial}
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-800'>Hey, {username}</h2>
              <p className='text-sm text-purple-500 font-medium flex items-center gap-1'>
                <Sparkles className='w-3 h-3' /> Let's crush some tasks!
              </p>
            </div>
          </div>
        </div>

        <div className='p-4 space-y-6 overflow-y-auto flex-1'>
          {/* Productivity Bar */}
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.header}>
              <h3 className={PRODUCTIVITY_CARD.label}>PRODUCTIVITY</h3>
              <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            </div>
            <div className={PRODUCTIVITY_CARD.barBg}>
              <div className={PRODUCTIVITY_CARD.barFg} style={{ width: `${productivity}%` }} />
            </div>
          </div>

          {renderMenuItems()}

          {/* Tip Card */}
          <div className='mt-auto pt-6'>
            <div className={TIP_CARD.container}>
              <div className='flex items-center gap-2'>
                <div className={TIP_CARD.iconWrapper}>
                  <Lightbulb className='w-5 h-5 text-purple-600' />
                </div>
                <div>
                  <h3 className={TIP_CARD.title}>Pro Tip</h3>
                  <p className={TIP_CARD.text}>Use keyboard shortcuts to boost productivity!</p>
                  <a href="https://placementportal-rho.vercel.app" target='_blank' rel="noreferrer" className='block mt-2 text-sm text-purple-500 hover:underline'>
                    Visit Job-Portal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Button (just below navbar, left side) */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className='fixed top-[4.5rem] left-4 z-50 p-2 bg-white shadow-md rounded-md border border-gray-200 lg:hidden'
        >
          <Menu className='w-5 h-5 text-purple-600' />
        </button>
      )}

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className='fixed inset-0 z-40 flex'>
          {/* Blurred backdrop */}
          <div className='absolute inset-0 backdrop-blur-sm bg-black/20' onClick={() => setMobileOpen(false)} />

          {/* Sidebar Panel (half screen) */}
          <div
            className='relative z-50 w-6/10 max-w-xs h-full bg-white shadow-xl flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='flex justify-between items-center px-4 py-3 border-b shadow-sm'>
              <h2 className='text-lg font-bold text-purple-600'>Menu</h2>
              <button onClick={() => setMobileOpen(false)} className='text-gray-700 hover:text-purple-600'>
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className='flex-1 overflow-y-auto px-4 pb-6 space-y-6'>
              {/* User Info */}
              <div className='flex items-center gap-3 mt-4'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md'>
                  {initial}
                </div>
                <div>
                  <h2 className='text-lg font-bold text-gray-800'>Hey, {username}</h2>
                  <p className='text-sm text-purple-500 font-medium flex items-center gap-1'>
                    <Sparkles className='w-3 h-3' /> Let's crush some tasks!
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              {renderMenuItems(true)}

              {/* Tip Card */}
              <div className='mt-8'>
                <div className={TIP_CARD.container}>
                  <div className='flex items-center gap-2'>
                    <div className={TIP_CARD.iconWrapper}>
                      <Lightbulb className='w-5 h-5 text-purple-600' />
                    </div>
                    <div>
                      <h3 className={TIP_CARD.title}>Pro Tip</h3>
                      <p className={TIP_CARD.text}>Use keyboard shortcuts to boost productivity!</p>
                      <a href="https://placementportal-rho.vercel.app" target='_blank' rel="noreferrer" className='block mt-2 text-sm text-purple-500 hover:underline'>
                        Visit Job-Portal
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
