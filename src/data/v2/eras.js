/**
 * Eras for the v2 timeline — split by printing technique (owner's decision, 2026-11-08;
 * docs/specs/artwork-selection.md). One source of truth for v2: years, names, texts, colours.
 *
 * Colour slots: 10 for v2 (owner, 2026-11-09: 丹 added between 墨 and 紅 — tan-e is defined by it).
 * The live pages keep src/data/periodColors.js (9 slots) until v2 replaces them.
 *
 * activeSlots = which pigments an era's prints USE, from museum records and technique history
 * (not from pixels: indigo vs Prussian blue cannot be told apart in a photo, beni fades).
 * Proportions are measured separately (scripts/measure_period_colors.py) and added later.
 */

export const SLOTS = [
  { id: 'sumi',   label_ja: '墨',     label_en: 'Ink black',     hex: '#1a1a1a' },
  { id: 'tan',    label_ja: '丹',     label_en: 'Red lead',      hex: '#d27a3f' },
  { id: 'beni',   label_ja: '紅',     label_en: 'Safflower red', hex: '#c04545' },
  { id: 'kin',    label_ja: '金/茶',  label_en: 'Gold / ochre',  hex: '#c9a050' },
  { id: 'midori', label_ja: '緑',     label_en: 'Green',         hex: '#7a9060' },
  { id: 'ao',     label_ja: '青灰',   label_en: 'Blue-grey',     hex: '#607888' },
  { id: 'ai',     label_ja: '藍',     label_en: 'Indigo',        hex: '#2a3848' },
  { id: 'bero',   label_ja: 'ベロ藍', label_en: 'Prussian blue', hex: '#2d4f6e' },
  { id: 'gin',    label_ja: '雲母',   label_en: 'Mica',          hex: '#b8b0a4' },
  { id: 'hada',   label_ja: '紙',     label_en: 'Paper',         hex: '#d9c5b8' },
]

export const ERAS = [
  {
    id: '01', year_start: 1670, year_end: 1700,
    name_ja: '墨摺絵', name_en: 'Sumizuri-e: ink only',
    key_ja: '墨一色の版画。版本の挿絵から一枚の絵へ', key_en: 'Ink-only prints: from book illustration to the single sheet',
    artists_ja: '菱川師宣、杉村治兵衛', artists_en: 'Hishikawa Moronobu, Sugimura Jihei',
    background_ja: '江戸の町が大きくなり、町人が絵を買うようになった時代。菱川師宣は、版本（絵入りの本）の挿絵を、本から離した一枚の絵として売り出した。描かれたのは吉原や花見など、町の人が知っている場所と楽しみ。',
    background_en: 'Edo grew and townspeople began to buy pictures. Hishikawa Moronobu took the illustrations of picture books and sold them as single sheets, showing places and pleasures people knew: the Yoshiwara, cherry-blossom outings.',
    technique_ja: '一枚の版木に彫った線を、墨だけで刷る。色はない（あとから筆で色を塗った例もあるが、ここでは墨だけの刷りを選んだ）。',
    technique_en: 'Lines cut into a single block, printed in black ink only. No colour (some sheets were coloured by hand later; the works here are ink only).',
    market_ja: '版本を出す本屋（書肆）が扱った。肉筆画よりずっと安く、町の人が手に入れられる絵だった。',
    market_en: 'Sold by booksellers who also published picture books. Far cheaper than paintings, so ordinary townspeople could own one.',
    activeSlots: ['sumi', 'hada'],
  },
  {
    id: '02', year_start: 1700, year_end: 1720,
    name_ja: '丹絵', name_en: 'Tan-e: hand-applied red lead',
    key_ja: '墨摺に、橙の丹を筆で塗る', key_en: 'Ink prints brushed with orange red lead',
    artists_ja: '鳥居清信、鳥居清倍、懐月堂派', artists_en: 'Torii Kiyonobu I, Torii Kiyomasu I, Kaigetsudō school',
    background_ja: '歌舞伎の人気とともに、役者を描いた絵が求められた。鳥居派は、荒事の役者を太い線で力強く描いた。',
    background_en: 'As kabuki flourished, people wanted pictures of the actors. The Torii school drew bravura actors with bold, sinuous lines.',
    technique_ja: '墨で刷ったあと、丹（鉛からつくる橙色の顔料）を筆で塗る。黄や緑を少し足すこともあった。色はまだ版では刷らない。',
    technique_en: 'After printing in ink, tan (an orange pigment made from lead) was brushed on by hand, sometimes with touches of yellow and green. Colour was not yet printed from blocks.',
    market_ja: '芝居の役者絵は、贔屓の役者の姿を手元に置くための品として売れた。',
    market_en: 'Actor prints sold as keepsakes of a favourite performer.',
    activeSlots: ['sumi', 'tan', 'kin', 'midori', 'hada'],
  },
  {
    id: '03', year_start: 1720, year_end: 1744,
    name_ja: '紅絵・漆絵', name_en: 'Beni-e and urushi-e',
    key_ja: '紅の手彩色、漆のように光る黒、遠近法の浮絵', key_en: 'Hand-coloured pink, lacquer-like black, and perspective prints',
    artists_ja: '奥村政信、鳥居清忠、西村重長', artists_en: 'Okumura Masanobu, Torii Kiyotada, Nishimura Shigenaga',
    background_ja: '奥村政信は、西洋の遠近法を取り入れた「浮絵」で、芝居小屋の中を奥行きのある絵にした。版元が絵師に企画を出し、売れ筋を工夫するようになった。',
    background_en: 'Okumura Masanobu borrowed Western one-point perspective for “floating pictures” (uki-e) that opened up the depth of a theatre. Publishers began to plan what would sell.',
    technique_ja: '紅（紅花からとる赤）を筆で塗るのが紅絵。漆絵は、墨に膠を混ぜて黒を漆のように光らせ、金属の粉をまく。色はまだ手で塗る。',
    technique_en: 'Beni-e are brushed with beni, a red from safflower. Urushi-e mix glue into the ink so the black shines like lacquer, with metal dust sprinkled on. Colour is still added by hand.',
    market_ja: '絵草紙屋の店先に並び、芝居や名所の土産として買われた。',
    market_en: 'Hung in print shops and bought as souvenirs of plays and famous places.',
    activeSlots: ['sumi', 'beni', 'kin', 'midori', 'hada'],
  },
  {
    id: '04', year_start: 1744, year_end: 1765,
    name_ja: '紅摺絵', name_en: 'Benizuri-e: the first colour blocks',
    key_ja: '色を版で刷りはじめる（紅と緑、2〜3色）', key_en: 'Colour printed from blocks for the first time (pink and green, two or three colours)',
    artists_ja: '石川豊信、鳥居清満、鳥居清広', artists_en: 'Ishikawa Toyonobu, Torii Kiyomitsu I, Torii Kiyohiro',
    background_ja: '手で塗る代わりに、色ごとの版木をつくって刷る方法が広まった。同じ絵を同じ色でたくさん刷れるようになった。',
    background_en: 'Instead of brushing colour on, printers cut a separate block for each colour, so the same picture could be printed in the same colours many times.',
    technique_ja: '紅と緑など2〜3枚の色版を重ねて刷る。紙の位置を合わせるための目印「見当」が工夫された。',
    technique_en: 'Two or three colour blocks, typically pink and green, printed over the ink. The kentō, a notch that keeps the paper in register, made this possible.',
    market_ja: '色が刷りで揃うので、手彩色より安く、多く出回った。',
    market_en: 'With colour printed rather than painted, prints became cheaper and more plentiful.',
    activeSlots: ['sumi', 'beni', 'midori', 'hada'],
  },
  {
    id: '05', year_start: 1765, year_end: 1770,
    name_ja: '錦絵の誕生', name_en: 'The birth of nishiki-e',
    key_ja: '多色摺の完成。絵暦から生まれた「錦のような絵」', key_en: 'Full-colour printing perfected, born from calendar prints',
    artists_ja: '鈴木春信', artists_en: 'Suzuki Harunobu',
    background_ja: '1765年、趣味人たちが絵暦（月の大小を絵に隠した暦）を競って刷らせた。その技術が売り物の版画になり、「東錦絵」と呼ばれた。',
    background_en: 'In 1765 wealthy amateurs competed to commission picture calendars (egoyomi) with the long and short months hidden in the design. The technique passed into commercial prints, called “Azuma nishiki-e”, brocade pictures of the East.',
    technique_ja: '十枚を超える色版を重ねる多色摺。中間色、色を付けずに凹凸だけを出す空摺やきめ出しも使う。',
    technique_en: 'Many colour blocks, sometimes more than ten, printed in register; soft intermediate colours, and blind embossing (karazuri) with no ink at all.',
    market_ja: 'はじめは趣味人の贈り物。まもなく絵草紙屋で売られる町の版画になった。',
    market_en: 'First private gifts among connoisseurs, then soon ordinary prints sold in shops.',
    activeSlots: ['sumi', 'beni', 'kin', 'midori', 'ao', 'ai', 'hada'],
  },
  {
    id: '06', year_start: 1770, year_end: 1829,
    name_ja: '錦絵の成熟', name_en: 'Mature nishiki-e',
    key_ja: '雲母摺の大首絵から、化政期の役者絵の大量出版まで', key_en: 'From mica-ground portraits to the mass market of the Bunka–Bunsei years',
    artists_ja: '鳥居清長、喜多川歌麿、東洲斎写楽、歌川豊国、歌川国貞', artists_en: 'Torii Kiyonaga, Kitagawa Utamaro, Tōshūsai Sharaku, Utagawa Toyokuni I, Utagawa Kunisada',
    background_ja: '版元の蔦屋重三郎らが、歌麿や写楽を世に出した。1801年以降（化政期）は新しい技法は少ないが、役者絵や美人画が最も大量に刷られ、売られた。',
    background_en: 'Publishers such as Tsutaya Jūzaburō launched Utamaro and Sharaku. After 1801 (the Bunka–Bunsei years) there were few new techniques, but actor and beauty prints were printed and sold in their greatest numbers.',
    technique_ja: '背景に雲母（きら）の粉を刷って光らせる雲母摺、顔を大きく描く大首絵、紙をこすって艶を出す正面摺。',
    technique_en: 'Mica dust printed on the background to make it shimmer (kira-zuri), close-up portraits (ōkubi-e), and burnishing for sheen.',
    market_ja: '一枚の値段は、かけそば一杯ほどだったと言われる。町の人が気軽に買う刷り物だった。',
    market_en: 'A single sheet is said to have cost about as much as a bowl of noodles: something townspeople bought without thinking twice.',
    activeSlots: ['sumi', 'beni', 'kin', 'midori', 'ao', 'ai', 'gin', 'hada'],
  },
  {
    id: '07', year_start: 1829, year_end: 1858,
    name_ja: 'ベロ藍と風景', name_en: 'Prussian blue and landscape',
    key_ja: '輸入の青「ベロ藍」と、風景画の誕生', key_en: 'Imported Prussian blue and the birth of the landscape print',
    artists_ja: '葛飾北斎、歌川広重、歌川国芳、渓斎英泉', artists_en: 'Katsushika Hokusai, Utagawa Hiroshige, Utagawa Kuniyoshi, Keisai Eisen',
    background_ja: '旅が身近になり、名所や街道の絵が売れた。北斎の「冨嶽三十六景」、広重の「東海道五拾三次」が出て、風景が浮世絵の主役になった。',
    background_en: 'Travel became part of ordinary life and views of famous places and highways sold well. Hokusai’s Thirty-six Views of Mount Fuji and Hiroshige’s Fifty-three Stations of the Tōkaidō made landscape a main subject.',
    technique_ja: '輸入の合成顔料ベロ藍（プルシアンブルー）が安く手に入るようになり、空と水を鮮やかな青で、ぼかしをかけて刷った。',
    technique_en: 'Prussian blue, an imported synthetic pigment, became affordable; sky and water were printed in vivid blue with graded shading (bokashi).',
    market_ja: '旅の土産や、行けない名所を眺める絵として、続き物（シリーズ）で売られた。',
    market_en: 'Sold in series, as travel souvenirs or as views of places people could not visit.',
    activeSlots: ['sumi', 'beni', 'kin', 'midori', 'ao', 'ai', 'bero', 'hada'],
  },
]
