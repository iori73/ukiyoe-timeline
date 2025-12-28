import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Concept C: 透過レイヤー型
 * 
 * 3枚を物理的に重ねて表示
 * ホバーで各層が分離・フォーカス
 */
export default function ConceptC() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const techniques = [
    { 
      id: 'sumizuri', 
      name: '墨摺絵', 
      year: '1660年頃',
      color: '#1a1a1a',
      image: '/sumizuri-e.png',
      desc: '墨一色のみで摺った木版画。菱川師宣の流麗な線描により、浮世絵は独立した芸術形式として確立された。',
      zOffset: 0 // 最も奥
    },
    { 
      id: 'benizuri', 
      name: '紅摺絵', 
      year: '1740年代',
      color: '#95a078',
      image: '/benizuri-e.png',
      desc: '紅色と緑色の版木を追加し、「見当」という位置合わせ技術で重ね摺りした版画。',
      zOffset: 1 // 中間
    },
    { 
      id: 'nishiki', 
      name: '錦絵', 
      year: '1765年以降',
      color: '#f8604f',
      image: '/nishiki-e.png',
      desc: '10枚以上の版木を精密に重ね、ぼかしや空摺りなどの高度な技法を導入。浮世絵の技術的頂点。',
      zOffset: 2 // 最も手前
    }
  ]

  const isExpanded = hoveredIndex !== null || selectedIndex !== null

  // 各レイヤーの位置を計算
  const getLayerStyle = (index) => {
    const baseOffset = 15 // ベースのオフセット（px）
    const expandedOffset = 120 // 展開時のオフセット（px）
    
    if (selectedIndex !== null) {
      // 選択されたレイヤーを前面に、他は後ろに
      if (index === selectedIndex) {
        return {
          x: 0,
          y: 0,
          z: 100,
          scale: 1.05,
          opacity: 1
        }
      } else {
        const direction = index < selectedIndex ? -1 : 1
        return {
          x: direction * expandedOffset * 0.5,
          y: (index - selectedIndex) * 20,
          z: -50,
          scale: 0.9,
          opacity: 0.3
        }
      }
    } else if (hoveredIndex !== null) {
      // ホバー時は全体が展開
      return {
        x: (index - 1) * expandedOffset,
        y: 0,
        z: index * 20,
        scale: hoveredIndex === index ? 1.02 : 1,
        opacity: 1
      }
    } else {
      // 通常時は重なって表示
      return {
        x: index * baseOffset,
        y: index * -baseOffset,
        z: index * 10,
        scale: 1,
        opacity: 1
      }
    }
  }

  const handleCardClick = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null)
    } else {
      setSelectedIndex(index)
    }
  }

  return (
    <div className="concept-c">
      <div className="concept-header">
        <h3>Concept C</h3>
        <p className="concept-subtitle">透過レイヤー型 — 版木の重なりを体験</p>
      </div>

      {/* レイヤーコンテナ */}
      <div 
        className={`layer-container ${isExpanded ? 'expanded' : ''}`}
        onMouseLeave={() => {
          if (selectedIndex === null) {
            setHoveredIndex(null)
          }
        }}
      >
        <div className="layer-stack">
          {techniques.map((tech, index) => {
            const style = getLayerStyle(index)
            
            return (
              <motion.div
                key={tech.id}
                className={`layer-card ${hoveredIndex === index ? 'hovered' : ''} ${selectedIndex === index ? 'selected' : ''}`}
                style={{
                  zIndex: selectedIndex === index ? 100 : index + 1,
                  '--accent-color': tech.color
                }}
                animate={{
                  x: style.x,
                  y: style.y,
                  scale: style.scale,
                  opacity: style.opacity
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
                onMouseEnter={() => {
                  if (selectedIndex === null) {
                    setHoveredIndex(index)
                  }
                }}
                onClick={() => handleCardClick(index)}
              >
                <div className="layer-image-wrapper">
                  <img 
                    src={tech.image} 
                    alt={tech.name}
                    className="layer-image"
                  />
                  
                  {/* レイヤーラベル */}
                  <div className="layer-label">
                    <span 
                      className="layer-name"
                      style={{ color: tech.color }}
                    >
                      {tech.name}
                    </span>
                    <span className="layer-year">{tech.year}</span>
                  </div>
                </div>

                {/* 選択時の詳細情報 */}
                {selectedIndex === index && (
                  <motion.div 
                    className="layer-details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p>{tech.desc}</p>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* 操作ヒント */}
        <div className="interaction-hint">
          {selectedIndex !== null ? (
            <span>クリックで閉じる</span>
          ) : (
            <span>ホバーで展開 • クリックで詳細</span>
          )}
        </div>
      </div>

      {/* 凡例 */}
      <div className="layer-legend">
        {techniques.map((tech, index) => (
          <button
            key={tech.id}
            className={`legend-item ${selectedIndex === index ? 'active' : ''}`}
            onClick={() => handleCardClick(index)}
            style={{ '--accent-color': tech.color }}
          >
            <span 
              className="legend-dot"
              style={{ backgroundColor: tech.color }}
            />
            <span className="legend-name">{tech.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

