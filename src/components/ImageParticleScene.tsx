import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { processImage } from '../utils/imageParser'

const MORPH_SPEED = 0.08
const MOUSE_INFLUENCE_RADIUS = .5
const MOUSE_STRENGTH = 0.2

export function ImageParticleScene({ 
  imageUrl, 
  contrast = 0, 
  brightness = 0, 
  tintColor,
  particleCount = 350,
  particleShape = 'circle',
  particleSize = 0.02,
  grayscale = false
}: { 
  imageUrl: string
  contrast?: number
  brightness?: number
  tintColor?: string
  particleCount?: number
  particleShape?: 'circle' | 'square' | 'ring'
  particleSize?: number
  grayscale?: boolean
}) {
  const points = useRef<THREE.Points>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()
  
  // We'll use a fixed large buffer to allow for morphing/swapping images
  // or just simple replacement. For now, let's just use the data directly.
  // But to support the "physics" (mouse interaction), we need a current position and a target position.
  
  // To keep it simple and performant, let's assume we just load the image once or replace it.
  // We will store the "original" positions (target) in a buffer attribute or ref.
  
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const targetPositionsRef = useRef<Float32Array | null>(null)
  const originalColorsRef = useRef<Float32Array | null>(null)
  
  // Generate texture based on shape
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = 'white'
    
    if (particleShape === 'circle') {
      ctx.beginPath()
      ctx.arc(16, 16, 14, 0, Math.PI * 2)
      ctx.fill()
    } else if (particleShape === 'ring') {
      ctx.beginPath()
      ctx.arc(16, 16, 12, 0, Math.PI * 2)
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 4
      ctx.stroke()
    } else {
      // Square
      ctx.fillRect(2, 2, 28, 28)
    }

    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [particleShape])

  const updateColors = (colors: Float32Array) => {
    if (!geometryRef.current) return
    
    const count = colors.length / 3
    const newColors = new Float32Array(colors.length)
    
    for (let i = 0; i < count; i++) {
        const r = colors[i * 3]
        const g = colors[i * 3 + 1]
        const b = colors[i * 3 + 2]
        
        if (grayscale) {
            const gray = r * 0.299 + g * 0.587 + b * 0.114
            newColors[i * 3] = gray
            newColors[i * 3 + 1] = gray
            newColors[i * 3 + 2] = gray
        } else {
            newColors[i * 3] = r
            newColors[i * 3 + 1] = g
            newColors[i * 3 + 2] = b
        }
    }
    
    geometryRef.current.setAttribute('color', new THREE.BufferAttribute(newColors, 3))
    geometryRef.current.attributes.color.needsUpdate = true
  }

  useEffect(() => {
    if (originalColorsRef.current) {
      updateColors(originalColorsRef.current)
    }
  }, [grayscale])

  useEffect(() => {
    if (!imageUrl) return

    processImage(imageUrl, { 
      contrast, 
      brightness, 
      tintColor,
      maxDimension: particleCount 
    }).then(({ positions, colors }) => {
      if (geometryRef.current) {
        geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
        
        // Store original positions and colors
        targetPositionsRef.current = positions.slice()
        originalColorsRef.current = colors.slice()
        
        updateColors(colors)
        
        geometryRef.current.attributes.position.needsUpdate = true
      }
    })
  }, [imageUrl, contrast, brightness, tintColor, particleCount])

  useFrame(({ pointer }) => {
    if (!points.current || !geometryRef.current || !targetPositionsRef.current) return

    mousePos.current.x = (pointer.x * viewport.width) / 2
    mousePos.current.y = (pointer.y * viewport.height) / 2

    const positions = geometryRef.current.attributes.position.array as Float32Array
    const targetPositions = targetPositionsRef.current
    const count = positions.length / 3

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      const targetX = targetPositions[i3]
      const targetY = targetPositions[i3 + 1]
      const targetZ = targetPositions[i3 + 2]

      // Mouse interaction
      const dx = positions[i3] - mousePos.current.x
      const dy = positions[i3 + 1] - mousePos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      let pushX = 0
      let pushY = 0

      if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0.01) {
        const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * MOUSE_STRENGTH
        pushX = (dx / dist) * force
        pushY = (dy / dist) * force
      }

      // Smooth lerp to target positions
      positions[i3] = THREE.MathUtils.lerp(positions[i3], targetX + pushX, MORPH_SPEED)
      positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY + pushY, MORPH_SPEED)
      positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targetZ, MORPH_SPEED)
    }

    geometryRef.current.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={particleSize}
        vertexColors
        sizeAttenuation
        transparent={true}
        opacity={1}
        map={texture}
        alphaTest={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
