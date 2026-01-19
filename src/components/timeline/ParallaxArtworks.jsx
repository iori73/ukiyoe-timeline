import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import ArtworkDetailModal from './ArtworkDetailModal'
import './ParallaxArtworks.css'

/**
 * 「散らし」配置を生成
 * 280vhレイヤーに4作品を左右交互配置（上下にバッファあり）
 *
 * 【改善】
 * - 上部バッファ: 作品を見始める前の余白（5%）
 * - 作品エリア: 4作品を20%間隔で配置
 * - 下部バッファ: 最後の作品を見終えてから次の時代に移る余白
 *
 * 【配置計算】
 * - 280vhレイヤー、スクロールで0→-180vh移動
 * - 作品高さ: 約15% (280vh × 15% ≈ 42vh)
 * - スクロール180vhの中で全作品を十分に見れる
 *
 * 【配置】（280vhレイヤー基準）
 * Art1(5%, left:20)   - スクロール初期で見える、上部に余白
 * Art2(23%, left:55)  - 18%間隔
 * Art3(41%, left:18)  - 18%間隔
 * Art4(59%, left:52)  - 18%間隔、スクロール終盤で十分見れる
 * 
 * 最後の作品(59%)は280vh×59%=165vh位置
 * 作品高さ15%(42vh)を加えると207vh
 * スクロール180vhで作品が画面中央(50vh)にくるタイミング:
 * 165vh - 50vh = 115vh スクロール時に画面中央
 * 十分な余裕あり
 */
const generateChirashiPositions = (count, viewportWidth, viewportHeight, layerHeight = 280) => {
  const basePositions = [
    // 1. 左寄り - top 5%（上部バッファ後、スクロール初期で見える）
    {
      top: 5, left: 20,
      scale: 1.0,
      zIndex: 15,
      maOffset: { x: 0, y: 0 }
    },
    // 2. 右寄り - top 23%（18%間隔）
    {
      top: 23, left: 55,
      scale: 0.95,
      zIndex: 14,
      maOffset: { x: 0, y: 0 }
    },
    // 3. 左寄り - top 41%（18%間隔）
    {
      top: 41, left: 18,
      scale: 0.92,
      zIndex: 13,
      maOffset: { x: 0, y: 0 }
    },
    // 4. 右寄り - top 59%（18%間隔、下部に余裕あり）
    {
      top: 59, left: 52,
      scale: 0.98,
      zIndex: 12,
      maOffset: { x: 0, y: 0 }
    },
  ]

  // レスポンシブ調整
  const isMobile = viewportWidth < 900
  const isTablet = viewportWidth < 1200 && viewportWidth >= 900

  return basePositions.slice(0, count).map((pos, index) => {
    let adjustedPos = { ...pos }

    if (isMobile) {
      // モバイル: 左右交互配置、上部バッファ + 18%縦間隔
      const mobilePositions = [
        { top: 5, left: 12, scale: 0.95, zIndex: 15 },      // 左（上部バッファ）
        { top: 23, left: 50, scale: 0.90, zIndex: 14 },     // 右
        { top: 41, left: 10, scale: 0.88, zIndex: 13 },     // 左
        { top: 59, left: 48, scale: 0.92, zIndex: 12 },     // 右
      ]
      adjustedPos = mobilePositions[index] || adjustedPos
    } else if (isTablet) {
      // タブレット: 左右交互配置、上部バッファ + 18%縦間隔
      const tabletPositions = [
        { top: 5, left: 15, scale: 0.98, zIndex: 15 },      // 左（上部バッファ）
        { top: 23, left: 52, scale: 0.93, zIndex: 14 },     // 右
        { top: 41, left: 12, scale: 0.90, zIndex: 13 },     // 左
        { top: 59, left: 50, scale: 0.95, zIndex: 12 },     // 右
      ]
      adjustedPos = tabletPositions[index] || adjustedPos
    }

    // 揺らぎなしで正確な配置を維持（重なり防止のため）
    return adjustedPos
  })
}

/**
 * パララックス効果の設定
 */
const generateParallaxConfig = (index, total) => {
  // 軽微な回転（有機的な動き）
  const rotateFactor = (index % 2 === 0 ? 1 : -1) * (0.3 + (index * 0.15))
  
  return {
    rotateFactor,
    delay: index * 0.12
  }
}

/**
 * ParallaxArtworks Component
 * 
 * Figmaプロトタイプ準拠の「散らし」配置
 * - 日本的な非線形・非対称配置
 * - 200vhの縦長レイヤーで重なりを完全に防止
 * - 「間」を活かした呼吸のあるレイアウト
 * 
 * @param {number} layerHeight - レイヤー高さ（vh単位、デフォルト200）
 */
export default function ParallaxArtworks({ 
  artworks = [], 
  isActive = false,
  sectionRef,
  sectionIndex = 0,
  layerHeight = 200,
  onModalStateChange
}) {
  const { language } = useLanguage()
  const containerRef = useRef(null)
  const [imageErrors, setImageErrors] = useState({})
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  })

  // モーダル用の状態
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ビューポートサイズの監視
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 画像エラーハンドラ
  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }))
  }

  // 作品クリックハンドラ
  const handleArtworkClick = useCallback((artwork) => {
    setSelectedArtwork(artwork)
    setIsModalOpen(true)
  }, [])

  // モーダルを閉じる
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedArtwork(null), 400)
  }, [])

  // モーダル状態変更を親に通知
  useEffect(() => {
    onModalStateChange?.(isModalOpen)
  }, [isModalOpen, onModalStateChange])

  // パララックス設定の計算（メモ化）
  const parallaxConfigs = useMemo(() => {
    return artworks.map((_, index) => 
      generateParallaxConfig(index, artworks.length)
    )
  }, [artworks.length])

  // 「散らし」配置の計算（メモ化）
  const chirashiPositions = useMemo(() => {
    return generateChirashiPositions(
      Math.min(artworks.length, 4), 
      viewportSize.width, 
      viewportSize.height,
      layerHeight
    )
  }, [artworks.length, viewportSize.width, viewportSize.height, layerHeight])

  // 表示する作品数を制限（最大4つ）
  const visibleArtworks = artworks.slice(0, 4)

  return (
    <div 
      ref={containerRef}
      className={`parallax-artworks ${isActive ? 'parallax-artworks--active' : ''}`}
    >
      {/* 「散らし」配置の作品画像群 */}
      <div className="parallax-artworks__chirashi">
        {visibleArtworks.map((artwork, index) => {
          if (imageErrors[index]) return null
          
          const position = chirashiPositions[index]
          if (!position) return null
          
          return (
            <ParallaxImage
              key={`${artwork.url}-${index}`}
              artwork={artwork}
              index={index}
              position={position}
              parallaxConfig={parallaxConfigs[index]}
              isActive={isActive}
              onError={() => handleImageError(index)}
              onClick={() => handleArtworkClick(artwork)}
              language={language}
            />
          )
        })}
      </div>

      {/* 作品詳細モーダル */}
      <ArtworkDetailModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

/**
 * 個別のパララックス画像コンポーネント
 * 「散らし」配置で有機的な動きを実現
 */
function ParallaxImage({
  artwork,
  index,
  position,
  parallaxConfig,
  isActive,
  onError,
  onClick,
  language
}) {
  const { rotateFactor, delay } = parallaxConfig

  const title = language === 'ja' ? artwork.title_ja : artwork.title_en
  const artist = language === 'ja' ? artwork.artist_ja : artwork.artist_en

  return (
    <motion.div
      className="parallax-artwork"
      style={{
        position: 'absolute',
        top: `${position.top}%`,
        left: `${position.left}%`,
        zIndex: position.zIndex
      }}
      initial={{ opacity: 0, y: 30, rotate: rotateFactor * 2 }}
      animate={{ 
        opacity: isActive ? 1 : 0.4,
        y: 0,
        rotate: rotateFactor,
        scale: position.scale || 1
      }}
      transition={{ 
        duration: 0.9, 
        delay: delay,
        ease: [0.19, 1.0, 0.22, 1.0]
      }}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="parallax-artwork__frame">
        <img
          src={artwork.url}
          alt={`${title} - ${artist}`}
          className="parallax-artwork__image"
          loading="lazy"
          onError={onError}
        />
      </div>
      
      {/* 作品情報（常時表示） */}
      <div className="parallax-artwork__info">
        <span className="parallax-artwork__year">{artwork.year}</span>
        <span className="parallax-artwork__title">{title}</span>
        <span className="parallax-artwork__artist">{artist}</span>
      </div>
    </motion.div>
  )
}
