/**
 * Logo Preview Page
 * ロゴデザイン案のプレビューページ
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LayeredLogo, 
  GradientLogo, 
  VennLogo, 
  EraAwareLogo 
} from '../components/common/AnimatedLogo'
import './LogoPreview.css'

const LogoPreview = () => {
  const [currentEra, setCurrentEra] = useState('sumizuri')
  const [darkMode, setDarkMode] = useState(false)
  
  const eras = [
    { id: 'sumizuri', name: '墨摺絵', color: '#1a1a1a', year: '1660-1740' },
    { id: 'benizuri', name: '紅摺絵', color: '#C33433', year: '1740-1765' },
    { id: 'nishiki', name: '錦絵', color: '#1B3E5B', year: '1765-1868' }
  ]
  
  return (
    <div className={`logo-preview-page ${darkMode ? 'dark' : 'light'}`}>
      <header className="logo-preview-header">
        <h1>ロゴデザイン案</h1>
        <p>浮世絵の「版木の重なり」と「3時代の色の進化」をコンセプトに</p>
        
        <button 
          className="mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ ライトモード' : '🌙 ダークモード'}
        </button>
      </header>
      
      <main className="logo-preview-content">
        {/* Concept A: レイヤー重なり */}
        <section className="logo-section">
          <div className="section-header">
            <h2>Concept A: 版木レイヤー重なり</h2>
            <p>3つの時代の色が斜めにずれて重なる版木のようなデザイン</p>
          </div>
          
          <div className="logo-showcase">
            <div className="logo-item">
              <span className="size-label">Small</span>
              <LayeredLogo size="small" />
            </div>
            <div className="logo-item">
              <span className="size-label">Medium</span>
              <LayeredLogo size="medium" />
            </div>
            <div className="logo-item">
              <span className="size-label">Large</span>
              <LayeredLogo size="large" />
            </div>
          </div>
          
          <div className="concept-explanation">
            <div className="color-stack">
              <div className="color-chip" style={{ backgroundColor: '#1B3E5B' }}>
                <span>藍 (錦絵)</span>
              </div>
              <div className="color-chip" style={{ backgroundColor: '#C33433' }}>
                <span>紅 (紅摺絵)</span>
              </div>
              <div className="color-chip" style={{ backgroundColor: '#1a1a1a' }}>
                <span>墨 (墨摺絵)</span>
              </div>
            </div>
            <p>
              浮世絵版画の制作工程では、複数の版木を順に重ねて色を摺り込みます。
              このロゴは、3つの時代を象徴する色（墨・紅・藍）を版木のように
              ずらして重ねることで、その工程を視覚的に表現しています。
            </p>
          </div>
        </section>
        
        {/* Concept B: グラデーション */}
        <section className="logo-section">
          <div className="section-header">
            <h2>Concept B: 時代進化グラデーション</h2>
            <p>左から右へ墨→紅→藍へと進化する時代の流れを表現</p>
          </div>
          
          <div className="logo-showcase">
            <div className="logo-item">
              <span className="size-label">Small</span>
              <GradientLogo size="small" />
            </div>
            <div className="logo-item">
              <span className="size-label">Medium</span>
              <GradientLogo size="medium" />
            </div>
            <div className="logo-item">
              <span className="size-label">Large</span>
              <GradientLogo size="large" />
            </div>
          </div>
          
          <div className="concept-explanation">
            <div className="era-timeline">
              {eras.map((era, index) => (
                <div key={era.id} className="era-marker">
                  <div 
                    className="era-dot" 
                    style={{ backgroundColor: era.color }}
                  />
                  <span className="era-name">{era.name}</span>
                  <span className="era-year">{era.year}</span>
                </div>
              ))}
            </div>
            <p>
              浮世絵は「墨一色」から始まり、「紅と緑の2-3色」へ、
              そして「10色以上の多色摺り」へと進化しました。
              このグラデーションは、その色の進化の歴史を表現しています。
            </p>
          </div>
        </section>
        
        {/* Concept C: Venn ダイアグラム */}
        <section className="logo-section">
          <div className="section-header">
            <h2>Concept C: 版木摺りプロセス</h2>
            <p>3つの円が重なり合うVennダイアグラム風のデザイン</p>
          </div>
          
          <div className="logo-showcase">
            <div className="logo-item">
              <span className="size-label">Small</span>
              <VennLogo size="small" />
            </div>
            <div className="logo-item">
              <span className="size-label">Medium</span>
              <VennLogo size="medium" />
            </div>
            <div className="logo-item">
              <span className="size-label">Large</span>
              <VennLogo size="large" />
            </div>
          </div>
          
          <div className="concept-explanation">
            <div className="blend-demo">
              <motion.div 
                className="blend-circle sumi"
                animate={{ x: [0, 5, 0], y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="blend-circle beni"
                animate={{ x: [0, -5, 0], y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div 
                className="blend-circle ai"
                animate={{ x: [0, 0, 0], y: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
            </div>
            <p>
              版画では色を重ねる順番と位置が重要です。
              3つの円の重なりは、版木の「見当」（位置合わせ）の精密さと、
              色が混ざり合って新しい色彩を生む様子を象徴しています。
            </p>
          </div>
        </section>
        
        {/* Favicon */}
        <section className="logo-section">
          <div className="section-header">
            <h2>Favicon</h2>
            <p>3つの正方形が重なるシンプルなファビコン</p>
          </div>
          
          <div className="logo-showcase">
            <div className="logo-item">
              <span className="size-label">16x16</span>
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="22" height="22" rx="2" fill="#1B3E5B" opacity="0.9"/>
                <rect x="4" y="4" width="22" height="22" rx="2" fill="#C33433" opacity="0.85"/>
                <rect x="0" y="0" width="22" height="22" rx="2" fill="#1a1a1a"/>
              </svg>
            </div>
            <div className="logo-item">
              <span className="size-label">32x32</span>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="22" height="22" rx="2" fill="#1B3E5B" opacity="0.9"/>
                <rect x="4" y="4" width="22" height="22" rx="2" fill="#C33433" opacity="0.85"/>
                <rect x="0" y="0" width="22" height="22" rx="2" fill="#1a1a1a"/>
              </svg>
            </div>
            <div className="logo-item">
              <span className="size-label">64x64</span>
              <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="22" height="22" rx="2" fill="#1B3E5B" opacity="0.9"/>
                <rect x="4" y="4" width="22" height="22" rx="2" fill="#C33433" opacity="0.85"/>
                <rect x="0" y="0" width="22" height="22" rx="2" fill="#1a1a1a"/>
              </svg>
            </div>
            <div className="logo-item">
              <span className="size-label">128x128 (Apple Touch)</span>
              <svg width="128" height="128" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '16px' }}>
                <rect width="180" height="180" fill="#F5F1E6"/>
                <rect x="56" y="56" width="100" height="100" rx="4" fill="#1B3E5B" opacity="0.9"/>
                <rect x="38" y="38" width="100" height="100" rx="4" fill="#C33433" opacity="0.85"/>
                <rect x="20" y="20" width="100" height="100" rx="4" fill="#1a1a1a"/>
              </svg>
            </div>
          </div>
        </section>
        
        {/* Interactive: 時代対応ロゴ */}
        <section className="logo-section interactive">
          <div className="section-header">
            <h2>インタラクティブ: 時代対応ロゴ</h2>
            <p>現在表示中の時代に応じてロゴの強調が変化</p>
          </div>
          
          <div className="era-selector">
            {eras.map((era) => (
              <button
                key={era.id}
                className={`era-button ${currentEra === era.id ? 'active' : ''}`}
                style={{ 
                  '--era-color': era.color,
                  borderColor: currentEra === era.id ? era.color : 'transparent'
                }}
                onClick={() => setCurrentEra(era.id)}
              >
                {era.name}
              </button>
            ))}
          </div>
          
          <div className="logo-showcase centered">
            <div className="logo-item large">
              <EraAwareLogo currentEra={currentEra} size="large" />
            </div>
          </div>
          
          <div className="concept-explanation">
            <p>
              このロゴはページ内の現在位置（時代）に応じて、
              対応するレイヤーが強調表示されます。
              ユーザーがタイムラインをスクロールすると、
              墨摺絵→紅摺絵→錦絵と、ロゴも一緒に「進化」します。
            </p>
          </div>
        </section>
      </main>
      
      <footer className="logo-preview-footer">
        <p>浮世絵タイムライン プロジェクト</p>
      </footer>
    </div>
  )
}

export default LogoPreview

