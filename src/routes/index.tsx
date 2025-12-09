import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from '../components/Scene'
import { AnimatePresence, motion } from 'framer-motion'

export const Route = createFileRoute('/')({
  component: App,
})


export const items = [
  {
    id: 'vercel',
    name: 'GUILLERMO RAUCH',
    role: 'CEO AT VERCEL',
    description: "WE'RE NOT JUST BUILDING TOOLS; WE'RE CREATING AN ECOSYSTEM THAT EMPOWERS DEVELOPERS TO FOCUS ON WHAT THEY DO BEST - CREATING AMAZING WEB EXPERIENCES.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>VirusTotal</title><path d="M10.87 12L0 22.68h24V1.32H0zm10.73 8.52H5.28l8.637-8.448L5.28 3.48H21.6z" /></svg>
    )
  },
  {
    id: 'framer',
    name: 'KOEN BOK',
    role: 'FOUNDER AT FRAMER',
    description: "ASKING THE LLM TO WRITE REACT CODE IS THE ULTIMATE FASTER HORSE. IT'S A PRODUCTIVITY, NOT PARADIGM SHIFT.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Modal</title><path d="M4.89 5.57 0 14.002l2.521 4.4h5.05l4.396-7.718 4.512 7.709 4.996.037L24 14.057l-4.857-8.452-5.073-.015-2.076 3.598L9.94 5.57Zm.837.729h3.787l1.845 3.252H7.572Zm9.189.021 3.803.012 4.228 7.355-3.736-.027zm-9.82.346L6.94 9.914l-4.209 7.389-1.892-3.3Zm9.187.014 4.297 7.343-1.892 3.282-4.3-7.344zm-6.713 3.6h3.79l-4.212 7.394H3.361Zm11.64 4.109 3.74.027-1.893 3.281-3.74-.027z" /></svg>)
  },
  {
    id: 'shopify',
    name: 'TOBIAS LÜTKE',
    role: 'CEO AND CO-FOUNDER AT SHOPIFY',
    description: "IF YOU BELIEVE SOMETHING NEEDS TO EXIST, IF IT'S SOMETHING YOU WANT TO USE YOURSELF, DON'T LET ANYONE EVER STOP YOU FROM DOING IT.",
    icon: (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
<path d="M3.65791 7.46066V3.73033C3.65791 1.75325 3.48652 1.06314 2.54387 0H7.00003C6.05738 1.06314 5.88599 1.75325 5.88599 3.73033V7.46066C5.88599 9.43773 6.05738 10.1278 7.00003 11.191H2.54387C3.48652 10.1278 3.65791 9.43773 3.65791 7.46066ZM11.3019 8.05751C11.3019 6.49077 9.46805 5.24111 7.85698 4.92404C9.12527 4.62561 10.6164 3.65572 10.6164 2.46202C10.6164 1.26831 10.1536 0.503594 8.71393 0C10.7878 0 13.1872 0.279775 13.1872 2.46202C13.1872 4.53235 11.182 4.84943 10.3421 4.92404C11.5247 5.03594 13.8728 5.61415 13.8728 8.05751C13.8728 10.6128 11.3019 11.191 8.71393 11.191C10.325 10.706 11.3019 9.62425 11.3019 8.05751Z" />
<path d="M19.9552 4.45774C22.0633 5.85662 24 7.01302 24 8.76627C24 10.2584 22.6803 11.191 21.0521 11.191C22.4918 8.93414 21.3092 8.39324 18.1213 6.32291C15.6019 4.68156 14.3678 3.99145 14.3678 2.36876C14.3678 0.913931 15.2419 0 16.6645 0C15.6876 2.03303 17.5214 2.8537 19.9552 4.45774ZM14.7106 7.46066C15.2248 9.51234 16.2531 10.6314 18.1384 11.191H14.7106V7.46066ZM23.143 2.79775C22.6289 1.1191 22.1147 0.559549 20.5722 0H23.143V2.79775Z" />
<path d="M19.9552 17.0608C22.0633 18.4597 24 19.6161 24 21.3693C24 22.8615 22.6803 23.794 21.0521 23.794C22.4918 21.5372 21.3092 20.9963 18.1213 18.926C15.6019 17.2846 14.3678 16.5945 14.3678 14.9718C14.3678 13.517 15.2419 12.603 16.6645 12.603C15.6876 14.6361 17.5214 15.4567 19.9552 17.0608ZM14.7106 20.0637C15.2248 22.1154 16.2531 23.2345 18.1384 23.794H14.7106V20.0637ZM23.143 15.4008C22.6289 13.7221 22.1147 13.1626 20.5722 12.603H23.143V15.4008Z" />
<path d="M13.8859 21.8516C13.8409 22.2406 13.7497 22.6216 13.6144 22.9849C13.4888 23.338 13.3295 23.6758 13.1393 23.9929C13.0351 23.8101 12.8822 23.534 12.7026 23.1946C12.3927 22.6074 12.2584 22.303 11.9327 21.6577C11.6167 21.031 11.6242 21.0608 11.1971 20.223C10.9366 19.7104 10.7392 19.318 10.3457 18.5339C10.0077 17.8602 9.66558 17.1895 9.33034 16.5143C9.16032 16.1726 8.90186 15.6518 8.5248 14.9908C8.33364 14.6447 8.11503 14.3174 7.87146 14.0127C7.68858 13.7758 7.48107 13.5627 7.25308 13.3778C7.0368 13.2101 6.80154 13.0734 6.55312 12.9712C6.30517 12.8709 6.04603 12.8069 5.78255 12.781C8.07644 12.7735 10.3699 12.7661 12.6629 12.7586C12.4505 12.8206 12.2445 12.9058 12.0479 13.013C11.9186 13.0778 11.7978 13.1611 11.6887 13.2607C11.5801 13.3604 11.4897 13.4814 11.422 13.6173C11.3517 13.7674 11.3087 13.9308 11.2952 14.0985C11.275 14.2678 11.2764 14.4393 11.2993 14.6081C11.3377 14.8909 11.4268 15.093 11.6016 15.4511C11.8134 15.8846 11.9663 16.1666 12.1048 16.4322C12.3214 16.847 12.2769 16.7896 12.5552 17.3365C12.9535 18.1198 13.031 18.2131 13.26 18.7129C13.3903 18.979 13.5044 19.2542 13.6014 19.5366C13.7485 19.9933 13.8411 20.4687 13.877 20.9511C13.9104 21.25 13.9134 21.552 13.8859 21.8516Z" />
<path d="M7.95937 21.5492C7.94762 21.797 7.91828 22.0434 7.87162 22.2863C7.82535 22.5174 7.76302 22.7444 7.68515 22.9652C7.61807 23.1647 7.54024 23.3598 7.45206 23.5494C7.36636 23.7314 7.28204 23.8829 7.2128 24C6.87893 23.3412 6.60882 22.8055 6.42509 22.4385C6.08368 21.7581 6.00621 21.5999 5.77723 21.1493C5.41114 20.4286 5.40428 20.4301 5.05945 19.7526C4.85378 19.3468 4.54733 18.7447 4.16684 17.9621C3.84326 17.2958 3.78087 17.1466 3.53681 16.6729C3.37571 16.361 3.24271 16.1156 2.97671 15.6254C2.68809 15.095 2.59416 14.9338 2.48653 14.7615C2.33522 14.5114 2.16847 14.2729 1.98744 14.0475C1.70766 13.6763 1.36004 13.3724 0.966643 13.1552C0.788747 13.0536 0.604571 12.9656 0.415451 12.8918C0.255715 12.8284 0.114489 12.7822 0 12.7493C0.246117 12.7441 0.568331 12.7426 0.946079 12.7553C1.34028 12.768 1.61519 12.7769 1.98471 12.8254C2.31332 12.8624 2.63895 12.926 2.95889 13.0157C3.3476 13.1268 3.69107 13.2223 4.09075 13.479C4.35601 13.6511 4.5994 13.8603 4.81471 14.1012C5.07522 14.3862 5.22604 14.6324 5.43308 14.9711C5.58939 15.227 5.71622 15.4732 5.96371 15.9552C6.15772 16.3327 6.17418 16.3774 6.46554 16.9586C6.79598 17.6167 6.81312 17.6346 7.01399 18.0442C7.28479 18.5947 7.41984 18.87 7.52748 19.1431C7.6879 19.5497 7.83804 19.9362 7.91825 20.4636C7.97057 20.8225 7.98437 21.1868 7.95937 21.5492Z" />
</svg>    )
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
    <div className="flex items-center justify-center w-full h-screen bg-(--color-base-100)">
      <div className="flex w-full max-w-[1400px] h-[90vh] relative mx-auto">
        {/* Corner decorations - L-shaped brackets like reference images */}
        {/* Top Left */}
        <div className="absolute top-0 left-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-px h-10 bg-(--color-neutral)" />
          <div className="absolute top-0 left-0 w-10 h-px bg-(--color-neutral)" />
          <div className="absolute top-0 left-0 w-1 h-1 bg-(--color-neutral-content)" />
        </div>

        {/* Top Right */}
        <div className="absolute top-0 right-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-px h-10 bg-(--color-neutral)" />
          <div className="absolute top-0 right-0 w-10 h-px bg-(--color-neutral)" />
          <div className="absolute top-0 right-0 w-1 h-1 bg-(--color-neutral-content)" />
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-px h-10 bg-(--color-neutral)" />
          <div className="absolute bottom-0 left-0 w-10 h-px bg-(--color-neutral)" />
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-(--color-neutral-content)" />
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-px h-10 bg-(--color-neutral)" />
          <div className="absolute bottom-0 right-0 w-10 h-px bg-(--color-neutral)" />
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-(--color-neutral-content)" />
        </div>

        {/* Sidebar */}
        <div className="w-[400px] min-w-[400px] py-10 px-5 flex flex-col border-r border-(--color-neutral)">
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
                  ? 'border-(--color-neutral) bg-(--color-base-content)/[0.03]'
                  : 'border-transparent hover:bg-(--color-base-content)/[0.02]'
                  }`}
                onClick={() => setActive(index)}
              >
                <div className="mb-4 text-(--color-base-content) opacity-90">{item.icon}</div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium tracking-wider uppercase text-(--color-base-content)">{item.name}</span>
                  <span className="text-[10px] tracking-wider uppercase text-(--color-base-content) opacity-60">{item.role}</span>
                </div>
                {index === active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 border border-(--color-neutral) pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  >
                    {/* Corner triangles */}
                    <div className="absolute -top-px -left-px w-0 h-0 border-l-[6px] border-t-[6px] border-r-[6px] border-b-[6px] border-l-(--color-neutral-content) border-t-(--color-neutral-content) border-r-transparent border-b-transparent" />
                    <div className="absolute -bottom-px -right-px w-0 h-0 border-l-[6px] border-t-[6px] border-r-[6px] border-b-[6px] border-r-(--color-neutral-content) border-b-(--color-neutral-content) border-l-transparent border-t-transparent" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-10">
          <div className="flex-1 border border-(--color-neutral) bg-(--color-base-200) relative overflow-hidden">
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
              <Scene icon={items[active].icon}
                shouldAnimateMouse
              />
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
                <p className="text-[11px] tracking-wider uppercase text-(--color-base-content) opacity-80 leading-relaxed">
                  {items[active].description}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between items-center px-5 py-4 border border-(--color-neutral) cursor-pointer transition-all hover:bg-(--color-base-content)/[0.03] hover:border-(--color-neutral-content)">
              <span className="text-[11px] tracking-widest uppercase text-(--color-base-content) opacity-80">READ CASE STUDY</span>
              <span className="text-(--color-base-content) opacity-80">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
