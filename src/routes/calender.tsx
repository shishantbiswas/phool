import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { Scene } from '../components/Scene'
import { useEffect, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
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
    <div className="absolute bottom-12 left-12 z-10 pointer-events-none select-none uppercase">
      <div className="text-8xl font-bold text-white">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
      </div>
      <div className="text-2xl text-zinc-400 font-light mt-2 uppercase">
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

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map(d => (
          <div key={d} className="text-zinc-500 uppercase text-xs font-medium text-center py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 gap-4 h-full">
        {padding.map(i => (
          <div key={`pad-${i}`} className="border border-white/5 rounded-xl bg-white/5" />
        ))}
        {days.map(d => {
            const isToday = d === date.getDate()
            return (
              <div 
                key={d} 
                className={`
                  relative border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 group
                  ${isToday 
                    ? 'bg-white text-black border-white' 
                    : 'border-white/10 hover:border-white/30 hover:bg-white/5 text-white'
                  }
                `}
              >
                <span className={`text-2xl font-light ${isToday ? 'font-medium' : ''}`}>{d}</span>
                <div className="flex gap-1">
                    {/* Random decorative dots */}
                    {d % 3 === 0 && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-black/20' : 'bg-white/20'}`} />}
                    {d % 7 === 0 && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-black/20' : 'bg-white/20'}`} />}
                </div>
              </div>
            )
        })}
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="flex w-full bg-black text-white overflow-hidden font-mono">
      {/* Left Panel - 3D Scene & Time */}
      <div className="w-[40%] relative border-r border-white/10 flex flex-col">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
            <Scene icon={<CalendarIcon />} />
          </Canvas>
        </div>
        <Clock />
      </div>

      {/* Right Panel - Calendar Grid */}
      <div className="w-[60%] p-12 flex flex-col">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-light text-white mb-2">
              {new Date().toLocaleString('default', { month: 'long' })}
            </h1>
            <p className="text-xl text-zinc-500">
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
