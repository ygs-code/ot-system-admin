/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const lodash = require("lodash");
const PurgeCSS = require("purgecss").default;
// 默认配置
const defaultConfig = require("tailwindcss/defaultConfig");

function withConverterToPX(length) {
  const tempTailor = {};

  if (length) {
    Array.from({ length }, (_, i) => (tempTailor[i] = `${i}px`));
  }

  return tempTailor;
}
/**
 * TailwindCSS https://tailwindcss.com/docs/installation
 * https://tailwind.nodejs.cn/docs/adding-custom-styles
 * https://blog.csdn.net/2301_76403820/article/details/131770683
 */

let config = {
  // content: ["./client/**/*.{js,jsx}", "./client/public/index.html"],
  purge: ["./src/**/*.{js,jsx}", "./src/public/index.html"],
  theme: {
    extend: {
      /* rounded-{n} */
      // borderRadius: ({ theme }) => theme("spacing"),
      // /* text-{n} */
      // fontSize: ({ theme }) => theme("spacing"),
      // lineHeight: ({ theme }) => theme("spacing"),
    },

    /**
     * 项目中使用
     * ### <div className="pt-10 m-21 ml-2 mt-33 h-40 font-16"></div>
     */
    spacing: withConverterToPX(600),
    colors: {
      // ...colors
      // gray: colors.coolGray,
      // blue: colors.lightBlue,
      // red: colors.rose,
      // pink: colors.fuchsia,
      // ...antdTheme,
    },

    /**
     * 字体规范
     * http://fed.lzstack.com/visual/font
     */
    fontSize: {
      sm: ["12px", "20px"],
      base: ["14px", "22px"],
      lg: ["16px", "24px"],
      xl: ["20px", "28px"],
      "2xl": ["24px", "32px"],
      "3xl": ["28px", "36px"],
      "4xl": ["32px", "40px"],
      "5xl": ["36px", "44px"],
      "6xl": ["48px", "56px"]
    },

    fontFamily: {
      sans: [
        "PingFang SC",
        "PingFangSC-Regular",
        "Microsoft YaHei",
        "Lucida Console",
        "Arial",
        "sans-serif"
      ]
    }
  },
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("autoprefixer")
  ],
  corePlugins: {
    preflight: false,
  }
};

config = {
  ...config,
  theme: {
    ...defaultConfig.theme,
    ...config.theme
  }
};

// console.log("config1==", JSON.stringify(config));

module.exports = config;
