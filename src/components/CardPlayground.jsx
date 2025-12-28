import ConceptA from './concepts/ConceptA'
import ConceptB from './concepts/ConceptB'
import ConceptC from './concepts/ConceptC'
import './concepts/CardPlayground.css'

/**
 * CardPlayground - 3カードデザインコンセプト比較ページ
 * 
 * 3つのデザインコンセプトを一覧・比較できるプレイグラウンド
 * - Concept A: スライダー型（摺りの重ね体験）
 * - Concept B: タイムライン融合型（時代の流れを体験）
 * - Concept C: 透過レイヤー型（版木の重なりを体験）
 */
export default function CardPlayground() {
  return (
    <div className="card-playground">
      <header className="playground-header">
        <h1>3カード デザイン Playground</h1>
        <p>墨摺絵・紅摺絵・錦絵の表現方法を比較</p>
      </header>

      <div className="concepts-grid">
        <ConceptA />
        <ConceptB />
        <ConceptC />
      </div>
    </div>
  )
}

