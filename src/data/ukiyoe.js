import Papa from 'papaparse'

/**
 * 各時代の追加作品画像データ
 * year_startをキーとして、その時代の追加画像URLと作品名を格納
 * parallaxSpeed: 0.2〜0.8の範囲で有機的な動きを実現
 */
export const PERIOD_ARTWORKS = {
  // 墨摺絵期（1670-1679）菱川師宣
  // 特徴: 墨一色の木版画、流麗な線描、遊女・美人画が中心
  '1670': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Beauty_looking_back.jpg',
      title_ja: '見返り美人図',
      title_en: 'Beauty Looking Back',
      artist_ja: '菱川師宣',
      artist_en: 'Hishikawa Moronobu',
      description_ja: '振り返る女性の優美な姿を捉えた、浮世絵を代表する傑作。緋色の着物に描かれた菊と桜の文様、そして何気なく振り返る瞬間の美しさが見事に表現されています。',
      description_en: 'A masterpiece of ukiyo-e capturing the elegant figure of a woman looking back. The chrysanthemum and cherry blossom patterns on the scarlet kimono, and the beauty of the casual glance back are exquisitely rendered.',
      parallaxSpeed: 0.3,
      id: '1670-01'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Brooklyn_Museum_-_Yoshiwara_no_Tei_-_Hishikawa_Moronobu.jpg',
      title_ja: '吉原の体',
      title_en: 'Scene at Yoshiwara Pleasure Quarters',
      artist_ja: '菱川師宣',
      artist_en: 'Hishikawa Moronobu',
      description_ja: '江戸時代の遊廓・吉原の賑わいを描いた作品。当時の風俗や建築、人々の様子が細密に描かれ、庶民文化の活気が伝わってきます。',
      description_en: 'A work depicting the bustling atmosphere of Yoshiwara, the pleasure quarters of Edo period. The customs, architecture, and people of the time are meticulously rendered, conveying the vitality of common culture.',
      parallaxSpeed: 0.5,
      id: '1670-02'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Hishikawa_Sumidagawa.jpg',
      title_ja: '隅田川図',
      title_en: 'Sumidagawa Screen',
      artist_ja: '菱川師宣',
      artist_en: 'Hishikawa Moronobu',
      description_ja: '隅田川沿いの風景と人々の生活を描いた屏風絵。川面に浮かぶ舟や岸辺で遊ぶ人々など、江戸の日常が生き生きと描かれています。',
      description_en: 'A folding screen depicting scenery along the Sumida River and daily life. Boats floating on the water and people enjoying themselves along the banks vividly portray everyday Edo life.',
      parallaxSpeed: 0.4,
      id: '1670-03'
    },
    {
      url: 'https://data.ukiyo-e.org/ritsumei/images/Z0163-001.jpg',
      title_ja: '二美人図',
      title_en: 'Two Beauties',
      artist_ja: '菱川師宣',
      artist_en: 'Hishikawa Moronobu',
      description_ja: '二人の美人を対比的に描いた肉筆画。師宣特有の流麗な線描と、女性の優雅な佇まいが見事に表現されています。',
      description_en: 'A hand-painted work depicting two beauties in contrast. Moronobu\'s characteristic flowing line work and the graceful bearing of the women are masterfully expressed.',
      parallaxSpeed: 0.45,
      id: '1670-05'
    }
  ],
  // 役者絵発展期（1700-1719）鳥居清信・清倍
  // 特徴: 歌舞伎役者の躍動的な姿、「蚯蚓描き」の太い輪郭線、劇場宣伝ポスター的機能
  '1700': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Kiyonobu_1.jpg',
      title_ja: '役者絵（筒井吉十郎）',
      title_en: 'Actor Tsutsui Kichijuro',
      artist_ja: '鳥居清信',
      artist_en: 'Torii Kiyonobu I',
      description_ja: '歌舞伎役者・筒井吉十郎を描いた初期役者絵の傑作。鳥居派特有の「蚯蚓描き」と呼ばれる太く力強い輪郭線が、舞台上の躍動感を見事に表現しています。',
      description_en: 'A masterpiece of early actor prints depicting kabuki actor Tsutsui Kichijuro. The bold, powerful outlines known as "mimizu-gaki" characteristic of the Torii school brilliantly express the dynamism of the stage.',
      parallaxSpeed: 0.4,
      id: '1700-01'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Kiyonobu_2.jpg',
      title_ja: '歌舞伎役者図',
      title_en: 'Kabuki Actor',
      artist_ja: '鳥居清信',
      artist_en: 'Torii Kiyonobu I',
      description_ja: '歌舞伎役者の華やかな衣装と勇壮な姿を捉えた作品。当時の劇場看板絵としても機能し、観客を劇場へと誘う宣伝効果がありました。',
      description_en: 'A work capturing the gorgeous costumes and heroic poses of kabuki actors. It also functioned as theater signboards at the time, with promotional appeal to attract audiences.',
      parallaxSpeed: 0.5,
      id: '1700-02'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/MET_DP124269.jpg',
      title_ja: '梅の木の下に立つ女性役者',
      title_en: 'Actor Ikushima Daikichi as Woman',
      artist_ja: '鳥居清信',
      artist_en: 'Torii Kiyonobu I',
      description_ja: '女形役者・生島大吉が演じる女性の姿。梅の木を背景に、優雅で繊細な女性の所作が描かれています。',
      description_en: 'A female character portrayed by onnagata actor Ikushima Daikichi. Against a plum tree background, the elegant and delicate gestures of a woman are depicted.',
      parallaxSpeed: 0.3,
      id: '1700-03'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/MET_DP124270.jpg',
      title_ja: '踊り子としての役者図',
      title_en: 'Actor as Dancing Girl',
      artist_ja: '鳥居清信',
      artist_en: 'Torii Kiyonobu I',
      description_ja: '踊り子を演じる役者の軽やかな動きを捉えた作品。歌舞伎舞踊の美しさと役者の技量が見事に表現されています。',
      description_en: 'A work capturing the light movements of an actor playing a dancing girl. The beauty of kabuki dance and the actor\'s skill are masterfully expressed.',
      parallaxSpeed: 0.6,
      id: '1700-04'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/MET_DP124278.jpg',
      title_ja: '竹馬を持つ女性役者',
      title_en: 'Actor as Woman with Hobby-horse',
      artist_ja: '鳥居清信',
      artist_en: 'Torii Kiyonobu I',
      description_ja: '竹馬を持つ女性を演じる役者の姿。遊び心のある場面が描かれ、当時の娯楽文化の一端を垣間見ることができます。',
      description_en: 'An actor portraying a woman with a hobby-horse. A playful scene is depicted, offering a glimpse into the entertainment culture of the time.',
      parallaxSpeed: 0.45,
      id: '1700-05'
    }
  ],
  // 漆絵・紅絵期（1720-1739）奥村政信
  // 特徴: 漆や膠で光沢を出す技法、紅花による手彩色、西洋の透視図法「浮絵」の試み
  '1720': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/MET_DP124527.jpg',
      title_ja: '絵本表紙',
      title_en: 'Cover From Japanese Illustrated Book',
      artist_ja: '奥村政信',
      artist_en: 'Okumura Masanobu',
      description_ja: '絵本の表紙を飾った作品。漆絵技法により光沢のある仕上がりとなっており、書肆で販売される本の魅力を高めました。',
      description_en: 'A work adorning the cover of an illustrated book. The urushi-e technique provides a glossy finish, enhancing the appeal of books sold at bookshops.',
      parallaxSpeed: 0.4,
      id: '1720-01'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/MET_DP124524.jpg',
      title_ja: '華笠三幅対',
      title_en: 'Triptych of Umbrellas',
      artist_ja: '奥村政信',
      artist_en: 'Okumura Masanobu',
      description_ja: '三幅対形式で描かれた傘を持つ女性たち。紅絵の技法で彩色され、華やかな色彩が特徴です。',
      description_en: 'Women with umbrellas depicted in triptych format. Colored using beni-e technique, characterized by its gorgeous coloring.',
      parallaxSpeed: 0.5,
      id: '1720-02'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/MET_DP124525.jpg',
      title_ja: '若衆三幅対',
      title_en: 'Triptych of Young Men',
      artist_ja: '奥村政信',
      artist_en: 'Okumura Masanobu',
      description_ja: '若衆（若い男性）を描いた三幅対。当時の若者ファッションと美意識を反映した作品です。',
      description_en: 'A triptych depicting wakashu (young men). A work reflecting the fashion and aesthetic sense of youth at the time.',
      parallaxSpeed: 0.3,
      id: '1720-03'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/MET_DP124526.jpg',
      title_ja: '市村竹乃丞図',
      title_en: 'The Actor Ichimura Takenojo',
      artist_ja: '奥村政信',
      artist_en: 'Okumura Masanobu',
      description_ja: '人気歌舞伎役者・市村竹乃丞の姿を描いた役者絵。漆絵の光沢が衣装の豪華さを引き立てています。',
      description_en: 'An actor print depicting popular kabuki actor Ichimura Takenojo. The glossy urushi-e technique enhances the luxuriousness of the costume.',
      parallaxSpeed: 0.6,
      id: '1720-04'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/MET_DP124530.jpg',
      title_ja: '高尾',
      title_en: 'The Courtesan Takao',
      artist_ja: '奥村政信',
      artist_en: 'Okumura Masanobu',
      description_ja: '吉原の名妓・高尾を描いた美人画。その優雅な佇まいと豪華な衣装が見事に表現されています。',
      description_en: 'A beauty print depicting the famous Yoshiwara courtesan Takao. Her elegant bearing and luxurious costume are masterfully rendered.',
      parallaxSpeed: 0.45,
      id: '1720-05'
    }
  ],
  // 紅摺絵隆盛期（1740-1749）石川豊信
  // 特徴: 紅色と緑色の2-3色版画、優美で洗練された美人画、細身で優雅な人物表現
  '1740': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Actors_Nakamura_Shichisabur%C3%B4_II_and_Sanogawa_Ichimatsu%2C_Toyonobu%2C_1740s%2C_signed_Meij%C3%B4d%C3%B4_Ishikawa_Sh%C3%BBha_Toyonobu_zu%2C_MFA.jpg',
      title_ja: '中村七三郎と佐野川市松図',
      title_en: 'Actors Nakamura and Sanogawa',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '人気役者二人を描いた紅摺絵。紅色と緑色の対比が美しく、当時の歌舞伎人気を物語る作品です。',
      description_en: 'A benizuri-e depicting two popular actors. The beautiful contrast of red and green colors tells of the popularity of kabuki at the time.',
      parallaxSpeed: 0.4,
      id: '1740-01'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Ishikawa_Toyonobu_-_Wakashu_with_a_Flower_Cart.jpg',
      title_ja: '花車と若衆',
      title_en: 'Wakashu with a Flower Cart',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '花車を引く若衆の優美な姿。豊信特有の細身で優雅な人物表現が見られる代表作の一つです。',
      description_en: 'The elegant figure of a young man pulling a flower cart. One of the representative works showing Toyonobu\'s characteristic slender and graceful figure depiction.',
      parallaxSpeed: 0.5,
      id: '1740-02'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Beauty_holding_a_book_LCCN2008680290.jpg',
      title_ja: '読書する美人',
      title_en: 'Beauty Holding a Book',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '書物を手にする女性の知的な美しさを描いた作品。当時の女性の教養と読書文化を垣間見ることができます。',
      description_en: 'A work depicting the intellectual beauty of a woman holding a book. It offers a glimpse into the cultivation and reading culture of women at the time.',
      parallaxSpeed: 0.3,
      id: '1740-03'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Passing_a_love_letter_LCCN2008680281.jpg',
      title_ja: '恋文を渡す',
      title_en: 'Passing a Love Letter',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '恋文をやり取りする情景を描いたロマンティックな作品。江戸時代の恋愛模様が繊細に表現されています。',
      description_en: 'A romantic work depicting the scene of exchanging love letters. The romance of the Edo period is delicately expressed.',
      parallaxSpeed: 0.6,
      id: '1740-04'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/De_geliefden_Yaoya_Oshichi_en_Kosho_Kichisaburo%2C_RP-P-1956-578.jpg',
      title_ja: '八百屋お七と小姓吉三郎',
      title_en: 'Lovers Oshichi and Kichisaburo',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '有名な悲恋物語「八百屋お七」の一場面。悲劇的な恋の物語が美しい紅摺絵で表現されています。',
      description_en: 'A scene from the famous tragic love story "Yaoya Oshichi". The tragic romance is expressed in beautiful benizuri-e.',
      parallaxSpeed: 0.45,
      id: '1740-05'
    }
  ],
  // 紅摺絵技術向上期（1750-1764）豊信・春信初期
  // 特徴: 4-5色への発展、細密な表現と微妙な色のグラデーション、錦絵への準備期間
  '1750': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/MET_DP135501.jpg',
      title_ja: '夏柳の美人',
      title_en: 'Summer Willow in the Breeze',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '夏の柳の下に佇む美人を描いた作品。涼やかな風情と女性の優美さが調和した季節感あふれる一枚です。',
      description_en: 'A work depicting a beauty standing under summer willows. A seasonal piece harmonizing cool elegance with feminine grace.',
      parallaxSpeed: 0.4,
      id: '1750-01'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/MET_DP135503.jpg',
      title_ja: '坂田金平の飲酒図',
      title_en: 'Legendary Strongman Sakata Kinpira Drinking Sake',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '伝説の豪傑・坂田金平が酒を飲む姿を描いた作品。力強さとユーモアが同居する独特の雰囲気があります。',
      description_en: 'A work depicting legendary strongman Sakata Kinpira drinking sake. A unique atmosphere where strength and humor coexist.',
      parallaxSpeed: 0.5,
      id: '1750-02'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/MET_DP135505.jpg',
      title_ja: '駕籠美人',
      title_en: 'A Woman Seated in a Kago',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '駕籠に乗る女性の優雅な姿。当時の移動手段と女性の装いが詳細に描かれています。',
      description_en: 'The elegant figure of a woman riding in a palanquin. The transportation methods and women\'s attire of the time are depicted in detail.',
      parallaxSpeed: 0.3,
      id: '1750-03'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/MET_DP135506.jpg',
      title_ja: '潮干狩り',
      title_en: 'Women and Boy Gathering Shells on a Beach',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '浜辺で潮干狩りを楽しむ女性と子供の姿。江戸庶民の行楽風景が生き生きと描かれています。',
      description_en: 'Women and a boy enjoying shell gathering on the beach. The leisure scenes of Edo commoners are vividly depicted.',
      parallaxSpeed: 0.6,
      id: '1750-04'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/MET_DP135507.jpg',
      title_ja: '佐野川市松の若侍騎馬図',
      title_en: 'Actor as Young Samurai on Horseback',
      artist_ja: '石川豊信',
      artist_en: 'Ishikawa Toyonobu',
      description_ja: '人気役者・佐野川市松が若侍を演じる騎馬姿。颯爽とした武士の姿が描かれています。',
      description_en: 'Popular actor Sanogawa Ichimatsu portraying a young samurai on horseback. The dashing figure of a warrior is depicted.',
      parallaxSpeed: 0.45,
      id: '1750-05'
    }
  ],
  // 錦絵成立期（1765-1770）鈴木春信
  // 特徴: 10色以上の多色摺り、可憐で小柄な美人、詩的な情景、「見立絵」の流行
  '1765': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/MET_DP114905.jpg',
      title_ja: '縁側にて',
      title_en: 'On the Veranda',
      artist_ja: '鈴木春信',
      artist_en: 'Suzuki Harunobu',
      description_ja: '縁側でくつろぐ女性の何気ない日常を捉えた錦絵。春信特有の可憐で小柄な美人像と、10色以上の繊細な色彩が特徴です。',
      description_en: 'A nishiki-e capturing the casual daily life of a woman relaxing on the veranda. Characterized by Harunobu\'s distinctive petite, lovely beauty and delicate coloring of over 10 colors.',
      parallaxSpeed: 0.4,
      id: '1765-01'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/MET_DP114910.jpg',
      title_ja: '美人琴高図',
      title_en: 'The Bijin Kinko',
      artist_ja: '鈴木春信',
      artist_en: 'Suzuki Harunobu',
      description_ja: '中国の仙人・琴高を美人に見立てた「見立絵」の代表作。鯉に乗る姿が幻想的に描かれています。',
      description_en: 'A representative "mitate-e" work depicting the Chinese immortal Kinko as a beauty. The figure riding a carp is rendered fantastically.',
      parallaxSpeed: 0.5,
      id: '1765-02'
    },
    {
      url: 'https://data.ukiyo-e.org/met/images/DP114913.jpg',
      title_ja: '雪中二美人',
      title_en: 'Two Women in the Snow',
      artist_ja: '鈴木春信',
      artist_en: 'Suzuki Harunobu',
      description_ja: '雪景色の中を歩く二人の女性。白い雪と色鮮やかな着物の対比が美しい、詩的な情景を描いた作品です。',
      description_en: 'Two women walking through a snowy landscape. A poetic scene with beautiful contrast between white snow and colorful kimonos.',
      parallaxSpeed: 0.3,
      id: '1765-03'
    },
    {
      url: 'https://data.ukiyo-e.org/met/images/DP114914.jpg',
      title_ja: '夜参り美人',
      title_en: 'Woman Visiting the Shrine at Night',
      artist_ja: '鈴木春信',
      artist_en: 'Suzuki Harunobu',
      description_ja: '夜の神社を訪れる女性の神秘的な姿。闘が照らす中の繊細な表現が印象的です。',
      description_en: 'The mysterious figure of a woman visiting a shrine at night. The delicate expression illuminated by lamplight is impressive.',
      parallaxSpeed: 0.6,
      id: '1765-04'
    },
    {
      url: 'https://data.ukiyo-e.org/met/images/DP114915.jpg',
      title_ja: '扇の晴嵐',
      title_en: 'Clearing Breeze from a Fan',
      artist_ja: '鈴木春信',
      artist_en: 'Suzuki Harunobu',
      description_ja: '「座敷八景」シリーズの一枚。扇で仰ぐ涼やかな風と女性の優雅な仕草を詩的に表現しています。',
      description_en: 'One piece from the "Eight Views of the Parlor" series. Poetically expresses the cool breeze from a fan and a woman\'s graceful gesture.',
      parallaxSpeed: 0.45,
      id: '1765-05'
    }
  ],
  // 錦絵拡大期（1770-1789）清長・春章
  // 特徴: 大判（39×26cm）の普及、八頭身の長身美人、複数人物の情景描写、リアリズムの追求
  '1770': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Kiyonaga_bathhouse_women.jpg',
      title_ja: '女湯',
      title_en: 'Bathhouse Women',
      artist_ja: '鳥居清長',
      artist_en: 'Torii Kiyonaga',
      description_ja: '銭湯の女湯を描いた大判錦絵の傑作。清長特有の八頭身の長身美人たちが、自然な姿態で描かれています。',
      description_en: 'A masterpiece of large-format nishiki-e depicting the women\'s bathhouse. Kiyonaga\'s characteristic tall, eight-heads beauties are depicted in natural poses.',
      parallaxSpeed: 0.4,
      id: '1770-01'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Torii_Kiyonaga_-_Boating_Party_on_the_Sumida_River_-_1956.751.a_-_Cleveland_Museum_of_Art.jpg',
      title_ja: '隅田川の船遊び',
      title_en: 'Boating Party on the Sumida River',
      artist_ja: '鳥居清長',
      artist_en: 'Torii Kiyonaga',
      description_ja: '隅田川での船遊びを楽しむ人々を描いた作品。複数の人物が織りなす情景と、江戸の名所の風情が見事に表現されています。',
      description_en: 'A work depicting people enjoying a boat party on the Sumida River. The scene woven by multiple figures and the atmosphere of famous Edo places are masterfully rendered.',
      parallaxSpeed: 0.5,
      id: '1770-02'
    },
    {
      url: 'https://data.ukiyo-e.org/met/scaled/DP146876.jpg',
      title_ja: '市川團十郎五代目',
      title_en: 'Ichikawa Danjuro V',
      artist_ja: '勝川春章',
      artist_en: 'Katsukawa Shunsho',
      description_ja: '名優・五代目市川團十郎の似顔絵的な役者絵。春章が確立した写実的な役者表現の代表作です。',
      description_en: 'A portrait-like actor print of the famous actor Ichikawa Danjuro V. A representative work of the realistic actor expression established by Shunsho.',
      parallaxSpeed: 0.3,
      id: '1770-03'
    },
    {
      url: 'https://data.ukiyo-e.org/met/scaled/DP135624.jpg',
      title_ja: '品川の月',
      title_en: 'Moon at Shinagawa',
      artist_ja: '鳥居清長',
      artist_en: 'Torii Kiyonaga',
      description_ja: '品川の月夜を背景に佇む美人たち。月光に照らされた情景が詩的に描かれています。',
      description_en: 'Beauties standing against the moonlit night of Shinagawa. The scene illuminated by moonlight is poetically depicted.',
      parallaxSpeed: 0.6,
      id: '1770-04'
    },
    {
      url: 'https://data.ukiyo-e.org/met/scaled/DP145700.jpg',
      title_ja: '歌舞伎役者図',
      title_en: 'Kabuki Actor',
      artist_ja: '勝川春章',
      artist_en: 'Katsukawa Shunsho',
      description_ja: '歌舞伎役者の個性を捉えた肖像的作品。リアリズムを追求した春章の画風が見られます。',
      description_en: 'A portrait-like work capturing the individuality of a kabuki actor. Shunsho\'s style pursuing realism can be seen.',
      parallaxSpeed: 0.45,
      id: '1770-05'
    }
  ],
  // 大首絵期（1790-1799）歌麿・写楽
  // 特徴: 大首絵（顔のクローズアップ）、表情や仕草から内面の感情表現、写楽の誇張された役者絵
  '1790': [
    {
      url: 'https://data.ukiyo-e.org/met/images/DP130246.jpg',
      title_ja: '寛政三美人',
      title_en: 'Three Beauties of the Present Day',
      artist_ja: '喜多川歌麿',
      artist_en: 'Kitagawa Utamaro',
      description_ja: '寛政期を代表する三人の美人を描いた大首絵の傑作。それぞれの個性と表情が繊細に描き分けられています。',
      description_en: 'A masterpiece of okubi-e depicting three beauties representative of the Kansei era. Each individuality and expression is delicately distinguished.',
      parallaxSpeed: 0.4,
      id: '1790-01'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Toshusai_Sharaku-_Otani_Oniji%2C_1794.jpg',
      title_ja: '大谷鬼次の奴江戸兵衛',
      title_en: 'Otani Oniji III as Edobei',
      artist_ja: '東洲斎写楽',
      artist_en: 'Toshusai Sharaku',
      description_ja: '写楽の最も有名な作品。大谷鬼次が演じる悪役・奴江戸兵衛の誇張された表情が、舞台上の緊張感を見事に表現しています。',
      description_en: 'Sharaku\'s most famous work. The exaggerated expression of the villain Edobei played by Otani Oniji masterfully expresses the tension on stage.',
      parallaxSpeed: 0.5,
      id: '1790-02'
    },
    {
      url: 'https://data.ukiyo-e.org/met/images/DP130247.jpg',
      title_ja: '高島おひさ',
      title_en: 'Takashima Ohisa',
      artist_ja: '喜多川歌麿',
      artist_en: 'Kitagawa Utamaro',
      description_ja: '江戸で評判の美人・高島おひさを描いた大首絵。二枚の鏡で髪型を確認する何気ない仕草に、女性の美意識が表れています。',
      description_en: 'An okubi-e depicting Takashima Ohisa, a renowned beauty in Edo. The casual gesture of checking her hairstyle with two mirrors reflects feminine aesthetic sense.',
      parallaxSpeed: 0.3,
      id: '1790-03'
    },
    {
      url: 'https://data.ukiyo-e.org/met/images/DP130287.jpg',
      title_ja: '深く忍ぶ恋',
      title_en: 'Deeply Hidden Love',
      artist_ja: '喜多川歌麿',
      artist_en: 'Kitagawa Utamaro',
      description_ja: '「婦人相学十躰」シリーズの一枚。秘めた恋心を表情に滲ませる女性の内面が、繊細に描かれています。',
      description_en: 'One piece from the "Ten Types of Female Physiognomy" series. The inner feelings of a woman with hidden love showing through her expression are delicately depicted.',
      parallaxSpeed: 0.6,
      id: '1790-04'
    },
    {
      url: 'https://data.ukiyo-e.org/met/scaled/DP135756.jpg',
      title_ja: '瀬川富三郎の宿木',
      title_en: 'Segawa Tomisaburo II as Yadorigi',
      artist_ja: '東洲斎写楽',
      artist_en: 'Toshusai Sharaku',
      description_ja: '女形役者・瀬川富三郎が演じる宿木の姿。写楽独特の鋭い観察眼で捉えた役者の表現力が光ります。',
      description_en: 'The figure of Yadorigi played by onnagata actor Segawa Tomisaburo. The actor\'s expressiveness captured by Sharaku\'s unique sharp observation shines.',
      parallaxSpeed: 0.45,
      id: '1790-05'
    }
  ],
  // 風景画期（1800-1850）北斎・広重
  // 特徴: 風景画の隆盛、プルシアンブルーの導入、西洋透視図法、名所絵の大ヒット
  '1800': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Tsunami_by_hokusai_19th_century.jpg',
      title_ja: '神奈川沖浪裏',
      title_en: 'The Great Wave off Kanagawa',
      artist_ja: '葛飾北斎',
      artist_en: 'Katsushika Hokusai',
      description_ja: '世界で最も有名な浮世絵。巨大な波と小さな富士山の対比が印象的で、プルシアンブルーの鮮やかな青が特徴です。西洋の印象派画家にも大きな影響を与えました。',
      description_en: 'The world\'s most famous ukiyo-e. The contrast between the giant wave and small Mt. Fuji is striking, featuring vivid Prussian blue. It greatly influenced Western Impressionist painters.',
      parallaxSpeed: 0.4,
      id: '1800-01'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Red_Fuji_southern_wind_clear_morning.jpg',
      title_ja: '凱風快晴（赤富士）',
      title_en: 'Fine Wind, Clear Morning (Red Fuji)',
      artist_ja: '葛飾北斎',
      artist_en: 'Katsushika Hokusai',
      description_ja: '「富嶽三十六景」シリーズの傑作。朝日に赤く染まる富士山を大胆な構図で描いた、北斎の代表作の一つです。',
      description_en: 'A masterpiece from the "Thirty-six Views of Mt. Fuji" series. One of Hokusai\'s representative works depicting Mt. Fuji dyed red by the morning sun in a bold composition.',
      parallaxSpeed: 0.5,
      id: '1800-02'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Hiroshige16_kanbara.jpg',
      title_ja: '東海道五十三次 蒲原',
      title_en: 'Evening Snow at Kanbara',
      artist_ja: '歌川広重',
      artist_en: 'Utagawa Hiroshige',
      description_ja: '「東海道五十三次」シリーズの中で最も人気の高い作品。静謐な雪景色と旅人の姿が、叙情的な雰囲気を醸し出しています。',
      description_en: 'The most popular work in the "Fifty-three Stations of the Tokaido" series. The serene snowy landscape and travelers create a lyrical atmosphere.',
      parallaxSpeed: 0.3,
      id: '1800-03'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Hiroshige_Atake_sous_une_averse_soudaine.jpg',
      title_ja: '名所江戸百景 大はしあたけの夕立',
      title_en: 'Sudden Shower over Shin-Ohashi',
      artist_ja: '歌川広重',
      artist_en: 'Utagawa Hiroshige',
      description_ja: '突然の夕立に見舞われた大橋の情景。斜めに降る雨の表現が革新的で、ゴッホも模写したことで知られています。',
      description_en: 'A scene of Ohashi Bridge caught in a sudden evening shower. The innovative expression of rain falling diagonally is famous for being copied by Van Gogh.',
      parallaxSpeed: 0.6,
      id: '1800-04'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Hiroshige11_hakone.jpg',
      title_ja: '東海道五十三次 箱根',
      title_en: 'Hakone from Tokaido Series',
      artist_ja: '歌川広重',
      artist_en: 'Utagawa Hiroshige',
      description_ja: '険しい箱根の山道を描いた作品。切り立った岩山と曲がりくねった道が、旅の困難さを物語っています。',
      description_en: 'A work depicting the steep mountain path of Hakone. The precipitous rocky mountains and winding road tell of the hardships of travel.',
      parallaxSpeed: 0.45,
      id: '1800-05'
    }
  ]
}

/**
 * 時代のyear_startから追加の作品画像を取得
 * @param {string} yearStart - 時代の開始年
 * @returns {Array} 作品画像の配列
 */
export function getArtworksForPeriod(yearStart) {
  return PERIOD_ARTWORKS[yearStart] || []
}

export async function loadUkiyoeData() {
  // 🔍 DEMO: データ読み込みを強制的に遅延（ローディング画面表示用）
  // ネットワークリクエストを遅延
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const response = await fetch('/ukiyoe_for_figma_with_images_rows_duplicate_rows.csv')
  const csvText = await response.text()
  
  // パース処理も遅延
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Sort by year_start
        const sortedData = results.data.sort((a, b) => 
          parseInt(a.year_start) - parseInt(b.year_start)
        )
        resolve(sortedData)
      },
      error: (error) => reject(error)
    })
  })
}

// Helper to get localized field
export function getLocalizedField(item, fieldBase, lang) {
  const suffix = lang === 'ja' ? '_ja' : '_en'
  return item[fieldBase + suffix] || item[fieldBase + '_en'] || ''
}

