import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { spring, duration, easing } from '../constants/motion'
import { Link } from 'react-router-dom'
import LanguageToggle from '../components/LanguageToggle'
import { useLanguage } from '../context/LanguageContext'
import { TECHNIQUES } from '../data/techniques'
import './LayerAnimationPage.css'

// ============================================================
// Asset paths
// ============================================================
const A = '/images/dawn/benizuri-e/figma-layers'
const SUMIZURI_PATH = '/images/dawn/sumizuri-e/layers/benizuri/layer-01-sumi.svg'
const N = '/images/dawn/nishiki-e'
const NF = '/images/dawn/nishiki-e/figma-layers'

// ============================================================
// Green Layer (gr) — 着物・帯・髪・山・草・木
// Figma node 897:2181 のフラグメント構造をそのまま再現
// ============================================================
function GreenLayer() {
  return (
    <div className="layer-frag" style={{ width: 291, height: 433.875 }}>
      {/* gr-kimono */}
      <img alt="" className="layer-frag__img" style={{ left: 114, top: 239.69, width: 25.88, height: 25.38 }} src={`${A}/gr-kimono.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 109.25, top: 244.38, width: 33.63, height: 33.75 }} src={`${A}/gr-kimono1.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 94.18, top: 254.25, width: 37.81, height: 117.31 }} src={`${A}/gr-kimono2.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 87.93, top: 275.13, width: 20.5, height: 81.63 }} src={`${A}/gr-kimono3.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 139.75, top: 249, width: 25.5, height: 122.06 }} src={`${A}/gr-kimono4.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 130.25, top: 276.94, width: 17.94, height: 38.06 }} src={`${A}/gr-kimono5.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 93, top: 264.5, width: 77, height: 147.38 }} src={`${A}/gr-kimono6.png`} />
      {/* gr-strap */}
      <img alt="" className="layer-frag__img" style={{ left: 92.37, top: 328.88, width: 61.56, height: 76.31 }} src={`${A}/gr-strap.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 68.43, top: 389.44, width: 25.81, height: 9.75 }} src={`${A}/gr-strap1.png`} />
      {/* gr-inner group 1 */}
      <img alt="" className="layer-frag__img" style={{ left: 64.43, top: 313.88, width: 32.69, height: 76 }} src={`${A}/gr-inner.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 67.24, top: 325.13, width: 29.19, height: 59.5 }} src={`${A}/gr-inner1.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 65.8, top: 318.19, width: 29.88, height: 70.69 }} src={`${A}/gr-inner2.png`} />
      {/* gr-inner group 2 */}
      <img alt="" className="layer-frag__img" style={{ left: 44.68, top: 233.31, width: 42.81, height: 32.63 }} src={`${A}/gr-inner3.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 51.18, top: 384.19, width: 44.25, height: 18.44 }} src={`${A}/gr-inner4.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 66.81, top: 246.87, width: 33.19, height: 59.81 }} src={`${A}/gr-inner5.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 73.62, top: 260.06, width: 26.06, height: 10.31 }} src={`${A}/gr-inner6.png`} />
      {/* gr-hair */}
      <img alt="" className="layer-frag__img" style={{ left: 54.12, top: 199.44, width: 36.13, height: 13.63 }} src={`${A}/gr-hair.png`} />
      {/* gr-mountain */}
      <img alt="" className="layer-frag__img" style={{ left: 5, top: 172.69, width: 237.06, height: 124.44 }} src={`${A}/gr-mountain.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 5, top: 185.19, width: 257.25, height: 78.81 }} src={`${A}/gr-mountain1.png`} />
      {/* gr-grass */}
      <img alt="" className="layer-frag__img" style={{ left: 5, top: 307.13, width: 291, height: 105 }} src={`${A}/gr-grass.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 5, top: 265.88, width: 28.44, height: 33.94 }} src={`${A}/gr-grass1.png`} />
      {/* gr-treeGrass */}
      <img alt="" className="layer-frag__img" style={{ left: 5, top: 31.82, width: 232.06, height: 93.06 }} src={`${A}/gr-treeGrass.png`} />
      {/* gr-tree */}
      <img alt="" className="layer-frag__img" style={{ left: 148.81, top: 246.75, width: 27.25, height: 25.38 }} src={`${A}/gr-tree.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 165.18, top: 244.13, width: 112.75, height: 39.63 }} src={`${A}/gr-tree1.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 256.81, top: 220.88, width: 39.19, height: 29.94 }} src={`${A}/gr-tree2.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 168.75, top: 313.75, width: 86.31, height: 24.44 }} src={`${A}/gr-tree3.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 11.87, top: 254.51, width: 17.63, height: 17.31 }} src={`${A}/gr-tree4.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 9.62, top: 280.63, width: 16.94, height: 30.81 }} src={`${A}/gr-tree5.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 5, top: 135.88, width: 53.19, height: 203 }} src={`${A}/gr-tree6.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 75.24, top: 5, width: 70.44, height: 49.38 }} src={`${A}/gr-tree7.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 50.87, top: 54.82, width: 163.44, height: 71.25 }} src={`${A}/gr-tree8.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 48.12, top: 62.94, width: 171.88, height: 63.5 }} src={`${A}/gr-tree9.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 25.99, top: 43.88, width: 37.13, height: 74.63 }} src={`${A}/gr-tree10.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 34.43, top: 133.07, width: 17.44, height: 137.06 }} src={`${A}/gr-tree11.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 5, top: 91.88, width: 64.25, height: 212.56 }} src={`${A}/gr-tree12.png`} />
    </div>
  )
}

// ============================================================
// Pink Layer (pi) — 桜・唇・髪・着物・山線
// Figma node 897:2224 のフラグメント構造をそのまま再現
// ============================================================
function PinkLayer() {
  return (
    <div className="layer-frag" style={{ width: 291, height: 433.875 }}>
      {/* pi-inner (pixel) */}
      <img alt="" className="layer-frag__img" style={{ left: 159.06, top: 285.88, width: 8.38, height: 19.94 }} src={`${A}/pi-pixel.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 128.94, top: 285.75, width: 8.19, height: 20.94 }} src={`${A}/pi-pixel1.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 127.5, top: 356.44, width: 16.94, height: 48.38 }} src={`${A}/pi-pixel2.png`} />
      {/* pi-lip */}
      <img alt="" className="layer-frag__img" style={{ left: 113.88, top: 244, width: 2.38, height: 2.31 }} src={`${A}/pi-lip.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 83.88, top: 232.37, width: 2.25, height: 2 }} src={`${A}/pi-lip1.png`} />
      {/* pi-hair */}
      <img alt="" className="layer-frag__img" style={{ left: 108.56, top: 216.62, width: 39.56, height: 21.56 }} src={`${A}/pi-hair.png`} />
      {/* pi-kimono */}
      <img alt="" className="layer-frag__img" style={{ left: 64.25, top: 235.69, width: 23.13, height: 23.81 }} src={`${A}/pi-kimono.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 59.44, top: 243.37, width: 33.19, height: 31.38 }} src={`${A}/pi-kimono1.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 91.19, top: 253.56, width: 14.38, height: 41.75 }} src={`${A}/pi-kimono2.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 51.82, top: 249.87, width: 30.5, height: 80.63 }} src={`${A}/pi-kimono3.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 78.69, top: 300.69, width: 29.69, height: 93.75 }} src={`${A}/pi-kimono4.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 50.19, top: 317.69, width: 51.13, height: 90.69 }} src={`${A}/pi-kimono5.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 72.44, top: 267.87, width: 22.88, height: 38.88 }} src={`${A}/pi-kimono6.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 43.82, top: 252.87, width: 95.25, height: 89.13 }} src={`${A}/pi-kimono7.png`} />
      {/* pi-sakura (inner) */}
      <img alt="" className="layer-frag__img" style={{ left: 5, top: 5, width: 232.38, height: 140.75 }} src={`${A}/pi-sakura.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 48.44, top: 11.62, width: 177.81, height: 181.44 }} src={`${A}/pi-sakura1.png`} />
      {/* pi-sakura (outer) */}
      <img alt="" className="layer-frag__img" style={{ left: 159.63, top: 322.5, width: 92.94, height: 58.38 }} src={`${A}/pi-sakura2.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 162.63, top: 257.94, width: 49.81, height: 49.63 }} src={`${A}/pi-sakura3.png`} />
      {/* pi-mountLineR */}
      <img alt="" className="layer-frag__img" style={{ left: 221.07, top: 234.69, width: 53.63, height: 4.88 }} src={`${A}/pi-mountR.png`} />
      <img alt="" className="layer-frag__img" style={{ left: 223.13, top: 237.19, width: 42.81, height: 14.63 }} src={`${A}/pi-mountR1.png`} />
      {/* pi-mountLineL */}
      <img alt="" className="layer-frag__img" style={{ left: 5, top: 201.62, width: 133.13, height: 56.63 }} src={`${A}/pi-mountL.png`} />
    </div>
  )
}

// ============================================================
// Framer Motion spring config (Figma Make 準拠)
// ============================================================
const springConfig = spring.gentle

const LAYER_DELAY = 1.6
/** テキスト（タイトル・説明）の表示開始遅延（秒）。レイヤーアニメ開始からこの秒数後にテキストがフェードインする。 */
const TEXT_DELAY_AFTER_START = 1.5

/** 紅摺絵アニメーション: 各レイヤーの初期 y（上から落ちてくる開始位置） */
const BENIZURI_START_Y = { PINK: -700, GREEN: -500, BLACK: -300 }

// ============================================================
// 黒摺絵（Sumizuri-e）静止アイソメトリックビュー
// アニメーション無し・墨一色
// ============================================================
function SumizurieStatic() {
  const { language } = useLanguage()
  const title = language === 'ja' ? '黒摺絵' : 'Sumizuri-e'
  const subtitle = language === 'ja' ? '墨一色で摺った版画' : 'Woodblock prints in monochrome ink'
  return (
    <section id="section-sumizuri" className="layer-anim__scene">
      <div className="layer-anim__scene-inner">
        <div className="layer-anim__isometric-wrap">
          <div className="layer-anim__canvas">
            <div className="layer-anim__layer" style={{ zIndex: 10 }}>
              <div className="layer-anim__isometric-transform">
                <div className="layer-anim__frame layer-anim__frame--sumizuri">
                  <div className="layer-frag--no-clip" style={{ width: 291, height: 433.875 }}>
                    <img
                      alt={language === 'ja' ? '墨版' : 'Ink block'}
                      src={SUMIZURI_PATH}
                      className="layer-anim__sumizuri-img"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        maxWidth: 'none',
                        objectFit: 'contain',
                        pointerEvents: 'none'
                      }}
                    />
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: -2,
                        border: '2px solid rgba(0,0,0,0.5)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="layer-anim__title-area">
          <h2 className="layer-anim__title">{title}</h2>
          <p className="layer-anim__subtitle">{subtitle}</p>
          <p className="layer-anim__body">
            {language === 'ja'
              ? '黒摺絵は、墨（黒）一色だけで摺った木版画です。17世紀後半、菱川師宣によって浮世絵は独立した芸術として確立されました。線の強弱と濃淡だけで、着物の質感や人物の表情まで表現する、シンプルでありながら力強い技法です。'
              : 'Sumizuri-e are woodblock prints made with black ink only. In the late 17th century, Hishikawa Moronobu established ukiyo-e as an independent art form. Using only the weight and tone of the line, this technique expresses the texture of kimono and the expressions of figures—simple yet powerful.'}
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 3-Layer Isometric Animation
// ============================================================
function NishikieAnimation() {
  const { language } = useLanguage()
  const containerRef = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.3 },
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  // restX/restY: アニメーション完了後の translate(x,y)（px）。1280x800 で理想の重なりになる値
  const layers = [
    { id: 'pink', startY: BENIZURI_START_Y.PINK, restX: -1, restY: -5, zIndex: 10, delay: LAYER_DELAY * 2, Component: PinkLayer },
    { id: 'green', startY: BENIZURI_START_Y.GREEN, restX: -7, restY: -1, zIndex: 20, delay: LAYER_DELAY * 1, Component: GreenLayer },
    {
      id: 'black', startY: BENIZURI_START_Y.BLACK, zIndex: 30, delay: 0,
      Component: () => (
        <div className="layer-frag--no-clip" style={{ width: 291, height: 433.875 }}>
          <img
            alt="墨版"
            src={`${A}/original.png`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'contain', pointerEvents: 'none' }}
          />
          <div aria-hidden="true" style={{ position: 'absolute', inset: -2, border: '2px solid rgba(0,0,0,0.5)' }} />
        </div>
      ),
    },
  ]

  return (
    <section id="section-benizuri" ref={containerRef} className="layer-anim__scene">
      <div className="layer-anim__scene-inner">
        <div className="layer-anim__isometric-wrap">
          {/* pre-transform サイズ */}
          <div className="layer-anim__canvas">
            {layers.map(({ id, startY, restX = 0, restY = 0, zIndex, delay, Component }) => (
              <motion.div
                key={id}
                className={`layer-anim__layer layer-anim__layer--${id}`}
                data-layer-id={id}
                style={{ zIndex }}
                initial={{ x: 0, y: startY, opacity: 0 }}
                animate={hasAnimated ? { x: restX, y: restY, opacity: 1 } : { x: 0, y: startY, opacity: 0 }}
                transition={{
                  delay,
                  x: springConfig,
                  y: springConfig,
                  opacity: { duration: duration.slower, ease: easing.easeOut },
                }}
              >
                <div className="layer-anim__isometric-transform">
                  <div className="layer-anim__frame">
                    <Component />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* タイトル - レイヤーが動き始めてから TEXT_DELAY_AFTER_START 秒後にテキストを表示 */}
        <motion.div
          className="layer-anim__title-area"
          initial={{ opacity: 0, y: 20 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: TEXT_DELAY_AFTER_START, duration: duration.slower, ease: easing.easeOut }}
        >
          <h2 className="layer-anim__title">{language === 'ja' ? '紅摺絵の印刷プロセス' : 'Benizuri-e Printing Process'}</h2>
          <p className="layer-anim__subtitle">{language === 'ja' ? '色別の版木が順に重なり、一枚の絵になります' : 'Color blocks are printed in sequence to create a single image.'}</p>
          <p className="layer-anim__body">
            {language === 'ja'
              ? '紅摺絵は、紅色と緑色など、2〜3色の版木を重ねて摺った木版画です。18世紀なかばに広まり、墨摺絵に色が加わることで、役者絵や美人画がより華やかに。少ない色数ながら、当時の人々を魅了しました。'
              : 'Benizuri-e are woodblock prints made by overprinting two or three blocks—typically red and green—in addition to black. They spread in the mid-18th century, adding color to sumizuri-e and making actor prints and beauties more vivid. With just a few colors, they captivated the people of the time.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// 錦絵（Nishiki-e）レイヤーコンポーネント
// Figma node 1213:866 準拠 — スケール 4656→291 = 1/16
// ============================================================
const S = 1 / 16 // Figma→コンポーネント スケール

// ヘルパー: フラグメント配列を img タグに展開
function NkFrags({ frags }) {
  return frags.map((f, i) => (
    <img
      key={i}
      alt=""
      className="layer-frag__img"
      style={{
        left: f.l * S,
        top: f.t * S,
        width: f.w * S,
        height: f.h * S,
        ...(f.opacity != null ? { opacity: f.opacity } : {}),
      }}
      src={`${NF}/${f.src}`}
    />
  ))
}

// Background (color bg) — pixel texture layers
function NkBgLayer() {
  const frags = [
    { src: 'nk-px-00.png', l: 0, t: 0, w: 4656, h: 1646, opacity: 0.61 },
    { src: 'nk-px-01.png', l: 0, t: 0, w: 4656, h: 6942, opacity: 0.50 },
    { src: 'nk-px-02.png', l: 0, t: 0, w: 4656, h: 4207 },
    { src: 'nk-px-03.png', l: 0, t: 5731, w: 4656, h: 1211, opacity: 0.62 },
  ]
  return (
    <div className="layer-frag" style={{ width: 291, height: 433.875 }}>
      <NkFrags frags={frags} />
    </div>
  )
}

// Green (#7A8B5A) — 26 color + 6 pixel fragments
function NkGreenLayer() {
  const frags = [
    { src: 'nk-gr-00.png', l: 2456, t: 5116, w: 2200, h: 460 },
    { src: 'nk-gr-01.png', l: 739, t: 6215, w: 708, h: 295 },
    { src: 'nk-gr-02.png', l: 1098, t: 4229, w: 417, h: 165 },
    { src: 'nk-gr-03.png', l: 989, t: 4018, w: 531, h: 957 },
    { src: 'nk-gr-04.png', l: 1668, t: 3978, w: 538, h: 540 },
    { src: 'nk-gr-05.png', l: 1427, t: 4136, w: 605, h: 1877 },
    { src: 'nk-gr-06.png', l: 1327, t: 4470, w: 328, h: 1306 },
    { src: 'nk-gr-07.png', l: 2156, t: 4052, w: 408, h: 1953 },
    { src: 'nk-gr-08.png', l: 2004, t: 4499, w: 287, h: 609 },
    { src: 'nk-gr-09.png', l: 1408, t: 4300, w: 1232, h: 2358 },
    { src: 'nk-gr-10.png', l: 1398, t: 5330, w: 985, h: 1221 },
    { src: 'nk-gr-11.png', l: 2464, t: 4226, w: 2192, h: 1329 },
    { src: 'nk-gr-12.png', l: 2301, t: 4016, w: 436, h: 406 },
    { src: 'nk-gr-13.png', l: 2563, t: 3974, w: 1804, h: 634 },
    { src: 'nk-gr-14.png', l: 4029, t: 3602, w: 627, h: 479 },
    { src: 'nk-gr-15.png', l: 2620, t: 5088, w: 1381, h: 391 },
    { src: 'nk-gr-16.png', l: 110, t: 4140, w: 282, h: 277 },
    { src: 'nk-gr-17.png', l: 74, t: 4558, w: 271, h: 493 },
    { src: 'nk-gr-18.png', l: 0, t: 2242, w: 851, h: 3248 },
    { src: 'nk-gr-19.png', l: 734, t: 945, w: 2615, h: 1140 },
    { src: 'nk-gr-20.png', l: 0, t: 1538, w: 1028, h: 3401 },
    { src: 'nk-gr-21.png', l: 0, t: 577, w: 3713, h: 1489 },
    { src: 'nk-gr-22.png', l: 948, t: 3703, w: 370, h: 381 },
    { src: 'nk-gr-23.png', l: 1015, t: 6299, w: 413, h: 156 },
    { src: 'nk-gr-24.png', l: 786, t: 3259, w: 578, h: 218 },
    { src: 'nk-gr-25.png', l: 625, t: 3872, w: 966, h: 2475 },
    // pixel layers (parent offset: top+12)
    { src: 'nk-px-04.png', l: 0, t: 4982, w: 4656, h: 1972 },
    { src: 'nk-px-05.png', l: 0, t: 4322, w: 455, h: 543 },
    { src: 'nk-px-06.png', l: 951, t: 5090, w: 523, h: 1216 },
    { src: 'nk-px-07.png', l: 156, t: 5213, w: 1323, h: 1084 },
    { src: 'nk-px-08.png', l: 996, t: 5270, w: 467, h: 952 },
    { src: 'nk-px-09.png', l: 973, t: 5159, w: 478, h: 1131 },
  ]
  return (
    <div className="layer-frag" style={{ width: 291, height: 433.875 }}>
      <NkFrags frags={frags} />
    </div>
  )
}

// Pink (#B85B5B) — 14 color + 7 pixel fragments
function NkPinkLayer() {
  const frags = [
    { src: 'nk-pk-00.png', l: 877, t: 3808, w: 531, h: 502 },
    { src: 'nk-pk-01.png', l: 1345, t: 3856, w: 437, h: 783 },
    { src: 'nk-pk-02.png', l: 755, t: 3912, w: 488, h: 1290 },
    { src: 'nk-pk-03.png', l: 1185, t: 4725, w: 475, h: 1500 },
    { src: 'nk-pk-04.png', l: 729, t: 4997, w: 818, h: 1451 },
    { src: 'nk-pk-05.png', l: 1085, t: 4200, w: 366, h: 622 },
    { src: 'nk-pk-06.png', l: 627, t: 3849, w: 1524, h: 1537 },
    { src: 'nk-pk-07.png', l: 1268, t: 3632, w: 36, h: 32 },
    { src: 'nk-pk-08.png', l: 1750, t: 3885, w: 414, h: 406 },
    { src: 'nk-pk-09.png', l: 1748, t: 3818, w: 38, h: 37 },
    { src: 'nk-pk-10.png', l: 6, t: 3140, w: 2130, h: 906 },
    { src: 'nk-pk-11.png', l: 6, t: -6, w: 3718, h: 2252 },
    { src: 'nk-pk-12.png', l: 701, t: 100, w: 2845, h: 2903 },
    { src: 'nk-pk-13.png', l: 169, t: 131, w: 3394, h: 1765 },
    // pixel layers (parent offset: left+6, top-6)
    { src: 'nk-px-10.png', l: 2471, t: 4488, w: 134, h: 319 },
    { src: 'nk-px-11.png', l: 1989, t: 4486, w: 131, h: 335 },
    { src: 'nk-px-12.png', l: 1966, t: 5617, w: 271, h: 774 },
    { src: 'nk-px-13.png', l: 2480, t: 5074, w: 1487, h: 934 },
    { src: 'nk-px-14.png', l: 2528, t: 4041, w: 797, h: 794 },
    { src: 'nk-px-15.png', l: 3463, t: 3669, w: 858, h: 78 },
    { src: 'nk-px-16.png', l: 3496, t: 3709, w: 685, h: 234 },
  ]
  return (
    <div className="layer-frag" style={{ width: 291, height: 433.875 }}>
      <NkFrags frags={frags} />
    </div>
  )
}

// Gray-blue (#3D5A73 + #9A9A9A + #1C1C1C) — 4 color + 2 pixel fragments
function NkGrayBlueLayer() {
  const frags = [
    { src: 'nk-gb-00.png', l: 2932, t: 5444, w: 1554, h: 404 },
    { src: 'nk-gy-00.png', l: 115, t: 3914, w: 3718, h: 265 },
    { src: 'nk-dk-00.png', l: 1672, t: 5829, w: 758, h: 854 },
    { src: 'nk-dk-01.png', l: 848, t: 6355, w: 577, h: 241 },
    // pixel layers — 富士山の青色など (parent offset: left+6, top-6)
    { src: 'nk-px-17.png', l: 6, t: 2901, w: 3951, h: 1344 },
    { src: 'nk-px-18.png', l: 6, t: 2941, w: 4182, h: 1287 },
  ]
  return (
    <div className="layer-frag" style={{ width: 291, height: 433.875 }}>
      <NkFrags frags={frags} />
    </div>
  )
}

// Thin-beige (#8B6B4A) — 4 color + 2 pixel fragments
function NkThinBeigeLayer() {
  const frags = [
    { src: 'nk-tb-00.png', l: 4194, t: 3607, w: 449, h: 467 },
    { src: 'nk-tb-01.png', l: 1136, t: 118, w: 1127, h: 790 },
    { src: 'nk-tb-02.png', l: 702, t: 1045, w: 2750, h: 1016 },
    { src: 'nk-tb-03.png', l: 348, t: 740, w: 594, h: 1194 },
    // pixel layers (parent offset: left+12, top-18)
    { src: 'nk-px-19.png', l: 12, t: 1012, w: 1015, h: 4189 },
    { src: 'nk-px-20.png', l: 12, t: 143, w: 3532, h: 5022 },
  ]
  return (
    <div className="layer-frag" style={{ width: 291, height: 433.875 }}>
      <NkFrags frags={frags} />
    </div>
  )
}

// Thick-beige (#D4B87A) — 4 color + 4 pixel fragments
function NkThickBeigeLayer() {
  const frags = [
    { src: 'nk-kb-00.png', l: 635, t: 3794, w: 685, h: 522 },
    { src: 'nk-kb-01.png', l: 955, t: 4053, w: 583, h: 946 },
    { src: 'nk-kb-02.png', l: 1336, t: 4196, w: 1174, h: 1808 },
    { src: 'nk-kb-03.png', l: 1375, t: 3947, w: 1194, h: 2554 },
    // pixel layers (parent offset: left+0, top+5)
    { src: 'nk-px-21.png', l: 2486, t: 3515, w: 2170, h: 1709 },
    { src: 'nk-px-22.png', l: 2486, t: 3545, w: 2170, h: 1675 },
    { src: 'nk-px-23.png', l: 1640, t: 3392, w: 672, h: 344 },
    { src: 'nk-px-24.png', l: 1657, t: 3391, w: 633, h: 345 },
  ]
  return (
    <div className="layer-frag" style={{ width: 291, height: 433.875 }}>
      <NkFrags frags={frags} />
    </div>
  )
}

// ============================================================
// 錦絵 Multi-Layer Isometric Animation
// ============================================================
function NishikieMultiLayerAnimation() {
  const { language } = useLanguage()
  const containerRef = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.3 },
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  const layers = [
    { id: 'bg-texture', startY: -1300, zIndex: 5, delay: LAYER_DELAY * 6, Component: NkBgLayer },
    { id: 'thick-beige', startY: -1100, zIndex: 10, delay: LAYER_DELAY * 5, Component: NkThickBeigeLayer },
    { id: 'thin-beige', startY: -900, zIndex: 20, delay: LAYER_DELAY * 4, Component: NkThinBeigeLayer },
    { id: 'gray-blue', startY: -700, zIndex: 30, delay: LAYER_DELAY * 3, Component: NkGrayBlueLayer },
    { id: 'pink', startY: -600, zIndex: 40, delay: LAYER_DELAY * 2, Component: NkPinkLayer },
    { id: 'green', startY: -400, zIndex: 50, delay: LAYER_DELAY * 1, Component: NkGreenLayer },
    {
      id: 'black',
      startY: -200,
      zIndex: 60,
      delay: 0,
      Component: () => (
        <div className="layer-frag--no-clip" style={{ width: 291, height: 433.875 }}>
          <img alt="墨版" src={`${NF}/nk-original.png`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'contain', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', inset: -2, border: '2px solid rgba(0,0,0,0.5)' }} />
        </div>
      ),
    },
  ]

  return (
    <section id="section-nishiki" ref={containerRef} className="layer-anim__scene">
      <div className="layer-anim__scene-inner">
        <div className="layer-anim__isometric-wrap">
          <div className="layer-anim__canvas">
            {layers.map(({ id, startY, zIndex, delay, Component }) => (
              <motion.div
                key={id}
                className="layer-anim__layer"
                style={{ zIndex }}
                initial={{ y: startY, opacity: 0 }}
                animate={hasAnimated ? { y: 0, opacity: 1 } : { y: startY, opacity: 0 }}
                transition={{
                  delay,
                  y: springConfig,
                  opacity: { duration: duration.slower, ease: easing.easeOut },
                }}
              >
                <div className="layer-anim__isometric-transform">
                  <div className="layer-anim__frame">
                    <Component />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="layer-anim__title-area"
          initial={{ opacity: 0, y: 20 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: TEXT_DELAY_AFTER_START, duration: duration.slower, ease: easing.easeOut }}
        >
          <h2 className="layer-anim__title">{language === 'ja' ? '錦絵の印刷プロセス' : 'Nishiki-e Printing Process'}</h2>
          <p className="layer-anim__subtitle">{language === 'ja' ? '多色の版木が順に重なり、豊かな色彩の一枚絵になります' : 'Multiple color blocks are layered to create a richly colored print.'}</p>
          <p className="layer-anim__body">
            {language === 'ja'
              ? '錦絵は、10色以上の版木を精密に重ねた多色摺り木版画です。1765年頃、鈴木春信らによって確立され、「錦」のように鮮やかな色彩が可能になりました。ぼかしや空摺りなどの技法も発達し、浮世絵の技術はここで頂点を迎えます。'
              : 'Nishiki-e are full polychrome woodblock prints made by precisely overprinting ten or more blocks. Established around 1765 by Suzuki Harunobu and others, they achieved colors as vivid as brocade ("nishiki"). Techniques such as gradation (bokashi) and embossing (karazuri) also developed, and ukiyo-e printing reached its technical peak here.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// Page
// ============================================================
export default function LayerAnimationPage() {
  const { language } = useLanguage()
  return (
    <div className="layer-anim-page">
      <header className="layer-anim-page__header">
        <div className="layer-anim-page__header-inner">
          <Link to="/" className="layer-anim-page__logo">
            <img src="/images/logo-square.svg" alt="浮世絵" className="logo-kanji-image" />
          </Link>
          <LanguageToggle />
        </div>
      </header>

      {/* ヒーロー（2カラム：左＝タイトル＋サブ、右＝制作風景イラスト） */}
      <section className="layer-anim__hero">
        <div className="layer-anim__hero-content">
          <div className="layer-anim__hero-text">
            <h1 className="layer-anim__hero-title">
              {language === 'ja' ? <>浮世絵の<br />印刷技法</> : <>Ukiyo-e<br />Printing Techniques</>}
            </h1>
            <p className="layer-anim__hero-sub">
              {language === 'ja'
                ? '墨摺絵から錦絵へ — 色が重なり、絵が生まれる'
                : 'From Sumizuri-e to Nishiki-e — Colors layer to create art'}
            </p>
          </div>
          <div className="layer-anim__hero-visual-wrap">
            <div className="layer-anim__hero-visual">
              {/* 歌川国貞(初代)「今様見立士農工商 職人」江戸東京博物館蔵 — ToMuCo 利用規約に基づき出典表示 */}
              <img
                src="/images/top/hero-printing-scene.png"
                alt={language === 'ja' ? '木版画制作の様子（摺り・彫り・下絵など）' : 'Ukiyo-e workshop: printing, carving, and drawing'}
                className="layer-anim__hero-image"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling?.classList.add('is-visible')
                }}
              />
              <div className="layer-anim__hero-placeholder" />
            </div>
            <p className="layer-anim__hero-credit">
              <a href="https://museumcollection.tokyo/works/6256752/" target="_blank" rel="noopener noreferrer">
                {language === 'ja' ? '歌川国貞(初代)「今様見立士農工商 職人」' : 'Utagawa Kunisada I, "A Modern Parody of the Hierarchy… : Craftsmen"'}
              </a>
              {language === 'ja' ? ' 江戸東京博物館蔵' : ' Edo-Tokyo Museum.'}{' '}
              <span className="layer-anim__hero-credit-source">
                {language === 'ja' ? '出典：' : 'Source: '}
                <a href="https://museumcollection.tokyo/works/6256752/" target="_blank" rel="noopener noreferrer">
                  Tokyo Museum Collection
                </a>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* 説明文セクション（2段落＋8技法タイムライン） */}
      <section className="layer-anim__description">
        <div className="layer-anim__description-inner">
          <div className="layer-anim__description-prose">
            <p className="layer-anim__description-text">
              {language === 'ja' ? (
                <>浮世絵は、江戸時代に花開いた木版画の芸術です。<br />美人画や役者絵、風景画など、庶民の暮らしや夢を描き、今も世界中で愛されています。</>
              ) : (
                <>Ukiyo-e is the art of woodblock printing that flourished in the Edo period.<br />It depicted the lives and dreams of ordinary people—beauties, actors, landscapes—and is still loved around the world.</>
              )}
            </p>
            <p className="layer-anim__description-text">
              {language === 'ja' ? (
                <>このサイトでは、浮世絵が「墨一色」から「多色摺り」へと進化していった過程に焦点を当てています。<br />とくに墨摺絵・紅摺絵・錦絵の三つの技法をとりあげ、それぞれの特徴と歴史を、作品とあわせて紹介します。</>
              ) : (
                <>This site focuses on how ukiyo-e evolved from single-color ink prints to full polychrome.<br />We highlight three techniques—sumizuri-e, benizuri-e, and nishiki-e—and introduce their characteristics and history together with representative works.</>
              )}
            </p>
          </div>

          {/* 8技法タイムライン（左から右への時系列順） */}
          <div className="layer-anim__timeline">
            {/* 水平ライン */}
            <div className="layer-anim__timeline-line" />
            
            {/* 各技法のマイルストーンとラベル */}
            {TECHNIQUES.map((technique) => (
              <div key={technique.id}>
                {/* マイルストーン（円） */}
                <div
                  className={`layer-anim__timeline-milestone ${
                    technique.major ? 'layer-anim__timeline-milestone--major' : ''
                  }`}
                  style={{ left: `${technique.milestoneLeft}px` }}
                />
                
                {/* 技法名ラベル（縦書き） */}
                <div
                  className={`layer-anim__timeline-label ${
                    technique.major ? 'layer-anim__timeline-label--major' : 'layer-anim__timeline-label--minor'
                  }`}
                  lang={language}
                  style={{ 
                    left: `${technique.labelLeft}px`,
                    top: `${technique.labelTop}px`
                  }}
                >
                  {language === 'ja' ? technique.name_ja : technique.name_en}
                </div>
              </div>
            ))}
            
            {/* 色サンプル（3箇所に分けて配置） */}
            {/* 黒摺絵の色サンプル（左端） */}
            <div className="layer-anim__timeline-colors layer-anim__timeline-colors--sumizuri">
              <div className="layer-anim__timeline-color" style={{ background: '#2d2d2d' }} />
            </div>
            
            {/* 紅摺絵の色サンプル（中央やや右、縦並び） */}
            <div className="layer-anim__timeline-colors layer-anim__timeline-colors--benizuri">
              <div className="layer-anim__timeline-color" style={{ background: '#7A8B5A' }} />
              <div className="layer-anim__timeline-color" style={{ background: '#B85B5B' }} />
            </div>
            
            {/* 錦絵の色サンプル（右端、2x2グリッド） */}
            <div className="layer-anim__timeline-colors layer-anim__timeline-colors--nishiki">
              <div className="layer-anim__timeline-color" style={{ background: '#3D5A73' }} />
              <div className="layer-anim__timeline-color" style={{ background: '#C9A84C' }} />
              <div className="layer-anim__timeline-color" style={{ background: '#d64e4e' }} />
              <div className="layer-anim__timeline-color" style={{ background: '#9fc09f' }} />
            </div>
          </div>

                {/* プロジェクト概要文（文の区切りで改行し、切りの悪い改行を避ける） */}
                <p className="layer-anim__description-summary">
                  {language === 'ja' ? (
                    <>このプロジェクトでは、色彩の進化における3つの主要なマイルストーン<br />—黒摺絵、紅摺絵、そして錦絵—を深く掘り下げ、それぞれの技法と代表作品を紹介します。</>
                  ) : (
                    <>This project explores three major milestones in the evolution of color—sumizuri-e, benizuri-e, and nishiki-e—<br />introducing each technique and representative works in depth.</>
                  )}
                </p>
        </div>
      </section>

      {/* 黒摺絵（静止） */}
      <SumizurieStatic />

      {/* 紅摺絵アニメーション */}
      <NishikieAnimation />

      {/* 錦絵アニメーション */}
      <NishikieMultiLayerAnimation />

      {/* フッター */}
      <section className="layer-anim__footer">
        <div className="layer-anim__footer-inner">
          <div className="layer-anim__footer-swatches" aria-hidden="true">
            {['#2d2d2d', '#7A8B5A', '#B85B5B', '#3D5A73', '#C9A84C', '#d64e4e', '#9fc09f', '#8BADC4'].map((hex, i) => (
              <div key={i} className="layer-anim__footer-swatch" style={{ background: hex }} />
            ))}
          </div>
          <nav className="layer-anim__footer-nav">
            <Link to="/dawn" className="layer-anim__nav-link">
              <span className="layer-anim__nav-link-text">
                {language === 'ja' ? '錦絵の黎明へ' : 'The Dawn of Nishiki-e'}
              </span>
              <span className="layer-anim__nav-link-visual" aria-hidden="true">
                <span className="layer-anim__nav-link-line" />
                <span className="layer-anim__nav-link-dot" />
              </span>
            </Link>
            <Link to="/timeline" className="layer-anim__nav-link">
              <span className="layer-anim__nav-link-text">
                {language === 'ja' ? '浮世絵の歴史をたどる' : 'Explore the history of ukiyo-e'}
              </span>
              <span className="layer-anim__nav-link-visual" aria-hidden="true">
                <span className="layer-anim__nav-link-line" />
                <span className="layer-anim__nav-link-dot" />
              </span>
            </Link>
          </nav>
        </div>
      </section>
    </div>
  )
}
