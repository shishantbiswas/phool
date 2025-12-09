import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

import { Toaster } from 'sonner'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/dexie'
import { useEffect, useState } from 'react'
import { MenuIcon } from 'lucide-react'

const RootLayout = () => {
  const settings = useLiveQuery(() => db.settings.get(1))

  useEffect(() => {
    if (settings?.preferredColorScheme) {
      document.documentElement.setAttribute('data-theme', settings.preferredColorScheme)
    } else {
      // Default to light if no setting found, or respect system preference if we wanted to go that far
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [settings?.preferredColorScheme])

  
  return (
    <>
    <Navbar/>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <Toaster richColors closeButton/>
    </>
  )
}

function Navbar() {
  const [open,setOpen] = useState(false);
  return (
  <nav className='fixed flex flex-col-reverse bottom-8 overflow-hidden rounded-xl right-8 z-50 bg-neutral '>
      <button
        className=' items-center justify-center  hover:bg-neutral-content hover:text-neutral-100 transition-all duration-300 p-4'
        onClick={() => setOpen(!open)}>
        <MenuIcon/>
      </button>

      {open && <div className='flex flex-col p-2 gap-2 fixed bottom-8 right-8 z-50 bg-neutral rounded-sm'>
        <Link 
        to="/" 
        className='p-2 bg-neutral rounded-sm hover:bg-neutral-content hover:text-neutral-100 transition-all duration-300'>
          Home
        </Link>
        <Link 
        to="/calender" 
        className='p-2 bg-neutral rounded-sm hover:bg-neutral-content hover:text-neutral-100 transition-all duration-300'>
          Calendar
        </Link>
        <Link 
        to="/todos" 
        className='p-2 bg-neutral rounded-sm hover:bg-neutral-content hover:text-neutral-100 transition-all duration-300'>
          Todos
        </Link>
        <Link 
        to="/image-particles" 
        className='p-2 bg-neutral rounded-sm hover:bg-neutral-content hover:text-neutral-100 transition-all duration-300'>
          Image
        </Link>
        <Link 
        to="/settings" 
        className='p-2 bg-neutral rounded-sm hover:bg-neutral-content hover:text-neutral-100 transition-all duration-300'>
          Settings
        </Link>
        <button
        className='p-2 bg-neutral rounded-sm hover:bg-neutral-content hover:text-neutral-100 transition-all duration-300 flex items-center justify-between gap-2'
        onClick={() => setOpen(false)}>
          Close 
        </button>
        </div>}
    </nav>)
}

export const Route = createRootRoute({ component: RootLayout })