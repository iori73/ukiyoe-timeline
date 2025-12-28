// Ukiyoe Loading Animation Component
// 浮世絵の摺り工程を再現するローディングアニメーション

import { motion } from 'framer-motion'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useLanguage } from '../context/LanguageContext'

// 摺り工程のタイミング定義（全体5秒）- 一色一色じっくりと染み込ませる
const SURI_TIMING = {
  layer1: { delay: 0, duration: 1.5 },      // #8B8A60 - 淡い緑茶色（下地）
  layer2: { delay: 1.2, duration: 1.5 },    // #CC7B67 - 薄紅色（花びら）
  layer3: { delay: 2.5, duration: 1.8 },    // #615D3C - 濃緑茶色（仕上げ）
  total: 5.0
}

// 摺り工程のメッセージ定義 - 本物の浮世絵制作に倣う（多言語対応）
const SURI_MESSAGES = {
  ja: [
    '下地の色を摺っております',
    '花の色を重ねております',
    '濃い色で仕上げております'
  ],
  en: [
    'Applying base color layer',
    'Layering flower colors',
    'Finishing with deep tones'
  ]
}

// 色とレイヤーの対応 - opacity と blendMode を調整
const LAYER_CONFIG = [
  { 
    color: '#8B8A60', 
    name: 'layer1', 
    timing: SURI_TIMING.layer1,
    opacity: 0.4,  // 下地は薄く
    blendMode: 'multiply'
  },
  { 
    color: '#CC7B67', 
    name: 'layer2', 
    timing: SURI_TIMING.layer2,
    opacity: 0.6,  // 中間色
    blendMode: 'multiply'
  },
  { 
    color: '#615D3C', 
    name: 'layer3', 
    timing: SURI_TIMING.layer3,
    opacity: 0.8,  // 仕上げは濃く
    blendMode: 'multiply'
  }
]

// アニメーション変数 - 和紙に染み込むような段階的な表示
const layerVariants = {
  hidden: { 
    opacity: 0,
    scale: 1.02  // わずかに大きい状態から
  },
  visible: (custom) => ({
    opacity: custom.opacity,  // 各レイヤーごとに異なる透明度
    scale: 1,
    transition: {
      delay: custom.delay,
      duration: custom.duration,
      ease: [0.25, 0.1, 0.25, 1]  // 摺りの圧力のような曲線（最初ゆっくり→徐々に濃く）
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
        {/* 版画の滲みと和紙の質感を表現するフィルタ */}
        <filter id="woodblock-effect" x="-10%" y="-10%" width="120%" height="120%">
          {/* 1. わずかなぼかしで和紙への滲みを表現 */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blurred" />
          
          {/* 2. 和紙の繊維による微細な質感 */}
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.5" 
            numOctaves="2" 
            seed="1" 
            result="texture" 
          />
          
          {/* 3. 質感をわずかに適用 */}
          <feDisplacementMap 
            in="blurred" 
            in2="texture" 
            scale="1" 
            xChannelSelector="R" 
            yChannelSelector="G" 
            result="textured" 
          />
          
          {/* 4. 元の色と質感を合成 */}
          <feBlend in="SourceGraphic" in2="textured" mode="normal" result="final" />
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
            custom={{
              ...config.timing,
              opacity: config.opacity
            }}
            initial="hidden"
            animate="visible"
            style={{ 
              mixBlendMode: config.blendMode, // 版の重なり（乗算）
              filter: 'url(#woodblock-effect)' // 和紙への滲み効果
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
  const { language } = useLanguage()
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
      {isLoading && (
        <motion.div 
          className="ukiyoe-loading-message"
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {SURI_MESSAGES[language]?.[currentStep] || SURI_MESSAGES.ja[currentStep]}
        </motion.div>
      )}
    </div>
  )
}

// Export timing and messages for external use
export { SURI_TIMING, SURI_MESSAGES, LAYER_CONFIG }
export default UkiyoeLoading

