import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { generatePositionsFromSvg } from '../utils/svgParser'
import ReactDOMServer from 'react-dom/server'

const COUNT = 20000
const DEPTH = 0.12
const MORPH_SPEED = 0.08 // Speed of morphing animation

// Convert React SVG element to string
function svgToString(icon: React.ReactNode): string {
  if (!icon) return ''
  try {
    return ReactDOMServer.renderToStaticMarkup(icon as React.ReactElement)
  } catch {
    return ''
  }
}

export function Scene({ icon }: { icon: React.ReactNode }) {
  const points = useRef<THREE.Points>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // Store target positions for morphing
  const targetPositionsRef = useRef<Float32Array>(new Float32Array(COUNT * 3))
  // Track if this is the first render
  const isInitializedRef = useRef(false)
  // Store previous SVG string to detect changes
  const prevSvgRef = useRef<string>('')

  // Initialize geometry on first render
  useEffect(() => {
    if (!isInitializedRef.current) {
      const svgString = svgToString(icon)
      const initialPositions = generatePositionsFromSvg(svgString || '', COUNT, DEPTH)
      targetPositionsRef.current = initialPositions.slice()

      // Set initial positions directly to geometry
      if (points.current) {
        const posAttr = points.current.geometry.attributes.position
        for (let i = 0; i < COUNT * 3; i++) {
          (posAttr.array as Float32Array)[i] = initialPositions[i]
        }
        posAttr.needsUpdate = true
      }

      prevSvgRef.current = svgString
      isInitializedRef.current = true
    }
  }, [])

  // Update target positions when icon changes (for morphing)
  useEffect(() => {
    const svgString = svgToString(icon)

    // Only update if SVG actually changed and we're already initialized
    if (isInitializedRef.current && svgString !== prevSvgRef.current) {
      console.log('Icon changed, morphing to new shape...')
      targetPositionsRef.current = generatePositionsFromSvg(svgString, COUNT, DEPTH)
      prevSvgRef.current = svgString
    }
  }, [icon])

  useFrame(({ pointer }) => {
    if (!points.current) return

    mousePos.current.x = (pointer.x * viewport.width) / 2
    mousePos.current.y = (pointer.y * viewport.height) / 2

    const positions = points.current.geometry.attributes.position.array as Float32Array
    const targetPositions = targetPositionsRef.current

    const mouseInfluenceRadius = 1.2
    const mouseStrength = 0

    for (let i = 0; i < COUNT; i++) {
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

      if (dist < mouseInfluenceRadius && dist > 0.01) {
        const force = (1 - dist / mouseInfluenceRadius) * mouseStrength
        pushX = (dx / dist) * force
        pushY = (dy / dist) * force
      }

      // Smooth lerp to target positions (morphing animation)
      positions[i3] = THREE.MathUtils.lerp(positions[i3], targetX + pushX, MORPH_SPEED)
      positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY + pushY, MORPH_SPEED)
      positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targetZ, MORPH_SPEED)
    }

    points.current.geometry.attributes.position.needsUpdate = true
  })

  // Create initial buffer with random positions (will be overwritten immediately)
  const initialBuffer = useRef<Float32Array | null>(null)
  if (!initialBuffer.current) {
    initialBuffer.current = new Float32Array(COUNT * 3)
    // Start with random positions for an entrance animation effect
    for (let i = 0; i < COUNT; i++) {
      const angle = THREE.MathUtils.randFloatSpread(Math.PI * 2)
      const r = THREE.MathUtils.randFloatSpread(3)
      initialBuffer.current[i * 3] = Math.cos(angle) * r
      initialBuffer.current[i * 3 + 1] = Math.sin(angle) * r
      initialBuffer.current[i * 3 + 2] = THREE.MathUtils.randFloatSpread(0.5)
    }
  }

  return (
    <points ref={points} position={[0, .6, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialBuffer.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
