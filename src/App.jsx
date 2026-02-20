import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { duration, easing, transition as motionTransition } from './constants/motion'
import { LanguageProvider } from './context/LanguageContext'
import { loadUkiyoeData } from './data/ukiyoe'
import ErrorBoundary from './components/common/ErrorBoundary'
import HorizontalScroll from './components/HorizontalScroll'
import FullscreenSection from './components/FullscreenSection'
import IntroSection from './components/IntroSection'
import ScrollIndicators from './components/ScrollIndicators'
import LanguageToggle from './components/LanguageToggle'
import { UkiyoeLoadingContainer, SURI_TIMING, SURI_MESSAGES } from './components/UkiyoeLoading'
import CardPlayground from './components/CardPlayground'

// ルートレベルのコード分割: 各ページを遅延読み込み
const DawnManualPage = lazy(() => import('./pages/DawnManualPage'))
const TimelinePage = lazy(() => import('./pages/TimelinePage'))
const LogoPreview = lazy(() => import('./pages/LogoPreview'))
const LayerAnimationPage = lazy(() => import('./pages/LayerAnimationPage'))

function AppContent({ skipIntro = false }) {
  const [data, setData] = useState([])
  // skipIntro時はローディング画面をスキップ
  const [loading, setLoading] = useState(!skipIntro)
  // skipIntro時は最初から作品詳細（section 0）を表示
  const [currentSection, setCurrentSection] = useState(0)
  const [showScrollHint, setShowScrollHint] = useState(!skipIntro)
  const [suriStep, setSuriStep] = useState(0) // 現在の摺り工程ステップ

  useEffect(() => {
    // 🎨 摺り工程アニメーション: データ読み込みと同期
    const loadData = async () => {
      // データ読み込みを開始
      const dataPromise = loadUkiyoeData()
      
      // skipIntro時はローディングアニメーションをスキップ
      if (skipIntro) {
        const data = await dataPromise
        setData(data)
        setLoading(false)
        return
      }
      
      // 摺り工程のメッセージを段階的に変更（3色版：薄い色→濃い色の順）
      const stepTimers = [
        setTimeout(() => setSuriStep(1), SURI_TIMING.layer2.delay * 1000),
        setTimeout(() => setSuriStep(2), SURI_TIMING.layer3.delay * 1000),
      ]
      
      // 最低表示時間（摺り工程完了 + 完成作品を眺める余韻）
      const COMPLETION_PAUSE = 0.5 // 完成後の余韻（秒）
      const minDelay = new Promise(resolve => 
        setTimeout(resolve, (SURI_TIMING.total + COMPLETION_PAUSE) * 1000)
      )
      
      // データ読み込みと最低表示時間の両方が完了するまで待つ
      await Promise.all([dataPromise, minDelay])
      
      // タイマーをクリア
      stepTimers.forEach(timer => clearTimeout(timer))
      
      const data = await dataPromise
      setData(data)
      setLoading(false)
    }
    
    loadData().catch(console.error)
  }, [skipIntro])

  // Hide scroll hint after first interaction
  useEffect(() => {
    if (currentSection > 0) {
      setShowScrollHint(false)
    }
  }, [currentSection])

  const handleNavigate = (sectionIndex) => {
    setCurrentSection(sectionIndex)
    // Scroll to section programmatically
    const container = document.querySelector('.horizontal-scroll-container')
    if (container) {
      const sectionWidth = window.innerWidth
      container.scrollTo({
        left: sectionIndex * sectionWidth,
        behavior: 'smooth'
      })
    }
  }

  const handleStartTimeline = () => {
    handleNavigate(1) // Navigate to first period section
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="loading"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0,
              scale: 0.98,
              transition: { 
                duration: duration.slower, 
                ease: easing.ukiyoe
              }
            }}
          >
            {/* 和紙の背景 */}
            <div className="washi-bg" />
            
            {/* 浮世絵版画の刷り工程 - 新しいコンポーネント */}
            <UkiyoeLoadingContainer />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            className="app horizontal-app"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              transition: { 
                duration: duration.slower, 
                ease: easing.ukiyoe,
                delay: duration.normal // ローディングが少し消えてから表示開始
              }
            }}
          >
            {/* SVG Filters for Hanko Effect */}
            <svg className="hanko-filter-container" aria-hidden="true">
              <defs>
                <filter id="hanko-texture" x="-50%" y="-50%" width="200%" height="200%">
                  {/* Create organic texture */}
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.8"
                    numOctaves="4"
                    seed="2"
                    result="noise"
                  />
                  {/* Displace the shape for irregular edges */}
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="2"
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="displaced"
                  />
                  {/* Add subtle grain */}
                  <feColorMatrix
                    in="displaced"
                    type="saturate"
                    values="1.1"
                    result="saturated"
                  />
                  {/* Blend everything */}
                  <feBlend mode="multiply" in="saturated" in2="SourceGraphic" />
                </filter>
                
                {/* Shoji (障子) texture filter - inspired by Tanizaki's "In Praise of Shadows" */}
                {/* Creates a translucent paper-like texture where background is softly visible */}
                <filter id="shoji-texture" x="-50%" y="-50%" width="200%" height="200%">
                  {/* Fine paper fiber texture - subtle and delicate */}
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.04 0.08"
                    numOctaves="3"
                    seed="5"
                    result="paper-fiber"
                  />
                  {/* Soft light diffusion - creates the "ほの明るく" (dimly lit) effect */}
                  <feGaussianBlur
                    in="paper-fiber"
                    stdDeviation="0.5"
                    result="soft-light"
                  />
                  {/* Blend with source to create translucent paper effect */}
                  <feComposite
                    in="soft-light"
                    in2="SourceGraphic"
                    operator="over"
                    result="textured"
                  />
                  {/* Add very subtle grain for paper texture */}
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.3"
                    numOctaves="2"
                    seed="7"
                    result="grain"
                  />
                  <feColorMatrix
                    in="grain"
                    type="saturate"
                    values="0"
                    result="grain-mono"
                  />
                  {/* Final blend - creates the "墨色の最も淡い部分" (lightest part of ink) effect */}
                  <feBlend
                    mode="screen"
                    in="textured"
                    in2="grain-mono"
                    opacity="0.15"
                  />
                </filter>
              </defs>
            </svg>

            {/* Header */}
            <header className="header">
              <motion.div 
                className="header-content"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.slow }}
              >
                <Link 
                  to="/"
                  className="logo" 
                  style={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                  <span className="logo-kanji">
                    <img 
                      src="/images/logo-square.svg" 
                      alt="浮世絵" 
                      className="logo-kanji-image"
                    />
                  </span>
                </Link>
                <LanguageToggle />
              </motion.div>
            </header>

            {/* Main horizontal scroll content */}
            <main className="main horizontal-main">
              <HorizontalScroll 
                totalSections={skipIntro ? data.length : data.length + 1}
                onSectionChange={setCurrentSection}
              >
                <div className="sections-track">
                  {/* Intro Section - skipIntro時は非表示 */}
                  {!skipIntro && (
                    <IntroSection
                      isActive={currentSection === 0}
                      onStart={handleStartTimeline}
                    />
                  )}
                  
                  {/* Period Sections */}
                  {data.map((period, index) => (
                    <FullscreenSection
                      key={period.id || index}
                      period={period}
                      index={index}
                      isActive={skipIntro ? index === currentSection : index + 1 === currentSection}
                    />
                  ))}
                </div>
              </HorizontalScroll>
            </main>

            {/* Scroll Indicators */}
            <ScrollIndicators
              currentSection={currentSection}
              totalSections={skipIntro ? data.length : data.length + 1}
              onNavigate={handleNavigate}
              showHint={showScrollHint}
            />
    </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hash-based routing for playground (backwards compatibility)
function MainPageWithHashRouting({ skipIntro = false }) {
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#playground' ? 'playground' : 'main'
  })

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash === '#playground' ? 'playground' : 'main')
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (currentPage === 'playground') {
    return <CardPlayground />
  }

  return <AppContent skipIntro={skipIntro} />
}

export default function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <Suspense fallback={<UkiyoeLoadingContainer />}>
          <Routes>
            <Route path="/" element={<LayerAnimationPage />} />
            <Route path="/dawn" element={<DawnManualPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/logo-preview" element={<LogoPreview />} />
            <Route path="/layer-animation" element={<LayerAnimationPage />} />
            {/* 旧実装をアーカイブ: /timeline-old で水平スクロール版にアクセス可能 */}
            <Route path="/timeline-old" element={<MainPageWithHashRouting skipIntro />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </LanguageProvider>
  )
}

