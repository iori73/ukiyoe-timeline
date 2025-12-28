// Ukiyoe Loading Animation Component
// 浮世絵の摺り工程を再現するローディングアニメーション

import { motion } from 'framer-motion'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useLanguage } from '../context/LanguageContext'

// 摺り工程のタイミング定義（全体3秒）- じっくりと染み込ませる
const SURI_TIMING = {
  layer1: { delay: 0, duration: 1.0 },      // #8B8A60 - 緑がかった茶色
  layer2: { delay: 1.0, duration: 1.0 },    // #CC7B67 - 薄い紅色
  layer3: { delay: 2.0, duration: 1.0 },    // #615D3C - 濃い緑茶色
  total: 3.0
}

// 摺り工程のメッセージ定義（多言語対応）
const SURI_MESSAGES = {
  ja: [
    '薄い緑を摺っています',
    '紅の下地を摺っています',
    '葉の色で仕上げています'
  ],
  en: [
    'Printing light green layer',
    'Applying red base layer',
    'Finishing with leaf color'
  ]
}

// 色とレイヤーの対応
const LAYER_CONFIG = [
  { color: '#8B8A60', name: 'layer1', timing: SURI_TIMING.layer1 },
  { color: '#CC7B67', name: 'layer2', timing: SURI_TIMING.layer2 },
  { color: '#615D3C', name: 'layer3', timing: SURI_TIMING.layer3 }
]

// アニメーション変数
const layerVariants = {
  hidden: { opacity: 0 },
  visible: (custom) => ({
    opacity: 1,
    transition: {
      delay: custom.delay,
      duration: custom.duration,
      ease: "easeInOut" // じわっと染み込むような滑らかな変化
    }
  })
}

// UkiyoeLoading Component with ref forwarding for SVG capture
const UkiyoeLoading = forwardRef(({ onStepChange, svgData }, ref) => {
  const svgRef = useRef(null)
  
  // Expose SVG ref to parent for capturing
  useImperativeHandle(ref, () => ({
    getSvgElement: () => svgRef.current,
    getSvgString: () => {
      if (svgRef.current) {
        const serializer = new XMLSerializer()
        return serializer.serializeToString(svgRef.current)
      }
      return null
    }
  }))

  if (!svgData) {
    return null
  }

  const { viewBox, width, height, layers } = svgData

  return (
    <motion.svg
      ref={svgRef}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      className="ukiyoe-loading-svg"
    >
      <defs>
        {/* 版画の滲みと重なりを表現するフィルタ */}
        <filter id="woodblock-effect">
          {/* 1. 領域を少し広げて隙間を埋める (Dilate) */}
          <feMorphology operator="dilate" radius="0.5" result="dilated" />
          
          {/* 2. エッジを少し荒らして和紙への滲みを表現 (Turbulence + Displacement) */}
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
          <feDisplacementMap in="dilated" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          
          {/* 3. 元の色と合成 */}
          <feComposite operator="in" in="SourceGraphic" in2="displaced" />
        </filter>
      </defs>

      {layers.map((layer, layerIndex) => {
        const config = LAYER_CONFIG[layerIndex]
        if (!config) return null
        
        return (
          <motion.g
            key={`layer-${layerIndex}`}
            className={`ukiyoe-layer-${layerIndex + 1}`}
            variants={layerVariants}
            custom={config.timing}
            initial="hidden"
            animate="visible"
            style={{ 
              mixBlendMode: 'multiply', // 版の重なり（乗算）
              // filter: 'url(#woodblock-effect)' // 滲みと拡張フィルタ (一時的にオフ)
            }}
            onAnimationStart={() => {
              if (onStepChange) {
                onStepChange(layerIndex)
              }
            }}
          >
            {layer.paths.map((pathData, pathIndex) => (
              <path
                key={`path-${layerIndex}-${pathIndex}`}
                d={pathData}
                fill={layer.color}
                stroke={layer.color}
                strokeWidth={layer.strokeWidth || 0}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </motion.g>
        )
      })}
    </motion.svg>
  )
})

UkiyoeLoading.displayName = 'UkiyoeLoading'

// Loading Container Component
export const UkiyoeLoadingContainer = ({ onComplete }) => {
  const [svgData, setSvgData] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const loadingRef = useRef(null)

  useEffect(() => {
    // Load SVG data from JSON
    const loadSvgData = async () => {
      try {
        const data = await import('../data/ukiyoe-loading-layers.json')
        setSvgData(data.default || data)
      } catch (error) {
        console.error('Failed to load SVG data:', error)
      }
    }
    loadSvgData()
  }, [])

  useEffect(() => {
    // Set up step change timers
    const timers = LAYER_CONFIG.map((config, index) => {
      return setTimeout(() => {
        setCurrentStep(index)
      }, config.timing.delay * 1000)
    })

    // Set loading complete
    const completeTimer = setTimeout(() => {
      setIsLoading(false)
      if (onComplete) {
        onComplete()
      }
    }, SURI_TIMING.total * 1000)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="ukiyoe-loading-container">
      <div className="ukiyoe-loading-wrapper">
        <UkiyoeLoading 
          ref={loadingRef}
          svgData={svgData}
          onStepChange={setCurrentStep}
        />
      </div>
    </div>
  )
}

// Export timing and messages for external use
export { SURI_TIMING, SURI_MESSAGES, LAYER_CONFIG }
export default UkiyoeLoading

