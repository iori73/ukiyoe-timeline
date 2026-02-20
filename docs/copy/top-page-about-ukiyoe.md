# トップページ用：プロジェクト説明・3つの技法の文章

> トップページに掲載する「このプロジェクトについて」「浮世絵の3つのタイプ」の説明文。
> 言語切り替え（日本語／英語）用にペアで記載。実装時は `LanguageContext` と組み合わせて使用する。

---

## 1. このプロジェクトについて（About this project）

### 日本語

浮世絵は、江戸時代に花開いた木版画の芸術です。美人画や役者絵、風景画など、庶民の暮らしや夢を描き、今も世界中で愛されています。

このサイトでは、浮世絵が「墨一色」から「多色摺り」へと進化していった過程に焦点を当てています。とくに**墨摺絵・紅摺絵・錦絵**の三つの技法をとりあげ、それぞれの特徴と歴史を、作品とあわせて紹介します。

### English

Ukiyo-e is the art of woodblock printing that flourished in the Edo period. It depicted the lives and dreams of ordinary people—beauties, actors, landscapes—and is still loved around the world.

This site focuses on how ukiyo-e evolved from single-color ink prints to full polychrome. We highlight three techniques—**sumizuri-e, benizuri-e, and nishiki-e**—and introduce their characteristics and history together with representative works.

---

## 2. 取り上げている3つのタイプ（The three types we feature）

### 墨摺絵（Sumizuri-e）

#### 日本語

**墨摺絵**は、墨（黒）一色だけで摺った木版画です。17世紀後半、菱川師宣によって浮世絵は独立した芸術として確立されました。線の強弱と濃淡だけで、着物の質感や人物の表情まで表現する、シンプルでありながら力強い技法です。

#### English

**Sumizuri-e** are woodblock prints made with black ink only. In the late 17th century, Hishikawa Moronobu established ukiyo-e as an independent art form. Using only the weight and tone of the line, this technique expresses the texture of kimono and the expressions of figures—simple yet powerful.

---

### 紅摺絵（Benizuri-e）

#### 日本語

**紅摺絵**は、紅色と緑色など、2〜3色の版木を重ねて摺った木版画です。18世紀なかばに広まり、墨摺絵に色が加わることで、役者絵や美人画がより華やかに。少ない色数ながら、当時の人々を魅了しました。

#### English

**Benizuri-e** are woodblock prints made by overprinting two or three blocks—typically red and green—in addition to black. They spread in the mid-18th century, adding color to sumizuri-e and making actor prints and beauties more vivid. With just a few colors, they captivated the people of the time.

---

### 錦絵（Nishiki-e）

#### 日本語

**錦絵**は、10色以上の版木を精密に重ねた多色摺り木版画です。1765年頃、鈴木春信らによって確立され、「錦」のように鮮やかな色彩が可能になりました。ぼかしや空摺りなどの技法も発達し、浮世絵の技術はここで頂点を迎えます。

#### English

**Nishiki-e** are full polychrome woodblock prints made by precisely overprinting ten or more blocks. Established around 1765 by Suzuki Harunobu and others, they achieved colors as vivid as brocade (“nishiki”). Techniques such as gradation (bokashi) and embossing (karazuri) also developed, and ukiyo-e printing reached its technical peak here.

---

## 3. 実装用の構造例（For implementation）

実装時は、次のようなキーでデータをまとめると言語切り替えしやすいです。

```js
// 例: src/data/copy.js や コンポーネント内の content オブジェクト
const aboutCopy = {
  ja: {
    projectLead: '浮世絵は、江戸時代に花開いた木版画の芸術です。…',
    projectFocus: 'このサイトでは、浮世絵が「墨一色」から…',
    sumizuriTitle: '墨摺絵',
    sumizuriBody: '墨摺絵は、墨（黒）一色だけで摺った…',
    benizuriTitle: '紅摺絵',
    benizuriBody: '紅摺絵は、紅色と緑色など…',
    nishikiTitle: '錦絵',
    nishikiBody: '錦絵は、10色以上の版木を…',
  },
  en: {
    projectLead: 'Ukiyo-e is the art of woodblock printing…',
    projectFocus: 'This site focuses on how ukiyo-e evolved…',
    sumizuriTitle: 'Sumizuri-e',
    sumizuriBody: 'Sumizuri-e are woodblock prints…',
    benizuriTitle: 'Benizuri-e',
    benizuriBody: 'Benizuri-e are woodblock prints…',
    nishikiTitle: 'Nishiki-e',
    nishikiBody: 'Nishiki-e are full polychrome…',
  },
}
```

表示が長くなりすぎる場合は、「このプロジェクトについて」を1段落にまとめた短い版も用意するとよいです（下記「短い版」）。

---

## 4. 短い版（Optional short version）

トップでスペースが限られる場合用の、1段落ずつの要約です。

### 日本語（短い版）

- **プロジェクト**: 浮世絵は江戸の木版画芸術。このサイトでは、墨摺絵・紅摺絵・錦絵の三つの技法の特徴と歴史を、作品とともに紹介します。
- **墨摺絵**: 墨一色の木版画。菱川師宣により浮世絵が芸術として確立された。
- **紅摺絵**: 紅・緑など2〜3色を重ねた木版画。18世紀なかばに広まり、役者絵や美人画を華やかにした。
- **錦絵**: 10色以上の版木を重ねた多色摺り。1765年頃の鈴木春信らにより確立され、浮世絵の技術的頂点となった。

### English（短い版）

- **Project**: Ukiyo-e is Edo-period woodblock art. This site introduces three techniques—sumizuri-e, benizuri-e, and nishiki-e—with their history and representative works.
- **Sumizuri-e**: Single-color (black ink) woodblock prints. Ukiyo-e was established as an art form by Hishikawa Moronobu.
- **Benizuri-e**: Prints using two or three colors (e.g. red and green). They spread in the mid-18th century and gave actor and beauty prints a vivid appeal.
- **Nishiki-e**: Full polychrome prints with ten or more blocks. Established around 1765 by Suzuki Harunobu and others; the technical peak of ukiyo-e.
