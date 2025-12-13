import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

import { HeadContent } from '@tanstack/react-router'
import { toast, Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { Settings, Shabangs, Todo, db, History as dbHistory } from '../lib/dexie'

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
        <ImportDataButton />
        <ExportDataButton />
        <button
          className='p-2 rounded-sm hover:bg-neutral-content/40 text-white transition-all duration-300 flex items-center justify-between gap-2'
          onClick={() => setOpen(false)}>
          Close
        </button>
      </div>}
    </nav>)
}

function ImportDataButton() {
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data: ExportData = JSON.parse(text);

      // Validate data structure
      if (!data.theme || !data.todos || !data.settings || !data.history || !data.shabangs) {
        toast.error('Invalid data format');
        return;
      }

      // Import data into Dexie
      await db.todos.bulkPut(data.todos);
      await db.settings.bulkPut(data.settings);
      await db.history.bulkPut(data.history);
      await db.shabangs.bulkPut(data.shabangs);

      // Set theme in localStorage
      localStorage.setItem('phool-theme', data.theme);
      document.documentElement.setAttribute('data-theme', data.theme);

      toast.success('Data imported successfully');

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data. Please check the file format.');
    }
  };

  const triggerFileInput = () => {
    document.getElementById('import-file-input')?.click();
  };

  return (
    <>
      <input
        id="import-file-input"
        type="file"
        accept="application/json,.json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        onClick={triggerFileInput}
        className='p-2 rounded-sm hover:bg-neutral-content/40 text-white transition-all duration-300 flex items-center justify-between gap-2'
      >Import</button>
    </>
  )
}

interface ExportData {
  theme: string,
  todos: Todo[],
  settings: Settings[],
  history: dbHistory[],
  shabangs: Shabangs[]
}
function ExportDataButton() {
  const theme = localStorage.getItem('phool-theme') as string;

  const exportData = async () => {
    const userData = {
      todos: await db.todos.toArray(),
      settings: await db.settings.toArray(),
      history: await db.history.toArray(),
      shabangs: await db.shabangs.toArray()
    };

    const exportedData: ExportData = {
      ...userData,
      theme
    }

    const blob = new Blob([JSON.stringify(exportedData)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `phool-data-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported successfully')
  }
  return (
    <button
      className='p-2 rounded-sm hover:bg-neutral-content/40 text-white transition-all duration-300 flex items-center justify-between gap-2'
      onClick={exportData}>Export</button>
  )
}

export const Route = createRootRoute({ component: RootLayout })