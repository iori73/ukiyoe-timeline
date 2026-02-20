import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import imgGrInner from "figma:asset/0f88d084276497d97ec68247511c3777f779659c.png";
import imgGrInner1 from "figma:asset/7fadcf143a5b18172cbc0c633d960eaf7ccd20bf.png";
import imgGrInner2 from "figma:asset/367c5899d742f0ff87fc35efbfb147e09fbc0e78.png";
import imgGrInner3 from "figma:asset/f4cdf10a36d4e5fab48a44dddcd6247a96e3904e.png";
import imgGrInner4 from "figma:asset/1701def996c690ef25b02034e774586f2eda62eb.png";
import imgGrInner5 from "figma:asset/0887b460918c424f2758b8ebf57990eee2badb8a.png";
import imgGrInner6 from "figma:asset/b6e6e06eece885a0c6e35095910c73e7274573e3.png";
import imgGrMountain from "figma:asset/b116178b41fc96bb84c03db1d5458cd606f5b077.png";
import imgGrMountain1 from "figma:asset/46cb78115207f289661c0ccdb1873d7376d81e4f.png";
import imgGrGrass from "figma:asset/d7cdfad1b68ef0720fafc2eea9472688f81f0c3d.png";
import imgGrGrass1 from "figma:asset/803498a4ee8856df4a10dcfaf2f50dc9717656c8.png";
import imgGrTree from "figma:asset/efe37d4798132f9bde9648ed8c267e90959fd566.png";
import imgGrTree1 from "figma:asset/ebd3171fc7d245cc4beceeb23592de8a5751e9d1.png";
import imgGrTree2 from "figma:asset/d330792b3bdf07db3174adc32227a7b0093d56bf.png";
import imgGrTree3 from "figma:asset/1ca549f5b33c1f1d6dfc4a14c970beffcb2afc5a.png";
import imgGrTree4 from "figma:asset/a7ecd0be6ca43a359c263e4de7d57f53cd658876.png";
import imgGrTree5 from "figma:asset/51e9be7c50ad67688cb501b043cacc24567c8ad0.png";
import imgGrTree6 from "figma:asset/d63621dcbdb6dafed7b85fed00d2f5639a82094d.png";
import imgGrTree7 from "figma:asset/10318dff5a566659ba748f4c36c5b283cf5e049e.png";
import imgGrTree8 from "figma:asset/af2c1cd1c68cc94719924f4b4a72b97b3f748470.png";
import imgGrTree9 from "figma:asset/3d8358e379a1f2be85bde7fad49683bcf0822625.png";
import imgGrTree10 from "figma:asset/7f7732272b1dfa0a13d9de0c22397dc90dcef86c.png";
import imgGrTree11 from "figma:asset/c6eb54a858167f5c35351217ce41cbfe1e2404ba.png";
import imgGrTree12 from "figma:asset/3f62abcb7ad71bdc2dd2551494a8ac7807c37810.png";
import imgGrKimono from "figma:asset/5fe680e340efc75f9a35e97ec3b018462eb9c4c4.png";
import imgGrKimono1 from "figma:asset/53ff41bf00dcec85d01bedf9f9a98563f3b30741.png";
import imgGrKimono2 from "figma:asset/b1150e22959df69d15bd4de9c63701adc3300f2f.png";
import imgGrKimono3 from "figma:asset/3b3815a5cf0caffbbc0d1ebdc4ef46e143e5e72e.png";
import imgGrKimono4 from "figma:asset/a5519a97267677731fda607fe8a805fdc456fe6f.png";
import imgGrKimono5 from "figma:asset/f1c07409c3963f202db8c9376872a2ac43738645.png";
import imgGrKimono6 from "figma:asset/5266fcc3ffd7ec64e3e086816e3b353269470679.png";
import imgGrStrap from "figma:asset/9ebc881032538526585dc4d90d20d784eb0717b7.png";
import imgGrStrap1 from "figma:asset/32b54dcec4733e5e2b20022fed89fda33dd8c8ee.png";
import imgGrHair from "figma:asset/dad14752b73465fa6164bf68f6020f31141da1c4.png";
import imgGrTreeGrass from "figma:asset/177df7bf854cb8b2cdcade4452ba68c210b3fc38.png";
import imgPixelLayer from "figma:asset/a753a27c71e7dc8f0c67f37c627fa4d949ef08b4.png";
import imgPixelLayer1 from "figma:asset/b6e4e41bb88d6ab0ebb6a327a72ff185ffb99897.png";
import imgPixelLayer2 from "figma:asset/9e07beebb6bb879b920a2354ff47e88f1c6963de.png";
import imgPiSakura from "figma:asset/d8452e1110e851b3a75a627bbbf9599b76e196e0.png";
import imgPiSakura1 from "figma:asset/e561984483807b12ae854627c97e9f0167441211.png";
import imgPiSakura2 from "figma:asset/cd0ef9b796abf767f59944fa5955d7509c55be20.png";
import imgPiSakura3 from "figma:asset/a3356b27caba23cd8edf7383496d2dcb78cc553e.png";
import imgPiMountLineR from "figma:asset/a7ad057dd4f2b92cabcffc623f844e891a2e8059.png";
import imgPiMountLineR1 from "figma:asset/4a55261dce588b24160d78ef63431ff7ba77b21e.png";
import imgPiLip from "figma:asset/503a29ac3f507f3cf44f710216f9287048ccd3c6.png";
import imgPiHair from "figma:asset/0fa44ca1fa80bdf50eb24bfbc8b5612a0bd527bd.png";
import imgPiKimono from "figma:asset/a6db2ef12992f5e197b6a386c007d11e55f929db.png";
import imgPiKimono1 from "figma:asset/09fe0a22c7cdfde0b3e8b6ad5fd02dbbaf730942.png";
import imgPiKimono2 from "figma:asset/3db842272034543cad41e94f2639004456f1043c.png";
import imgPiKimono3 from "figma:asset/a87ed5d8dabd17599e982a9a2c5543da1f3f556e.png";
import imgPiKimono4 from "figma:asset/06aa3ce52c5f1adf17fe74b4286ae77acb697a87.png";
import imgPiKimono5 from "figma:asset/c6cf96e41c774ac7bce5287a727eb178ce0883f3.png";
import imgPiKimono6 from "figma:asset/7d00ecdd10fb0b8a5969a73f12a0c5240e8162aa.png";
import imgPiKimono7 from "figma:asset/df916f05b8b6019fe9466648df963a40430dd21d.png";
import imgPiLip1 from "figma:asset/4beded139a9db8c0f5037c8569a2398f64881803.png";
import imgPiMountLineL from "figma:asset/e8366395bd8cc2f844fe2e34b6e6a34dea7ad2c3.png";
import imgOriginal from "figma:asset/2a0c445e088cdd1382b526bfbbf3a43b7d4b953a.png";

// Green Layer Components
function GrInner() {
  return (
    <div
      className="absolute h-[76px] left-[64.43px] top-[313.88px] w-[32.688px]"
      data-name="gr-inner"
    >
      <div
        className="absolute h-[76px] left-0 top-0 w-[32.688px]"
        data-name="gr-inner"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrInner}
        />
      </div>
      <div
        className="absolute h-[59.5px] left-[2.81px] top-[11.25px] w-[29.188px]"
        data-name="gr-inner"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrInner1}
        />
      </div>
      <div
        className="absolute h-[70.688px] left-[1.37px] top-[4.31px] w-[29.875px]"
        data-name="gr-inner"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrInner2}
        />
      </div>
    </div>
  );
}

function GrInner1() {
  return (
    <div
      className="absolute h-[169.313px] left-[44.68px] top-[233.31px] w-[55.313px]"
      data-name="gr-inner"
    >
      <div
        className="absolute h-[32.625px] left-0 top-0 w-[42.813px]"
        data-name="gr-inner"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrInner3}
        />
      </div>
      <div
        className="absolute h-[18.438px] left-[6.5px] top-[150.88px] w-[44.25px]"
        data-name="gr-inner"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrInner4}
        />
      </div>
      <div
        className="absolute h-[59.813px] left-[22.13px] top-[13.56px] w-[33.188px]"
        data-name="gr-inner"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrInner5}
        />
      </div>
      <div
        className="absolute h-[10.313px] left-[28.94px] top-[26.75px] w-[26.063px]"
        data-name="gr-inner"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrInner6}
        />
      </div>
    </div>
  );
}

function GrMountain() {
  return (
    <div
      className="absolute h-[124.438px] left-[5px] top-[172.69px] w-[257.25px]"
      data-name="gr-mountain"
    >
      <div
        className="absolute h-[124.438px] left-0 top-0 w-[237.063px]"
        data-name="gr-mountain"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrMountain}
        />
      </div>
      <div
        className="absolute h-[78.813px] left-0 top-[12.5px] w-[257.25px]"
        data-name="gr-mountain"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrMountain1}
        />
      </div>
    </div>
  );
}

function GrGrass() {
  return (
    <div
      className="absolute h-[146.25px] left-[5px] top-[265.88px] w-[291px]"
      data-name="gr-grass"
    >
      <div
        className="absolute h-[105px] left-0 top-[41.25px] w-[291px]"
        data-name="gr-grass"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrGrass}
        />
      </div>
      <div
        className="absolute h-[33.938px] left-0 top-0 w-[28.438px]"
        data-name="gr-grass"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrGrass1}
        />
      </div>
    </div>
  );
}

function GrTree() {
  return (
    <div
      className="absolute contents left-[4.99px] top-[5px]"
      data-name="gr-tree"
    >
      <div
        className="absolute h-[25.375px] left-[148.81px] top-[246.75px] w-[27.25px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree}
        />
      </div>
      <div
        className="absolute h-[39.625px] left-[165.18px] top-[244.13px] w-[112.75px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree1}
        />
      </div>
      <div
        className="absolute h-[29.938px] left-[256.81px] top-[220.88px] w-[39.188px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree2}
        />
      </div>
      <div
        className="absolute h-[24.438px] left-[168.75px] top-[313.75px] w-[86.313px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree3}
        />
      </div>
      <div
        className="absolute h-[17.313px] left-[11.87px] top-[254.51px] w-[17.625px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree4}
        />
      </div>
      <div
        className="absolute h-[30.813px] left-[9.62px] top-[280.63px] w-[16.938px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree5}
        />
      </div>
      <div
        className="absolute h-[203px] left-[4.99px] top-[135.88px] w-[53.188px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree6}
        />
      </div>
      <div
        className="absolute h-[49.375px] left-[75.24px] top-[5px] w-[70.438px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree7}
        />
      </div>
      <div
        className="absolute h-[71.25px] left-[50.87px] top-[54.82px] w-[163.438px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree8}
        />
      </div>
      <div
        className="absolute h-[63.5px] left-[48.12px] top-[62.94px] w-[171.875px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree9}
        />
      </div>
      <div
        className="absolute h-[74.625px] left-[25.99px] top-[43.88px] w-[37.125px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree10}
        />
      </div>
      <div
        className="absolute h-[137.063px] left-[34.43px] top-[133.07px] w-[17.438px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree11}
        />
      </div>
      <div
        className="absolute h-[212.563px] left-[4.99px] top-[91.88px] w-[64.25px]"
        data-name="gr-tree"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTree12}
        />
      </div>
    </div>
  );
}

function Gr1() {
  return (
    <div
      className="absolute contents left-[4.99px] top-[5px]"
      data-name="gr"
    >
      <div
        className="absolute h-[25.375px] left-[114px] top-[239.69px] w-[25.875px]"
        data-name="gr-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrKimono}
        />
      </div>
      <div
        className="absolute h-[33.75px] left-[109.25px] top-[244.38px] w-[33.625px]"
        data-name="gr-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrKimono1}
        />
      </div>
      <div
        className="absolute h-[117.313px] left-[94.18px] top-[254.25px] w-[37.813px]"
        data-name="gr-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrKimono2}
        />
      </div>
      <div
        className="absolute h-[81.625px] left-[87.93px] top-[275.13px] w-[20.5px]"
        data-name="gr-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrKimono3}
        />
      </div>
      <div
        className="absolute h-[122.063px] left-[139.75px] top-[249px] w-[25.5px]"
        data-name="gr-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrKimono4}
        />
      </div>
      <div
        className="absolute h-[38.063px] left-[130.25px] top-[276.94px] w-[17.938px]"
        data-name="gr-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrKimono5}
        />
      </div>
      <div
        className="absolute h-[147.375px] left-[93px] top-[264.5px] w-[77px]"
        data-name="gr-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrKimono6}
        />
      </div>
      <div
        className="absolute h-[76.313px] left-[92.37px] top-[328.88px] w-[61.563px]"
        data-name="gr-strap"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrStrap}
        />
      </div>
      <GrInner />
      <div
        className="absolute h-[9.75px] left-[68.43px] top-[389.44px] w-[25.813px]"
        data-name="gr-strap"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrStrap1}
        />
      </div>
      <GrInner1 />
      <div
        className="absolute h-[13.625px] left-[54.12px] top-[199.44px] w-[36.125px]"
        data-name="gr-hair"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrHair}
        />
      </div>
      <GrMountain />
      <GrGrass />
      <div
        className="absolute h-[93.063px] left-[5px] top-[31.82px] w-[232.063px]"
        data-name="gr-treeGrass"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgGrTreeGrass}
        />
      </div>
      <GrTree />
    </div>
  );
}

// Pink Layer Components
function PiInner() {
  return (
    <div
      className="absolute h-[119.063px] left-[127.5px] top-[285.75px] w-[39.938px]"
      data-name="pi-inner"
    >
      <div
        className="absolute h-[19.938px] left-[31.56px] top-[0.13px] w-[8.375px]"
        data-name="Pixel layer"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPixelLayer}
        />
      </div>
      <div
        className="absolute h-[20.938px] left-[1.44px] top-0 w-[8.188px]"
        data-name="Pixel layer"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPixelLayer1}
        />
      </div>
      <div
        className="absolute h-[48.375px] left-0 top-[70.69px] w-[16.938px]"
        data-name="Pixel layer"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPixelLayer2}
        />
      </div>
    </div>
  );
}

function PiInner1() {
  return (
    <div
      className="absolute contents left-[5px] top-[5px]"
      data-name="pi-inner"
    >
      <div
        className="absolute h-[140.75px] left-[5px] top-[5px] w-[232.375px]"
        data-name="pi-sakura"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiSakura}
        />
      </div>
      <div
        className="absolute h-[181.438px] left-[48.44px] top-[11.62px] w-[177.813px]"
        data-name="pi-sakura"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiSakura1}
        />
      </div>
    </div>
  );
}

function PiSakura() {
  return (
    <div
      className="absolute contents left-[159.63px] top-[257.94px]"
      data-name="pi-sakura"
    >
      <div
        className="absolute h-[58.375px] left-[159.63px] top-[322.5px] w-[92.938px]"
        data-name="pi-sakura"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiSakura2}
        />
      </div>
      <div
        className="absolute h-[49.625px] left-[162.63px] top-[257.94px] w-[49.813px]"
        data-name="pi-sakura"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiSakura3}
        />
      </div>
    </div>
  );
}

function PiMountLineR() {
  return (
    <div
      className="absolute contents left-[221.07px] top-[234.69px]"
      data-name="pi-mountLineR"
    >
      <div
        className="absolute h-[4.875px] left-[221.07px] top-[234.69px] w-[53.625px]"
        data-name="pi-mountLineR"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiMountLineR}
        />
      </div>
      <div
        className="absolute h-[14.625px] left-[223.13px] top-[237.19px] w-[42.813px]"
        data-name="pi-mountLineR"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiMountLineR1}
        />
      </div>
    </div>
  );
}

function Pi1() {
  return (
    <div
      className="absolute contents left-[5px] top-[5px]"
      data-name="pi"
    >
      <PiInner />
      <div
        className="absolute h-[2.313px] left-[113.88px] top-[244px] w-[2.375px]"
        data-name="pi-lip"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiLip}
        />
      </div>
      <div
        className="absolute h-[21.563px] left-[108.56px] top-[216.62px] w-[39.563px]"
        data-name="pi-hair"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiHair}
        />
      </div>
      <div
        className="absolute h-[23.813px] left-[64.25px] top-[235.69px] w-[23.125px]"
        data-name="pi-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiKimono}
        />
      </div>
      <div
        className="absolute h-[31.375px] left-[59.44px] top-[243.37px] w-[33.188px]"
        data-name="pi-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiKimono1}
        />
      </div>
      <div
        className="absolute h-[41.75px] left-[91.19px] top-[253.56px] w-[14.375px]"
        data-name="pi-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiKimono2}
        />
      </div>
      <div
        className="absolute h-[80.625px] left-[51.82px] top-[249.87px] w-[30.5px]"
        data-name="pi-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiKimono3}
        />
      </div>
      <div
        className="absolute h-[93.75px] left-[78.69px] top-[300.69px] w-[29.688px]"
        data-name="pi-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiKimono4}
        />
      </div>
      <div
        className="absolute h-[90.688px] left-[50.19px] top-[317.69px] w-[51.125px]"
        data-name="pi-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiKimono5}
        />
      </div>
      <div
        className="absolute h-[38.875px] left-[72.44px] top-[267.87px] w-[22.875px]"
        data-name="pi-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiKimono6}
        />
      </div>
      <div
        className="absolute h-[89.125px] left-[43.82px] top-[252.87px] w-[95.25px]"
        data-name="pi-kimono"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiKimono7}
        />
      </div>
      <div
        className="absolute h-[2px] left-[83.88px] top-[232.37px] w-[2.25px]"
        data-name="pi-lip"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiLip1}
        />
      </div>
      <PiInner1 />
      <PiSakura />
      <PiMountLineR />
      <div
        className="absolute h-[56.625px] left-[5px] top-[201.62px] w-[133.125px]"
        data-name="pi-mountLineL"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgPiMountLineL}
        />
      </div>
    </div>
  );
}

// Main Animated Component
function NishikieAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Animation configuration
  const layerDelay = 0.8;
  // Each layer starts at a different height for visible separation
  const blackStartY = -300;
  const greenStartY = -500;
  const pinkStartY = -700;
  // Shared spring config: slow, gentle, organic
  const springConfig = {
    type: "spring" as const,
    stiffness: 30,
    damping: 12,
    mass: 1.2,
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-20"
    >
      <div className="relative">
        {/* Isometric scene container */}
        <div className="flex items-center justify-center">
          {/* Sized to match pre-transform dimensions for proper centering */}
          <div
            className="relative"
            style={{ width: "237.595px", height: "354.25px" }}
          >
            {/* Pink layer - z-10, arrives last */}
            <motion.div
              className="absolute left-0 top-0"
              style={{ zIndex: 10 }}
              initial={{ y: pinkStartY, opacity: 0 }}
              animate={
                hasAnimated
                  ? { y: 0, opacity: 1 }
                  : { y: pinkStartY, opacity: 0 }
              }
              transition={{
                delay: layerDelay * 2,
                y: springConfig,
                opacity: { duration: 0.8, ease: "easeOut" },
              }}
            >
              <div className="-skew-x-30 rotate-30 scale-y-87">
                <div className="h-[354.25px] relative w-[237.595px]">
                  <div
                    className="absolute h-[433.875px] overflow-clip w-[291px]"
                    style={{ left: 5, top: 4.56 }}
                    data-name="pi"
                  >
                    <Pi1 />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Green layer - z-20, arrives second */}
            <motion.div
              className="absolute left-0 top-0"
              style={{ zIndex: 20 }}
              initial={{ y: greenStartY, opacity: 0 }}
              animate={
                hasAnimated
                  ? { y: 0, opacity: 1 }
                  : { y: greenStartY, opacity: 0 }
              }
              transition={{
                delay: layerDelay * 1,
                y: springConfig,
                opacity: { duration: 0.8, ease: "easeOut" },
              }}
            >
              <div className="-skew-x-30 rotate-30 scale-y-87">
                <div className="h-[354.25px] relative w-[237.595px]">
                  <div
                    className="absolute h-[433.875px] overflow-clip w-[291px]"
                    style={{ left: 5, top: 4.56 }}
                    data-name="gr"
                  >
                    <Gr1 />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Black outline layer - z-30, arrives first */}
            <motion.div
              className="absolute left-0 top-0"
              style={{ zIndex: 30 }}
              initial={{ y: blackStartY, opacity: 0 }}
              animate={
                hasAnimated
                  ? { y: 0, opacity: 1 }
                  : { y: blackStartY, opacity: 0 }
              }
              transition={{
                delay: 0,
                y: springConfig,
                opacity: { duration: 0.8, ease: "easeOut" },
              }}
            >
              <div className="-skew-x-30 rotate-30 scale-y-87">
                <div className="h-[354.25px] relative w-[237.595px]">
                  <div
                    className="absolute h-[433.875px] w-[291px]"
                    style={{ left: 5, top: 4.56 }}
                    data-name="original"
                  >
                    <img
                      alt=""
                      className="absolute inset-0 max-w-none object-contain size-full"
                      src={imgOriginal}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute border-2 border-[rgba(0,0,0,0.5)] border-solid inset-[-2px]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={
            hasAnimated
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{
            delay: layerDelay * 2 + 3,
            duration: 1,
            ease: "easeOut",
          }}
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            錦絵の印刷プロセス
          </h1>
          <p className="text-slate-600">
            色別のレイヤーが重なり、一枚の絵になります
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="size-full">
      {/* Hero section with scroll prompt */}
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <h1 className="text-6xl font-bold mb-6">
          錦絵アニメーション
        </h1>
        <p className="text-xl mb-12 text-slate-300">
          日本の伝統的な木版画の印刷技法を体験
        </p>
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-slate-400">
            下にスクロールしてください
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg
              className="w-6 h-6 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Animation section */}
      <NishikieAnimation />

      {/* Footer section */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-t from-slate-900 to-slate-800 text-white">
        <div className="text-center max-w-2xl px-8">
          <h2 className="text-4xl font-bold mb-6">
            伝統技法の美しさ
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            錦絵は江戸時代に発展した多色刷りの木版画です。各色ごとに版木を作り、
            一枚ずつ重ねて刷ることで、鮮やかな色彩の作品が生まれます。
            このアニメーションは、その伝統的な印刷プロセスを現代的に表現したものです。
          </p>
        </div>
      </div>
    </div>
  );
}