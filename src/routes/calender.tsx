import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import * as z from "zod";
import { db } from '../lib/dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { toast } from 'sonner';

export const Route = createFileRoute('/calender')({
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
    const { error,data } = schema.safeParse(Object.fromEntries(formData.entries()))
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
            const todos = useLiveQuery(()=>db.todos.where({ date: d }).toArray())
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
  const todos = useLiveQuery(()=>db.todos.toArray());
  return (
    <div className="flex-row lg:flex bg-(--color-base-100) text-(--color-base-content)">
      <div className='p-12 lg:w-2/5 flex flex-col gap-4 justify-between'>
      <div className="w-full">
        <div className="relative group">
          <input 
            type="text" 
            className="w-full bg-(--color-base-200) border border-(--color-neutral) rounded-2xl px-6 py-4 text-xl text-(--color-base-content) placeholder:text-(--color-base-content) placeholder:opacity-40 focus:outline-none focus:border-(--color-neutral-content) focus:bg-(--color-base-200) transition-all duration-300" 
            placeholder="Search Google..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(e.currentTarget.value)}`
              }
            }}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-(--color-base-content) opacity-40 pointer-events-none group-focus-within:text-(--color-base-content) group-focus-within:opacity-50 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

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
                onChange={async() => await db.todos.update(todo.id, { completed: !todo.completed })}
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
