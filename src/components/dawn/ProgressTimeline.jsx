import { useState, useEffect, useCallback } from 'react'
import './ProgressTimeline.css'

// Animation duration for each period's progress bar (in seconds)
// 1.5x faster than original 5 seconds
const PERIOD_DURATION = 3.33

// Period configurations
export const PERIODS = {
  sumizuri: {
    id: 'sumizuri',
    name: '墨摺絵',
    nameEn: 'Sumizuri-e',
    years: '1660-1740',
    yearsNote: '（約80年間）',
    description: '墨一色のみで摺った木版画。菱川師宣により浮世絵が芸術形式として確立された。',
    descriptionEn: 'Woodblock prints using only black ink. Ukiyo-e was established as an art form by Hishikawa Moronobu.',
    color: 'rgba(26, 26, 26, 0.5)',
    bgColor: 'rgba(26, 26, 26, 0.2)',
    titleColor: '#1a1a1a',
    imageCount: 1,
    duration: PERIOD_DURATION,
    // カラーパレット: 墨（黒）のみ
    palette: ['#1a1a1a'],
  },
  benizuri: {
    id: 'benizuri',
    name: '紅摺絵',
    nameEn: 'Benizuri-e',
    years: '1660年頃',
    yearsNote: '',
    description: '墨（黒）一色のみで摺った木版画。菱川師宣の流麗な線描により、浮世絵は独立した芸術形式として確立された。',
    descriptionEn: 'Woodblock prints using only black ink. Through the elegant line drawings of Hishikawa Moronobu, ukiyo-e was established as an independent art form.',
    color: 'rgba(195, 52, 51, 0.5)',
    bgColor: 'rgba(195, 52, 51, 0.2)',
    titleColor: '#C33433',
    imageCount: 4,
    duration: PERIOD_DURATION,
    // カラーパレット: 墨＋草＋紅（2-3色）
    palette: ['#2D2D2D', '#51AF7B', '#FF7372'],
  },
  nishiki: {
    id: 'nishiki',
    name: '錦絵',
    nameEn: 'Nishiki-e',
    years: '1765年以降',
    yearsNote: '',
    description: '10枚以上の版木を精密に重ね、ぼかしや空摺りなどの高度な技法を導入しました。浮世絵の技術的頂点です。錦織のような豪華絢爛な色彩表現が可能になりました。',
    descriptionEn: 'More than 10 woodblocks were precisely layered, introducing advanced techniques such as gradation and embossing. This was the technical pinnacle of ukiyo-e, enabling gorgeous color expression like brocade.',
    color: 'rgba(27, 62, 91, 0.5)',
    bgColor: 'rgba(27, 62, 91, 0.2)',
    titleColor: '#1B3E5B',
    imageCount: 4,
    duration: PERIOD_DURATION,
    // カラーパレット: 多色（墨・藍・紅・黄・草）
    palette: ['#1a1a1a', '#1B3E5B', '#C33433', '#FBC546', '#A2C461'],
  },
}

export const PERIOD_ORDER = ['sumizuri', 'benizuri', 'nishiki']

// LocalStorage key for tracking first visit
const FIRST_VISIT_KEY = 'ukiyoe-dawn-visited'

// Hook for checking if this is user's first visit
export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    if (typeof window === 'undefined') return true
    return !localStorage.getItem(FIRST_VISIT_KEY)
  })

  useEffect(() => {
    if (isFirstVisit && typeof window !== 'undefined') {
      // Mark as visited after the card animation completes
      const timeout = setTimeout(() => {
        localStorage.setItem(FIRST_VISIT_KEY, 'true')
      }, 2000) // Give time for initial animations
      return () => clearTimeout(timeout)
    }
  }, [isFirstVisit])

  return isFirstVisit
}

// Hook for managing the auto-advancing progress
export function useProgressTimeline() {
  const [activePeriod, setActivePeriod] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const isFirstVisit = useFirstVisit()

  const totalDuration = PERIOD_ORDER.reduce(
    (acc, key) => acc + PERIODS[key].duration,
    0
  )

  // Calculate which period is active based on elapsed time
  const updateProgress = useCallback((elapsedTime, stopAnimation) => {
    let accumulatedTime = 0
    
    for (let i = 0; i < PERIOD_ORDER.length; i++) {
      const periodKey = PERIOD_ORDER[i]
      const periodDuration = PERIODS[periodKey].duration
      
      if (elapsedTime < accumulatedTime + periodDuration) {
        setActivePeriod(i)
        const periodElapsed = elapsedTime - accumulatedTime
        setProgress((periodElapsed / periodDuration) * 100)
        return false // Not complete
      }
      
      accumulatedTime += periodDuration
    }
    
    // All periods complete - stop at end, don't restart
    setActivePeriod(PERIOD_ORDER.length - 1)
    setProgress(100)
    setIsComplete(true)
    stopAnimation()
    return true // Complete
  }, [])

  useEffect(() => {
    if (!isAnimating || isComplete) return

    const startTime = Date.now()
    let animationFrame
    let stopped = false

    const stopAnimation = () => {
      stopped = true
      setIsAnimating(false)
    }

    const animate = () => {
      if (stopped) return
      
      const elapsed = (Date.now() - startTime) / 1000
      
      if (elapsed >= totalDuration) {
        // Animation complete - stop here
        updateProgress(totalDuration, stopAnimation)
        return
      }
      
      updateProgress(elapsed, stopAnimation)
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      stopped = true
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isAnimating, isComplete, totalDuration, updateProgress])

  return {
    activePeriod,
    progress,
    isAnimating,
    setIsAnimating,
    isFirstVisit,
    isComplete,
    periods: PERIOD_ORDER.map(key => PERIODS[key]),
  }
}

// Individual progress bar component
export function ProgressBar({ period, isActive, progress, isPast }) {
  const height = isPast ? 100 : isActive ? progress : 0

  return (
    <div 
      className="progress-bar"
      style={{ backgroundColor: period.bgColor }}
    >
      <div 
        className="progress-bar__fill"
        style={{ 
          backgroundColor: period.color,
          height: `${height}%`,
          transition: isActive ? 'none' : 'height 0.3s ease-out',
        }}
      />
    </div>
  )
}

export default function ProgressTimeline({ children }) {
  const { activePeriod, progress, periods } = useProgressTimeline()

  return (
    <div className="progress-timeline">
      {children({ activePeriod, progress, periods })}
    </div>
  )
}

