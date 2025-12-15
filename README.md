# 浮世絵タイムライン | Ukiyo-e Timeline

An interactive digital archive visualizing the dramatic evolution of Japanese Ukiyo-e woodblock printing techniques from the 1660s to the 1770s, with a focus on the transition from Sumizuri-e (墨摺絵) to Benizuri-e (紅摺絵) to the revolutionary multicolor Nishiki-e (錦絵).

日本の浮世絵版画技術の劇的な進化を可視化したインタラクティブなデジタルアーカイブです。1660年代から1770年代にかけて、墨摺絵から紅摺絵、そして革新的な多色摺り錦絵への移行を紹介します。

![Ukiyo-e Timeline](https://via.placeholder.com/1200x600.png?text=Ukiyo-e+Timeline+Screenshot)

## ✨ Features | 特徴

- 🎨 **Interactive Timeline** - Horizontal scroll through the evolution of Ukiyo-e printing techniques
- 🖼️ **Authentic Loading Animation** - Experience the traditional "suri" (摺り) printing process
- 🌐 **Bilingual Support** - Seamless switching between Japanese and English
- 📱 **Responsive Design** - Optimized for desktop and mobile viewing
- 🎭 **Traditional Aesthetics** - Custom Japanese typography with HOT-Tenshokk-M font
- ⚡ **Smooth Animations** - Powered by Framer Motion for elegant transitions
- 🔍 **Detailed Period Information** - Explore key artists, techniques, and historical context

## 🛠️ Technologies | 技術スタック

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.1
- **Animation**: Framer Motion 11.11.0
- **Data Processing**: PapaParse 5.4.1
- **Styling**: Custom CSS with traditional Japanese design elements
- **Typography**: 
  - HOT-Tenshokk-M (Custom Japanese font)
  - Shippori Mincho (Google Fonts)
- **Automation**: Puppeteer 24.32.0 for screenshot generation

## 📦 Installation | インストール

### Prerequisites | 前提条件

- Node.js (v18 or higher)
- npm or yarn

### Setup | セットアップ

1. Clone the repository | リポジトリをクローン:

```bash
git clone https://github.com/iori73/ukiyoe-timeline.git
cd ukiyoe-timeline
```

2. Install dependencies | 依存関係をインストール:

```bash
npm install
```

3. Start the development server | 開発サーバーを起動:

```bash
npm run dev
```

4. Open your browser | ブラウザを開く:

```
http://localhost:5173
```

## 🚀 Available Scripts | 利用可能なスクリプト

- `npm run dev` - Start development server | 開発サーバーを起動
- `npm run build` - Build for production | 本番用にビルド
- `npm run preview` - Preview production build | ビルドをプレビュー

## 📁 Project Structure | プロジェクト構造

```
ukiyoe-timeline/
├── public/                      # Static assets
│   ├── fonts/                   # Custom Japanese fonts
│   │   └── HOT-Tenshokk-M.otf
│   ├── images/                  # UI images and SVGs
│   │   ├── benizuri-e.png      # Benizuri-e technique example
│   │   ├── sumizuri-e.png      # Sumizuri-e technique example
│   │   ├── nishiki-e.png       # Nishiki-e technique example
│   │   ├── divider.svg         # UI divider
│   │   └── uki-character.svg   # Logo character
│   └── ukiyoe_for_figma_with_images_rows_duplicate_rows.csv
├── src/
│   ├── components/              # React components
│   │   ├── IntroSection.jsx    # Landing/intro section
│   │   ├── FullscreenSection.jsx  # Period detail sections
│   │   ├── HorizontalScroll.jsx   # Horizontal scroll container
│   │   ├── ScrollIndicators.jsx   # Navigation indicators
│   │   ├── LanguageToggle.jsx     # Language switcher
│   │   ├── UkiyoeLoading.jsx      # Traditional printing animation
│   │   ├── PeriodCard.jsx         # Timeline period cards
│   │   ├── DetailModal.jsx        # Detailed information modal
│   │   └── Timeline.jsx           # Timeline visualization
│   ├── context/
│   │   └── LanguageContext.jsx # Language state management
│   ├── data/
│   │   ├── ukiyoe.js           # Data loading and utilities
│   │   └── ukiyoe-loading-layers.json  # Loading animation data
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Global styles (2940+ lines)
│   └── main.jsx                 # Application entry point
├── scripts/
│   ├── convert-to-keigo.py     # Text formality converter
│   └── convert-to-keigo-v2.py  # Enhanced converter
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎨 Key Features Explained | 主要機能の説明

### Loading Animation | ローディングアニメーション

The loading screen recreates the traditional woodblock printing process:
- **Layer 1**: Black outline (墨摺り)
- **Layer 2**: First color layer (薄い色)
- **Layer 3**: Second color layer (濃い色)

Each layer appears sequentially, mimicking the actual printing technique.

### Bilingual Content | バイリンガルコンテンツ

All content is available in both Japanese and English:
- Period names and dates
- Artist information
- Historical context
- Technical descriptions

### Horizontal Scroll Navigation | 横スクロールナビゲーション

Navigate through different periods using:
- Mouse wheel scroll
- Trackpad gestures
- Click navigation indicators
- Keyboard arrow keys

## 🎭 Historical Periods Covered | 対象時代

1. **1660s - Sumizuri-e (墨摺絵)**
   - Single-color black ink prints
   - Hishikawa Moronobu's contributions

2. **1740s - Benizuri-e (紅摺絵)**
   - Two to three-color prints
   - Introduction of "kento" registration marks

3. **1765+ - Nishiki-e (錦絵)**
   - Full multicolor printing (10+ blocks)
   - Suzuki Harunobu's innovations
   - Advanced techniques: bokashi, karazuri

## 🤝 Contributing | 貢献

Contributions are welcome! Please feel free to submit a Pull Request.

プルリクエストを歓迎します！

## 📄 License | ライセンス

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author | 作者

**iori73**
- GitHub: [@iori73](https://github.com/iori73)
- Email: iori730002204294@gmail.com

## 🙏 Acknowledgments | 謝辞

- Traditional Ukiyo-e artists and printmakers
- Japanese cultural heritage institutions
- Open source community

---

**Note**: This project is designed to educate and preserve the cultural heritage of Japanese woodblock printing techniques.

このプロジェクトは、日本の木版画技術の文化遺産を教育し保存することを目的としています。
