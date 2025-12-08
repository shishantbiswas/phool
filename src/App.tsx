import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './Scene'
import { AnimatePresence, motion } from 'framer-motion'

export const items = [
  {
    id: 'vercel',
    name: 'GUILLERMO RAUCH',
    role: 'CEO AT VERCEL',
    description: "WE'RE NOT JUST BUILDING TOOLS; WE'RE CREATING AN ECOSYSTEM THAT EMPOWERS DEVELOPERS TO FOCUS ON WHAT THEY DO BEST - CREATING AMAZING WEB EXPERIENCES.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><title>VirusTotal</title><path d="M10.87 12L0 22.68h24V1.32H0zm10.73 8.52H5.28l8.637-8.448L5.28 3.48H21.6z" /></svg>
    )
  },
  {
    id: 'framer',
    name: 'KOEN BOK',
    role: 'FOUNDER AT FRAMER',
    description: "ASKING THE LLM TO WRITE REACT CODE IS THE ULTIMATE FASTER HORSE. IT'S A PRODUCTIVITY, NOT PARADIGM SHIFT.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><title>Modal</title><path d="M4.89 5.57 0 14.002l2.521 4.4h5.05l4.396-7.718 4.512 7.709 4.996.037L24 14.057l-4.857-8.452-5.073-.015-2.076 3.598L9.94 5.57Zm.837.729h3.787l1.845 3.252H7.572Zm9.189.021 3.803.012 4.228 7.355-3.736-.027zm-9.82.346L6.94 9.914l-4.209 7.389-1.892-3.3Zm9.187.014 4.297 7.343-1.892 3.282-4.3-7.344zm-6.713 3.6h3.79l-4.212 7.394H3.361Zm11.64 4.109 3.74.027-1.893 3.281-3.74-.027z" /></svg>)
  },
  {
    id: 'shopify',
    name: 'TOBIAS LÜTKE',
    role: 'CEO AND CO-FOUNDER AT SHOPIFY',
    description: "IF YOU BELIEVE SOMETHING NEEDS TO EXIST, IF IT'S SOMETHING YOU WANT TO USE YOURSELF, DON'T LET ANYONE EVER STOP YOU FROM DOING IT.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8H19C20.1046 8 21 8.89543 21 10V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10C3 8.89543 3.89543 8 5 8H9V6ZM11 6V8H13V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6ZM5 10V20H19V10H5Z" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'linear',
    name: 'KARRI SAARINEN',
    role: 'CEO AND CO-FOUNDER AT LINEAR',
    description: "TOO MANY UNDERSTAND QUALITY AS POLISH. IT'S NOT THE SAME THING. IF BUILD SOMETHING GOOD, EVEN IF IT'S A BIT ROUGH, THAT'S GREAT. BUT DON'T FALL INTO THE TRAP OF POLISHING A TURD.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M3.5 12H20.5" stroke="currentColor" strokeWidth="2" />
        <path d="M12 3.5C14.5 6 15.5 9 15.5 12C15.5 15 14.5 18 12 20.5C9.5 18 8.5 15 8.5 12C8.5 9 9.5 6 12 3.5Z" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
]

function App() {
  const [active, setActive] = useState(0)

  return (
    <div className="flex items-center justify-center w-full h-screen bg-[#050505]">
      <div className="flex w-full max-w-[1400px] h-[90vh] relative mx-auto">
        {/* Corner decorations - L-shaped brackets like reference images */}
        {/* Top Left */}
        <div className="absolute top-0 left-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-px h-10 bg-[#333]" />
          <div className="absolute top-0 left-0 w-10 h-px bg-[#333]" />
          <div className="absolute top-0 left-0 w-1 h-1 bg-[#666]" />
        </div>

        {/* Top Right */}
        <div className="absolute top-0 right-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-px h-10 bg-[#333]" />
          <div className="absolute top-0 right-0 w-10 h-px bg-[#333]" />
          <div className="absolute top-0 right-0 w-1 h-1 bg-[#666]" />
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-px h-10 bg-[#333]" />
          <div className="absolute bottom-0 left-0 w-10 h-px bg-[#333]" />
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#666]" />
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-px h-10 bg-[#333]" />
          <div className="absolute bottom-0 right-0 w-10 h-px bg-[#333]" />
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#666]" />
        </div>

        {/* Sidebar */}
        <div className="w-[400px] min-w-[400px] py-10 px-5 flex flex-col border-r border-[#222]">
          {/* <div className="mb-8 px-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L20 19H4L12 4Z" fill="white" />
            </svg>
          </div> */}

          <div className="flex flex-col">
            {items.map((item, index) => (
              <button
                key={item.id}
                className={`flex flex-col items-start p-5 text-left transition-all relative border cursor-pointer ${index === active
                  ? 'border-[#333] bg-white/[0.03]'
                  : 'border-transparent hover:bg-white/[0.02]'
                  }`}
                onClick={() => setActive(index)}
              >
                <div className="mb-4 text-white opacity-90">{item.icon}</div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium tracking-wider uppercase text-white">{item.name}</span>
                  <span className="text-[10px] tracking-wider uppercase text-[#666]">{item.role}</span>
                </div>
                {index === active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 border border-[#444] pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  >
                    {/* Corner triangles */}
                    <div className="absolute -top-px -left-px w-0 h-0 border-l-[6px] border-t-[6px] border-r-[6px] border-b-[6px] border-l-[#888] border-t-[#888] border-r-transparent border-b-transparent" />
                    <div className="absolute -bottom-px -right-px w-0 h-0 border-l-[6px] border-t-[6px] border-r-[6px] border-b-[6px] border-r-[#888] border-b-[#888] border-l-transparent border-t-transparent" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-10">
          <div className="flex-1 border border-[#222] bg-[#0a0a0a] relative overflow-hidden">
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
              <Scene icon={items[active].icon} />
            </Canvas>
          </div>

          <div className="py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <p className="text-[11px] tracking-wider uppercase text-[#888] leading-relaxed">
                  {items[active].description}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between items-center px-5 py-4 border border-[#333] cursor-pointer transition-all hover:bg-white/[0.03] hover:border-[#444]">
              <span className="text-[11px] tracking-widest uppercase text-[#888]">READ CASE STUDY</span>
              <span className="text-[#888]">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
