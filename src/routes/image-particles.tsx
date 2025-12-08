import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ImageParticleScene } from '../components/ImageParticleScene'

export const Route = createFileRoute('/image-particles')({
  component: ImageParticlesRoute,
})

function ImageParticlesRoute() {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [contrast, setContrast] = useState(0)
  const [brightness, setBrightness] = useState(0)
  const [tintColor, setTintColor] = useState('#ffffff')
  const [particleCount, setParticleCount] = useState(350)
  const [particleShape, setParticleShape] = useState<'circle' | 'square' | 'ring'>('circle')
  const [particleSize, setParticleSize] = useState(0.02)
  const [grayscale, setGrayscale] = useState(false)
  const canvasRef = useRef<any>(null)

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = 'particle_image.png'
      a.click()
    } else {
      alert('No canvas found')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
    }
  }

  const handleReset = () => {
    setImageUrl('')
    setContrast(0)
    setBrightness(0)
    setTintColor('#ffffff')
  }

  return (
    <div className="w-full h-screen bg-background text-white flex overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-80 border-r border-[#333] bg-surface flex flex-col p-6 gap-8 z-20">
        <h1 className="text-xl font-bold tracking-wider mb-2">IMAGE PARTICLES</h1>
        
        {!imageUrl && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Upload Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#333] file:text-white hover:file:bg-border-active cursor-pointer w-full border border-[#333] rounded p-2" 
            />
          </div>
        )}

        {imageUrl && (
          <>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Contrast</label>
                  <span className="text-xs text-gray-500 font-mono">{contrast}</span>
                </div>
                <input 
                  type="range" 
                  min="-100" 
                  max="100" 
                  value={contrast} 
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-white h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Brightness</label>
                  <span className="text-xs text-gray-500 font-mono">{brightness}</span>
                </div>
                <input 
                  type="range" 
                  min="-100" 
                  max="100" 
                  value={brightness} 
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-white h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Tint Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={tintColor} 
                    onChange={(e) => setTintColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border border-[#333] p-1"
                  />
                  <span className="text-xs text-gray-500 font-mono uppercase">{tintColor}</span>
                </div>
              </div>

              <div className="h-px bg-[#333] my-2" />

              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Particle Count</label>
                  <span className="text-xs text-gray-500 font-mono">{particleCount}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="600" 
                  step="10"
                  value={particleCount} 
                  onChange={(e) => setParticleCount(Number(e.target.value))}
                  className="w-full accent-white h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Particle Size</label>
                  <span className="text-xs text-gray-500 font-mono">{particleSize.toFixed(3)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.005" 
                  max="0.05" 
                  step="0.001"
                  value={particleSize} 
                  onChange={(e) => setParticleSize(Number(e.target.value))}
                  className="w-full accent-white h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Particle Shape</label>
                <div className="flex gap-2">
                  {(['circle', 'square', 'ring'] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setParticleShape(shape)}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-wider border transition-all ${
                        particleShape === shape 
                          ? 'bg-white text-black border-white' 
                          : 'bg-transparent text-gray-400 border-[#333] hover:border-[#555]'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="mt-auto text-[10px] text-border-active leading-relaxed">
          <p>Upload a PNG or JPEG to convert it into a 3D particle system.</p>
          <p className="mt-2">Use controls to adjust visibility and style.</p>
        </div>

        {/* Additional Controls */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="flex items-center space-x-2 text-xs text-gray-400 uppercase tracking-wider">
            <input
              type="checkbox"
              checked={grayscale}
              onChange={(e) => setGrayscale(e.target.checked)}
              className="form-checkbox h-4 w-4 text-white bg-[#333] border-[#333] rounded"
            />
            <span>Grayscale</span>
          </label>
          <button
            onClick={handleDownload}
            className="w-full py-2 bg-[#111] border border-[#333] text-white rounded hover:bg-[#222] transition"
          >
            Download Image
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-background">
         {imageUrl ? (
           <>
             <Canvas
               gl={{ preserveDrawingBuffer: true }}
               onCreated={({ gl }) => {
                 canvasRef.current = gl.domElement
               }}
               camera={{ position: [0, 0, 5], fov: 50 }}
             >
               <color attach="background" args={['#050505']} />
               <ImageParticleScene 
                 imageUrl={imageUrl} 
                 contrast={contrast}
                 brightness={brightness}
                 tintColor={tintColor === '#ffffff' ? undefined : tintColor}
                 particleCount={particleCount}
                 particleShape={particleShape}
                 particleSize={particleSize}
               />
             </Canvas>
             
             {/* Floating Reset Button */}
             <button 
               onClick={handleReset}
               className="absolute bottom-8 right-8 bg-[#111] border border-[#333] text-white p-4 rounded-full shadow-lg hover:bg-border transition-all group z-30"
               title="Remove Image"
             >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M3 6h18" />
                 <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                 <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
               </svg>
             </button>
           </>
         ) : (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4">
             <div className="w-16 h-16 border border-[#333] rounded-full flex items-center justify-center mb-2">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                 <circle cx="8.5" cy="8.5" r="1.5" />
                 <polyline points="21 15 16 10 5 21" />
               </svg>
             </div>
             <span className="tracking-widest uppercase text-sm">No Image Selected</span>
           </div>
         )}
      </div>
    </div>
  )
}
