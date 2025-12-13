import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

import { HeadContent } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import { MenuIcon } from 'lucide-react'

const RootLayout = () => {

  useEffect(() => {
    if (localStorage.getItem('phool-theme')) {
      document.documentElement.setAttribute('data-theme', localStorage.getItem('phool-theme') as string ?? "light")
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('phool-theme', 'dark')
    }
  }, [])


  return (
    <>
      <HeadContent />
      <Navbar />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <Toaster richColors closeButton />
    </>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className='fixed flex flex-col-reverse bottom-8 overflow-hidden rounded-xl right-8 z-50 bg-neutral '>
      <button
        className=' items-center justify-center text-white transition-all duration-300 p-4'
        onClick={() => setOpen(!open)}>
        <MenuIcon />
      </button>

      {open && <div className='flex flex-col p-2 gap-2 fixed bottom-8 right-8 z-50 bg-neutral rounded-sm'>
        <Link
          to="/"
          className='p-2 rounded-sm hover:bg-neutral-content/40 text-white transition-all duration-300'>
          Home
        </Link>
        <Link
          to="/todos"
          className='p-2 rounded-sm hover:bg-neutral-content/40 text-white transition-all duration-300'>
          Todos
        </Link>
        <Link
          to="/settings"
          className='p-2 rounded-sm hover:bg-neutral-content/40 text-white transition-all duration-300'>
          Settings
        </Link>
        <button
          className='p-2 rounded-sm hover:bg-neutral-content/40 text-white transition-all duration-300 flex items-center justify-between gap-2'
          onClick={() => setOpen(false)}>
          Close
        </button>
      </div>}
    </nav>)
}

export const Route = createRootRoute({ component: RootLayout })