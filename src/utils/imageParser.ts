
// Note: We use the native HTML5 Canvas API here because it's built into the browser
// and highly optimized for pixel manipulation. Libraries like 'sharp' are designed
// for Node.js environments and would require heavy WASM polyfills to run in the client.

const COLOR_BOOST = 1.5 // Multiplier for neon effect

export const processImage = (
  url: string,
  options: {
    threshold?: number
    scale?: number
    contrast?: number // -100 to 100
    brightness?: number // -100 to 100
    tintColor?: string // Hex color to tint particles
    maxDimension?: number // Control particle count/density
  } = {}
): Promise<{ positions: Float32Array; colors: Float32Array }> => {
  const {
    threshold = 20,
    scale = 0.02,
    contrast = 0,
    brightness = 0,
    tintColor,
    maxDimension = 350
  } = options
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      // Limit size for performance if needed, but for now keep original
      // Maybe downsample if too large?
      let width = img.width
      let height = img.height
      
      // Optional: limit max dimension to avoid too many particles
      if (width > maxDimension || height > maxDimension) {
          const aspect = width / height
          if (width > height) {
              width = maxDimension
              height = Math.round(maxDimension / aspect)
          } else {
              height = maxDimension
              width = Math.round(maxDimension * aspect)
          }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get 2d context'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      const positions: number[] = []
      const colors: number[] = []

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]

          if (a > threshold) {
            // Center the image
            const posX = (x - width / 2) * scale
            const posY = -(y - height / 2) * scale // Flip Y
            const posZ = 0

            positions.push(posX, posY, posZ)
            
            // Calculate contrast factor
            const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast))
            
            let rVal = r
            let gVal = g
            let bVal = b

            // Apply contrast
            rVal = contrastFactor * (rVal - 128) + 128
            gVal = contrastFactor * (gVal - 128) + 128
            bVal = contrastFactor * (bVal - 128) + 128

            // Apply brightness
            rVal += brightness
            gVal += brightness
            bVal += brightness

            // Apply tint if provided
            if (tintColor) {
                const tintR = parseInt(tintColor.slice(1, 3), 16)
                const tintG = parseInt(tintColor.slice(3, 5), 16)
                const tintB = parseInt(tintColor.slice(5, 7), 16)
                
                // Simple multiply blend
                rVal = (rVal * tintR) / 255
                gVal = (gVal * tintG) / 255
                bVal = (bVal * tintB) / 255
            }

            // Clamp values
            rVal = Math.max(0, Math.min(255, rVal))
            gVal = Math.max(0, Math.min(255, gVal))
            bVal = Math.max(0, Math.min(255, bVal))

            // Normalize and boost
            const rNorm = Math.min(1, (rVal / 255) * COLOR_BOOST)
            const gNorm = Math.min(1, (gVal / 255) * COLOR_BOOST)
            const bNorm = Math.min(1, (bVal / 255) * COLOR_BOOST)
            
            colors.push(rNorm, gNorm, bNorm)
          }
        }
      }

      resolve({
        positions: new Float32Array(positions),
        colors: new Float32Array(colors),
      })
    }
    img.onerror = (err) => reject(err)
    img.src = url
  })
}
