import { useRef, useEffect, useState, useMemo, useCallback, memo } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import ArtworkDetailModal from './ArtworkDetailModal'
import './ParallaxArtworks.css'

/**
 * 「散らし」配置を生成
 * 280vhレイヤーに最大5作品を左右交互配置。縦は約19%間隔で重なりを防止。
 *
 * 【配置とスクロール】
 * - セクション高さ280vh、progress 0→1 でレイヤーが 0→-180vh 移動
 * - progress=1 のときビューポートはレイヤーの 180vh～280vh を表示
 * - 5番目(top 81%) = 226.8vh → progress=1 の表示範囲(180～280vh)に含まれる
 * - カード間: 19% × 280vh = 53.2vh → 画像最大45vh + テキスト に対して十分な余裕
 */
const generateChirashiPositions = (count, viewportWidth, viewportHeight, layerHeight = 280) => {
  // デスクトップ (>1200px)
  // 画像幅 ≈ 25vw → 左(25%) 中央37.5%, 右(55%) 中央67.5% → 平均49.5% ≈ 中央
  const basePositions = [
    { top: 5,  left: 25, scale: 1.0,  zIndex: 15, maOffset: { x: 0, y: 0 } },
    { top: 24, left: 55, scale: 0.95, zIndex: 14, maOffset: { x: 0, y: 0 } },
    { top: 43, left: 22, scale: 0.92, zIndex: 13, maOffset: { x: 0, y: 0 } },
    { top: 62, left: 55, scale: 0.98, zIndex: 12, maOffset: { x: 0, y: 0 } },
    { top: 81, left: 25, scale: 0.9,  zIndex: 11, maOffset: { x: 0, y: 0 } },
  ]

  // レスポンシブ調整
  const isMobileSmall = viewportWidth < 600
  const isMobile = viewportWidth < 900 && viewportWidth >= 600
  const isTablet = viewportWidth < 1200 && viewportWidth >= 900

  return basePositions.slice(0, count).map((pos, index) => {
    let adjustedPos = { ...pos }

    if (isMobileSmall) {
      // モバイル小 (<600px): 画像幅60vw, コンテナ幅75vw
      // right-aligned の left は 100% - 75vw = 25% が上限
      // left(3-5%) と right(20-22%) で交互配置し、はみ出しを防止
      const mobileSmallPositions = [
        { top: 5,  left: 7,  scale: 0.95, zIndex: 15 },
        { top: 24, left: 22, scale: 0.90, zIndex: 14 },
        { top: 43, left: 6,  scale: 0.88, zIndex: 13 },
        { top: 62, left: 20, scale: 0.92, zIndex: 12 },
        { top: 81, left: 7,  scale: 0.85, zIndex: 11 },
      ]
      adjustedPos = mobileSmallPositions[index] || adjustedPos
    } else if (isMobile) {
      // モバイル (600-900px): 画像幅 ≈ 40vw(35%)
      // 左(15%) 中央32.5%, 右(48%) 中央65.5% → 平均46.3% ≈ 中央
      const mobilePositions = [
        { top: 5,  left: 15, scale: 0.95, zIndex: 15 },
        { top: 24, left: 48, scale: 0.90, zIndex: 14 },
        { top: 43, left: 12, scale: 0.88, zIndex: 13 },
        { top: 62, left: 45, scale: 0.92, zIndex: 12 },
        { top: 81, left: 15, scale: 0.85, zIndex: 11 },
      ]
      adjustedPos = mobilePositions[index] || adjustedPos
    } else if (isTablet) {
      // タブレット (900-1200px): 画像幅 ≈ 28vw
      // 左(18%) 中央32%, 右(55%) 中央69% → 平均46.8% ≈ 中央
      const tabletPositions = [
        { top: 5,  left: 18, scale: 0.98, zIndex: 15 },
        { top: 24, left: 55, scale: 0.93, zIndex: 14 },
        { top: 43, left: 15, scale: 0.90, zIndex: 13 },
        { top: 62, left: 53, scale: 0.95, zIndex: 12 },
        { top: 81, left: 18, scale: 0.88, zIndex: 11 },
      ]
      adjustedPos = tabletPositions[index] || adjustedPos
    }

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
const ParallaxArtworks = memo(function ParallaxArtworks({ 
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

  // 「散らし」配置の計算（メモ化）- 各時代5作品で統一
  const chirashiPositions = useMemo(() => {
    return generateChirashiPositions(
      Math.min(artworks.length, 5),
      viewportSize.width,
      viewportSize.height,
      layerHeight
    )
  }, [artworks.length, viewportSize.width, viewportSize.height, layerHeight])

  // 表示する作品数（最大5つ）
  const visibleArtworks = artworks.slice(0, 5)

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
              isFirstVisible={sectionIndex === 0 && index === 0}
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
})

export default ParallaxArtworks

/**
 * 個別のパララックス画像コンポーネント
 * 「散らし」配置で有機的な動きを実現
 * 
 * 【画像サイズに応じた配置調整】
 * モバイルで右寄り配置の場合、画像幅が小さければより右に配置可能
 */
const ParallaxImage = memo(function ParallaxImage({
  artwork,
  index,
  position,
  parallaxConfig,
  isActive,
  isFirstVisible = false,
  onError,
  onClick,
  language
}) {
  const { rotateFactor, delay } = parallaxConfig
  const imgRef = useRef(null)
  const [adjustedLeft, setAdjustedLeft] = useState(position.left)
  const [isLandscape, setIsLandscape] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  const title = language === 'ja' ? artwork.title_ja : artwork.title_en
  const artist = language === 'ja' ? artwork.artist_ja : artwork.artist_en

  const isRightAligned = index % 2 === 1

  // 初回マウント後にエントランスアニメーションを発火
  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  const handleImageLoad = useCallback(() => {
    if (!imgRef.current) return
    setIsLoaded(true)
    
    const viewportWidth = window.innerWidth
    const imageWidth = imgRef.current.offsetWidth
    const naturalWidth = imgRef.current.naturalWidth
    const naturalHeight = imgRef.current.naturalHeight
    
    const landscape = naturalWidth > naturalHeight
    setIsLandscape(landscape)
    
    if (viewportWidth <= 600) {
      const maxLeft = Math.max(0, ((viewportWidth - imageWidth) / viewportWidth) * 100 - 2)
      if (isRightAligned) {
        const portraitBonus = landscape ? 0 : 5
        setAdjustedLeft(Math.min(position.left + portraitBonus, maxLeft))
      } else {
        setAdjustedLeft(position.left)
      }
    } else {
      setAdjustedLeft(position.left)
    }
  }, [isRightAligned, position.left])

  useEffect(() => {
    const handleResize = () => {
      if (imgRef.current) {
        handleImageLoad()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleImageLoad])

  const className = [
    'parallax-artwork',
    hasEntered ? 'parallax-artwork--entered' : '',
    isActive ? 'parallax-artwork--active' : '',
  ].filter(Boolean).join(' ')

  const scale = position.scale || 1

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: `${position.top}%`,
        left: `${adjustedLeft}%`,
        zIndex: position.zIndex,
        transform: hasEntered
          ? `translateY(0) rotate(${rotateFactor}deg) scale(${scale})`
          : `translateY(30px) rotate(${rotateFactor * 2}deg) scale(${scale})`,
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
        {!isLoaded && <div className="parallax-artwork__shimmer" />}
        <img
          ref={imgRef}
          src={artwork.url}
          alt={`${title} - ${artist}`}
          className={`parallax-artwork__image${isLandscape ? ' parallax-artwork__image--landscape' : ''}${isLoaded ? ' parallax-artwork__image--loaded' : ''}`}
          loading={isFirstVisible ? 'eager' : 'lazy'}
          decoding="async"
          {...(isFirstVisible && { fetchPriority: 'high' })}
          onLoad={handleImageLoad}
          onError={onError}
        />
      </div>
      
      <div className="parallax-artwork__info">
        <span className="parallax-artwork__year">{artwork.year}</span>
        <span className="parallax-artwork__title">{title}</span>
        <span className="parallax-artwork__artist">{artist}</span>
      </div>
    </div>
  )
})
