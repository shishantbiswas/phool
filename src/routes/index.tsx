import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import * as z from "zod";
import { db } from '../lib/dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { toast } from 'sonner';
import { GithubIcon, YoutubeIcon, Clock as ClockIcon } from 'lucide-react';
import Fuse from 'fuse.js';


interface Shabangs {
  id?: number;
  icon?: React.ReactNode,
  shabang: string,
  fullname: string,
  url: string,
  searchUrl: string
}


export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="pointer-events-none select-none uppercase">
      <div className="text-8xl font-bold text-(--color-base-content)">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
      </div>
      <div className="text-2xl text-(--color-base-content) opacity-60 font-light mt-2 uppercase">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
}

function CalendarGrid() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const padding = Array.from({ length: firstDay }, (_, i) => i)

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const [popover, setPopover] = useState<number | null>(null)

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const schema = z.object({
      title: z.string().min(3),
      description: z.string(),
    })
    const formData = new FormData(e.currentTarget);
    const { error, data } = schema.safeParse(Object.fromEntries(formData.entries()))
    if (error) {
      toast.error("Please fill all the fields")
      return
    }
    if (!popover) {
      return
    }
    await db.todos.add({
      title: data.title,
      description: data.description,
      date: popover,
      completed: false,
      month,
      year,
    })
    toast.success('Todo added successfully')
    setPopover(null)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map(d => (
          <div key={d} className="text-(--color-base-content) opacity-50 uppercase text-xs font-medium text-center py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 gap-4 h-full">
        {padding.map(i => (
          <div key={`pad-${i}`} className="border border-(--color-neutral) rounded-xl bg-(--color-neutral)" />
        ))}
        {/* Day grid */}
        {days.map(d => {
          const isToday = d === date.getDate()
          const todos = useLiveQuery(() => db.todos.where({ date: d }).toArray())
          return (
            <div
              key={d}
              className={`
                  relative border rounded-xl cursor-pointer active:scale-95 p-4 flex flex-col justify-between transition-all duration-300 group
                  ${isToday
                  ? 'bg-(--color-base-content) text-(--color-base-100) border-(--color-base-content)'
                  : 'border-(--color-neutral) hover:border-(--color-neutral-content) hover:bg-(--color-neutral) text-(--color-base-content)'
                }
                `}
              onClick={() => setPopover(d)}
            >
              <span className={`text-2xl font-light ${isToday ? 'font-medium' : ''}`}>{d}</span>
              <div className="flex gap-1 size-2 ">
                {(todos ?? []).filter(todo => !todo.completed).length > 0 && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-(--color-base-100) opacity-20' : 'bg-(--color-base-content) opacity-20'}`} />}
              </div>
            </div>
          )
        })}
      </div>
      {popover && (
        <div
          onClick={() => setPopover(null)}
          className="absolute top-0 left-0 w-full h-full bg-(--color-base-content)/5 backdrop-blur-sm z-10">
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute z-20 top-1/2 left-1/2 transform  p-6 -translate-x-1/2 -translate-y-1/2 bg-(--color-base-200) text-(--color-base-content) placeholder:text-(--color-base-content)  rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Add Todo for {popover} {new Date().toLocaleString('default', { month: 'long' })}</h2>
            <form
              className='flex flex-col gap-4'
              onSubmit={addTodo}>
              <label htmlFor="title"
                className='text-sm font-medium mt-6'>Title</label>
              <input
                type="text"
                name="title"
                className='border border-(--color-neutral) rounded-md p-2 bg-(--color-base-100) text-(--color-base-content)'
                placeholder="Buy Playstation 6"
              />
              <span className="text-xs text-(--color-base-content) opacity-50">Min 3 characters</span>
              <label htmlFor="description"
                className='text-sm font-medium mt-6'>Description</label>
              <textarea
                name="description"
                placeholder="Play GTA VI before dying"
                className='border border-(--color-neutral) rounded-md p-2 bg-(--color-base-100) text-(--color-base-content)'
              />
              <button
                className='bg-(--color-primary) text-(--color-primary-content) p-2 rounded-md'
                type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function RouteComponent() {
  const todos = useLiveQuery(() => db.todos.toArray());
  return (
    <div className="flex-row lg:flex bg-(--color-base-100) text-(--color-base-content)">
      <div className='p-12 lg:w-2/5 flex flex-col gap-4 justify-between'>
        <div className="w-full">
          <SearchInput />

          {/* Pending todos */}
          {todos && (todos ?? [])
            .filter(todo => !todo.completed)
            .length > 0 && <div className="w-full mt-8">
              <h2 className="text-2xl font-bold mb-4">Pending Todos</h2>
              <div className="flex flex-col gap-4">
                {todos
                  .filter(todo => !todo.completed)
                  .slice(0, 5)
                  .map(todo => (
                    <div key={todo.id} className="flex items-center justify-between">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={async () => await db.todos.update(todo.id, { completed: !todo.completed })}
                        className="size-8 accent-accent"
                      />
                      <div>
                        <h2 className={`ml-2 ${todo.completed ? 'line-through' : ''}`}>{todo.title}</h2>
                        <p className={`ml-2 text-sm opacity-50 ${todo.completed ? 'line-through' : ''}`}>
                          {todo.description.length > 50 ? todo.description.slice(0, 50) + '...' : todo.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>}


        </div>
        <Clock />
      </div>

      <div className="p-12 lg:w-3/5 flex flex-col">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-light text-(--color-base-content) mb-2">
              {new Date().toLocaleString('default', { month: 'long' })}
            </h1>
            <p className="text-xl text-(--color-base-content) opacity-50">
              {new Date().getFullYear()}
            </p>
          </div>
        </header>

        <div className="flex-1 min-h-0">
          <CalendarGrid />
        </div>
      </div>
    </div>
  )
}


function SearchInput() {
  const [query, setQuery] = useState('')
  const [activeShabang, setActiveShabang] = useState<typeof shabangs[0] | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const customShabangs = useLiveQuery(() => db.shabangs.toArray())
  const history = useLiveQuery(() => db.history.toArray())

  const shabangs: Shabangs[] = [
    { url: 'https://github.com', searchUrl: 'https://github.com/search?q=', icon: <GithubIcon />, shabang: '!gh', fullname: "Github" },
    { url: 'https://youtube.com', searchUrl: 'https://www.youtube.com/results?search_query=', icon: <YoutubeIcon />, shabang: '!yt', fullname: "Youtube" },
    {
      url: 'https://google.com', searchUrl: 'https://www.google.com/search?q=', icon: (
        <svg role="img" width="24" height="24" viewBox="0 0 24 24" fill='white' xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg>
      ), shabang: '!g', fullname: "Google"
    },
    ...(customShabangs ?? []),
  ]

  const fuse = new Fuse(history || [], {
    keys: ['query'],
    threshold: 0.4,
  })

  async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Backspace' && query === '' && activeShabang) {
      e.preventDefault()
      setActiveShabang(null)
      setQuery(activeShabang.shabang)
      return
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const value = selectedIndex >= 0 ? suggestions[selectedIndex] : query.trim()

      if (!value && !activeShabang) return

      await db.history.add({
        query: activeShabang ? `${activeShabang.shabang} ${value}` : value,
        date: new Date()
      })

      if (activeShabang) {
        if (value) {
          window.location.href = `${activeShabang.searchUrl}${encodeURIComponent(value)}`
        } else {
          window.location.href = activeShabang.url
        }
      } else {
        const shabang = shabangs.find(s => value === s.shabang || value.startsWith(s.shabang + ' '))
        if (shabang) {
          const q = value.slice(shabang.shabang.length).trim()
          if (q) {
            window.location.href = `${shabang.searchUrl}${encodeURIComponent(q)}`
          } else {
            window.location.href = shabang.url
          }
        } else {
          window.location.href = `https://www.google.com/search?q=${encodeURIComponent(value)}`
        }
      }
      setSuggestions([])
      setSelectedIndex(-1)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    if (!activeShabang) {
      const shabang = shabangs.find(s => value === s.shabang + ' ')
      if (shabang) {
        setActiveShabang(shabang)
        setQuery('')
        setSuggestions([])
      } else {
        setQuery(value)
        if (value.trim()) {
          const results = fuse.search(value)
          setSuggestions(results.map(r => r.item.query).slice(0, 5))
        } else {
          setSuggestions([])
        }
      }
    } else {
      setQuery(value)
      if (value.trim()) {
        const results = fuse.search(value)
        setSuggestions(results.map(r => r.item.query).slice(0, 5))
      } else {
        setSuggestions([])
      }
    }
    setSelectedIndex(-1)
  }

  return (<div className="relative group z-50">
    <input
      type="text"
      className={`w-full bg-(--color-base-200) border border-(--color-neutral) rounded-2xl py-4 text-xl text-(--color-base-content) placeholder:text-(--color-base-content) placeholder:opacity-40 focus:outline-none focus:border-(--color-neutral-content) focus:bg-(--color-base-200) transition-all duration-300 ${activeShabang ? 'pl-16 pr-6' : 'px-6'} ${suggestions.length > 0 ? 'rounded-b-none border-b-0' : ''}`}
      placeholder={activeShabang ? `Search ${activeShabang.shabang.slice(1)}...` : "Search Google or use !gh, !yt..."}
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
    {activeShabang ? (
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-(--color-base-content)">
        {activeShabang.icon || <span className="font-bold">{activeShabang.fullname}</span>}
      </div>
    ) : (
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-(--color-base-content) opacity-40 pointer-events-none group-focus-within:text-(--color-base-content) group-focus-within:opacity-50 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    )}

    {suggestions.length > 0 && (
      <div className="absolute w-full bg-(--color-base-200) border border-(--color-neutral) border-t-0 rounded-b-2xl overflow-hidden shadow-lg">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`px-6 py-3 cursor-pointer flex items-center gap-3 ${index === selectedIndex ? 'bg-(--color-base-content)/10' : 'hover:bg-(--color-base-content)/5'}`}
            onClick={() => {
              setQuery(suggestion)
              setSuggestions([])
            }}
          >
            <ClockIcon className="size-4 opacity-50" />
            <span>{suggestion}</span>
          </div>
        ))}
      </div>
    )}
  </div>)
}