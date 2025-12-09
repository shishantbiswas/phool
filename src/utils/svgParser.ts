import * as THREE from 'three'
import { parseSVG, makeAbsolute } from 'svg-path-parser'

// Represents a continuous subpath of points
interface SubPath {
  points: { x: number; y: number }[]
}

// Extract all path data from an SVG string
export function extractPathsFromSvg(svgContent: string): string[] {
  const paths: string[] = []

  // Extract d attributes from path elements
  const pathRegex = /d=["']([^"']+)["']/g
  let match
  while ((match = pathRegex.exec(svgContent)) !== null) {
    paths.push(match[1])
  }

  // Extract circle elements
  const circleRegex = /<circle[^>]*>/gi
  while ((match = circleRegex.exec(svgContent)) !== null) {
    const tag = match[0]
    const cx = parseFloat((tag.match(/cx=["']([^"']+)["']/) || ['0', '0'])[1])
    const cy = parseFloat((tag.match(/cy=["']([^"']+)["']/) || ['0', '0'])[1])
    const r = parseFloat((tag.match(/r=["']([^"']+)["']/) || ['0', '0'])[1])

    if (!isNaN(cx) && !isNaN(cy) && !isNaN(r)) {
      const k = 0.5522847498
      const circlePath = `M ${cx} ${cy - r} ` +
        `C ${cx + r * k} ${cy - r} ${cx + r} ${cy - r * k} ${cx + r} ${cy} ` +
        `C ${cx + r} ${cy + r * k} ${cx + r * k} ${cy + r} ${cx} ${cy + r} ` +
        `C ${cx - r * k} ${cy + r} ${cx - r} ${cy + r * k} ${cx - r} ${cy} ` +
        `C ${cx - r} ${cy - r * k} ${cx - r * k} ${cy - r} ${cx} ${cy - r} Z`
      paths.push(circlePath)
    }
  }

  // Extract rect elements
  const rectRegex = /<rect[^>]*>/gi
  while ((match = rectRegex.exec(svgContent)) !== null) {
    const tag = match[0]
    const x = parseFloat((tag.match(/x=["']([^"']+)["']/) || ['0', '0'])[1])
    const y = parseFloat((tag.match(/y=["']([^"']+)["']/) || ['0', '0'])[1])
    const w = parseFloat((tag.match(/width=["']([^"']+)["']/) || ['0', '0'])[1])
    const h = parseFloat((tag.match(/height=["']([^"']+)["']/) || ['0', '0'])[1])
    // const rx = parseFloat((tag.match(/rx=["']([^"']+)["']/) || ['0', '0'])[1])

    if (!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h)) {
      // Simple rect for now, ignoring rounded corners for simplicity
      // M x y L x+w y L x+w y+h L x y+h Z
      const rectPath = `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
      paths.push(rectPath)
    }
  }

  // Extract line elements
  const lineRegex = /<line[^>]*>/gi
  while ((match = lineRegex.exec(svgContent)) !== null) {
    const tag = match[0]
    const x1 = parseFloat((tag.match(/x1=["']([^"']+)["']/) || ['0', '0'])[1])
    const y1 = parseFloat((tag.match(/y1=["']([^"']+)["']/) || ['0', '0'])[1])
    const x2 = parseFloat((tag.match(/x2=["']([^"']+)["']/) || ['0', '0'])[1])
    const y2 = parseFloat((tag.match(/y2=["']([^"']+)["']/) || ['0', '0'])[1])

    if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
      const linePath = `M ${x1} ${y1} L ${x2} ${y2}`
      paths.push(linePath)
    }
  }

  // Extract polyline and polygon elements
  const polyRegex = /<(polyline|polygon)[^>]*>/gi
  while ((match = polyRegex.exec(svgContent)) !== null) {
    const tag = match[0]
    const isPolygon = match[1] === 'polygon'
    const pointsMatch = tag.match(/points=["']([^"']+)["']/)
    
    if (pointsMatch) {
      const points = pointsMatch[1].trim().split(/\s+|,/)
      let path = ''
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i]
        const y = points[i+1]
        if (x && y) {
          path += (i === 0 ? 'M ' : 'L ') + `${x} ${y} `
        }
      }
      if (isPolygon) path += 'Z'
      paths.push(path)
    }
  }

  console.log('Extracted paths:', paths.length)
  return paths
}

// Helper function to sample points along a cubic bezier curve
function sampleCubicBezier(
  x0: number, y0: number,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  samples: number = 10
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const mt = 1 - t
    const px = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3
    const py = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3
    if (!isNaN(px) && !isNaN(py)) {
      points.push({ x: px, y: py })
    }
  }
  return points
}

// Helper function to sample points along a quadratic bezier curve
function sampleQuadBezier(
  x0: number, y0: number,
  x1: number, y1: number,
  x2: number, y2: number,
  samples: number = 10
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const mt = 1 - t
    const px = mt * mt * x0 + 2 * mt * t * x1 + t * t * x2
    const py = mt * mt * y0 + 2 * mt * t * y1 + t * t * y2
    if (!isNaN(px) && !isNaN(py)) {
      points.push({ x: px, y: py })
    }
  }
  return points
}

// Parse SVG path and extract subpaths (separate continuous segments)
export function parseSvgPathToSubpaths(pathData: string): SubPath[] {
  const subpaths: SubPath[] = []
  let currentSubpath: { x: number; y: number }[] = []

  try {
    const commands = makeAbsolute(parseSVG(pathData))

    for (const cmd of commands) {
      // Start a new subpath on moveto command
      if (cmd.command === 'moveto') {
        if (currentSubpath.length > 0) {
          subpaths.push({ points: currentSubpath })
        }
        currentSubpath = []
        if ('x' in cmd && 'y' in cmd && !isNaN(cmd.x) && !isNaN(cmd.y)) {
          currentSubpath.push({ x: cmd.x, y: cmd.y })
        }
      } else if (cmd.command === 'closepath') {
        // Close the path by connecting back to start
        if (currentSubpath.length > 0) {
          currentSubpath.push({ ...currentSubpath[0] })
          subpaths.push({ points: currentSubpath })
          currentSubpath = []
        }
      } else if ('x' in cmd && 'y' in cmd) {
        const x = cmd.x as number
        const y = cmd.y as number

        if (cmd.command === 'curveto' && 'x0' in cmd) {
          // Cubic bezier - sample points along the curve
          const x0 = cmd.x0 as number
          const y0 = cmd.y0 as number
          const x1 = (cmd as any).x1 as number
          const y1 = (cmd as any).y1 as number
          const x2 = (cmd as any).x2 as number
          const y2 = (cmd as any).y2 as number

          const bezierPoints = sampleCubicBezier(x0, y0, x1, y1, x2, y2, x, y, 8)
          currentSubpath.push(...bezierPoints)
        } else if (cmd.command === 'smooth curveto' && 'x0' in cmd) {
          // Smooth cubic bezier
          const x0 = cmd.x0 as number
          const y0 = cmd.y0 as number
          const x2 = (cmd as any).x2 as number
          const y2 = (cmd as any).y2 as number
          // For smooth curves, x1/y1 is reflection of previous control point
          // Approximate by using midpoint
          const x1 = x0
          const y1 = y0
          const bezierPoints = sampleCubicBezier(x0, y0, x1, y1, x2, y2, x, y, 8)
          currentSubpath.push(...bezierPoints)
        } else if (cmd.command === 'quadratic curveto' && 'x0' in cmd) {
          const x0 = cmd.x0 as number
          const y0 = cmd.y0 as number
          const x1 = (cmd as any).x1 as number
          const y1 = (cmd as any).y1 as number
          const quadPoints = sampleQuadBezier(x0, y0, x1, y1, x, y, 8)
          currentSubpath.push(...quadPoints)
        } else if (cmd.command === 'elliptical arc' && 'x0' in cmd) {
          const x0 = cmd.x0 as number
          const y0 = cmd.y0 as number
          const rx = (cmd as any).rx as number || 1
          const ry = (cmd as any).ry as number || 1
          const largeArc = (cmd as any).largeArc as boolean
          const sweep = (cmd as any).sweep as boolean

          // Sample points along the arc
          const segments = 16
          for (let i = 0; i <= segments; i++) {
            const t = i / segments
            // Arc approximation using angle interpolation
            const angle = t * Math.PI * (largeArc ? 1.5 : 0.75) * (sweep ? 1 : -1)
            const px = x0 + (x - x0) * t + Math.sin(angle) * Math.min(rx, ry) * 0.5
            const py = y0 + (y - y0) * t + (1 - Math.cos(angle)) * Math.min(rx, ry) * 0.3
            if (!isNaN(px) && !isNaN(py)) {
              currentSubpath.push({ x: px, y: py })
            }
          }
        } else {
          // lineto, horizontal lineto, vertical lineto
          if (!isNaN(x) && !isNaN(y)) {
            currentSubpath.push({ x, y })
          }
        }
      }
    }

    // Don't forget any remaining subpath
    if (currentSubpath.length > 0) {
      subpaths.push({ points: currentSubpath })
    }
  } catch (error) {
    console.error('Error parsing SVG path:', error)
  }

  return subpaths
}

// Generate particle positions from SVG paths
export function generatePositionsFromSvg(
  svgContent: string,
  count: number,
  depth: number = 0.15
): Float32Array {
  console.log('=== generatePositionsFromSvg ===')

  const positions = new Float32Array(count * 3)
  const paths = extractPathsFromSvg(svgContent)

  if (paths.length === 0) {
    console.log('No paths found, using fallback circle')
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * 1.5
      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = Math.sin(angle) * r
      positions[i * 3 + 2] = THREE.MathUtils.randFloat(-depth, depth)
    }
    return positions
  }

  // Collect all subpaths from all paths
  const allSubpaths: SubPath[] = []
  for (const path of paths) {
    const subpaths = parseSvgPathToSubpaths(path)
    allSubpaths.push(...subpaths)
  }

  console.log(`Total subpaths: ${allSubpaths.length}`)

  // Generate segments only WITHIN each subpath (not between different subpaths)
  const segments: { x1: number; y1: number; x2: number; y2: number; length: number }[] = []
  let totalLength = 0

  for (const subpath of allSubpaths) {
    const pts = subpath.points.filter(p => !isNaN(p.x) && !isNaN(p.y) && isFinite(p.x) && isFinite(p.y))
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const length = Math.sqrt(dx * dx + dy * dy)

      if (length > 0.001) {
        segments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, length })
        totalLength += length
      }
    }
  }

  console.log(`Generated ${segments.length} segments, total length: ${totalLength.toFixed(2)}`)

  if (segments.length === 0 || totalLength === 0) {
    console.log('No valid segments, using fallback')
    for (let i = 0; i < count; i++) {
      positions[i * 3] = THREE.MathUtils.randFloat(-1, 1)
      positions[i * 3 + 1] = THREE.MathUtils.randFloat(-1, 1)
      positions[i * 3 + 2] = THREE.MathUtils.randFloat(-depth, depth)
    }
    return positions
  }

  // Find bounds to normalize
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  for (const seg of segments) {
    minX = Math.min(minX, seg.x1, seg.x2)
    maxX = Math.max(maxX, seg.x1, seg.x2)
    minY = Math.min(minY, seg.y1, seg.y2)
    maxY = Math.max(maxY, seg.y1, seg.y2)
  }

  const width = maxX - minX || 1
  const height = maxY - minY || 1
  const scale = 1.5 / Math.max(width, height)
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  console.log(`Bounds: x(${minX.toFixed(2)}, ${maxX.toFixed(2)}), y(${minY.toFixed(2)}, ${maxY.toFixed(2)})`)

  // Distribution settings
  const borderParticleRatio = 0.8 // 80% on border, 20% inside
  const borderCount = Math.floor(count * borderParticleRatio)
  const interiorCount = count - borderCount

  // Helper function to pick a random segment weighted by length
  const pickRandomSegment = () => {
    let r = Math.random() * totalLength
    for (const seg of segments) {
      r -= seg.length
      if (r <= 0) return seg
    }
    return segments[0]
  }

  // Distribute BORDER particles along segments (tight clustering for solid look)
  for (let i = 0; i < borderCount; i++) {
    const seg = pickRandomSegment()

    // Random point along segment
    const t = Math.random()
    const x = seg.x1 + t * (seg.x2 - seg.x1)
    const y = seg.y1 + t * (seg.y2 - seg.y1)

    // Very small offset for solid border appearance
    const borderOffset = 0.003
    positions[i * 3] = (x - centerX) * scale + THREE.MathUtils.randFloat(-borderOffset, borderOffset)
    positions[i * 3 + 1] = -(y - centerY) * scale + THREE.MathUtils.randFloat(-borderOffset, borderOffset)
    positions[i * 3 + 2] = THREE.MathUtils.randFloat(-depth * 0.5, depth * 0.5)
  }

  // Distribute INTERIOR particles (offset toward center)
  for (let i = 0; i < interiorCount; i++) {
    const idx = borderCount + i
    const seg = pickRandomSegment()

    // Random point along segment
    const t = Math.random()
    const x = seg.x1 + t * (seg.x2 - seg.x1)
    const y = seg.y1 + t * (seg.y2 - seg.y1)

    // Offset toward the center of the shape
    const offsetAmount = Math.random() * 0.3 + 0.05 // 5% to 35% toward center
    const towardCenterX = (centerX - x) * offsetAmount
    const towardCenterY = (centerY - y) * offsetAmount

    // Apply offset with some randomness
    const finalX = x + towardCenterX + THREE.MathUtils.randFloat(-0.02, 0.02) * (maxX - minX)
    const finalY = y + towardCenterY + THREE.MathUtils.randFloat(-0.02, 0.02) * (maxY - minY)

    positions[idx * 3] = (finalX - centerX) * scale
    positions[idx * 3 + 1] = -(finalY - centerY) * scale
    positions[idx * 3 + 2] = THREE.MathUtils.randFloat(-depth, depth)
  }

  return positions
}
