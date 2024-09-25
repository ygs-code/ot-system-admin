// const purgecss = require('@fullhuman/postcss-purgecss')

/*
postcss-color-rgba-fallback转换rgba()为十六进制。
postcss-disabled在伪类存在时添加[disabled]属性和/或.disabled类:disabled。
postcss-epub将-epub-前缀添加到相关属性。
postcss-esplit 为CSS分割你的CSS超过4095选择器。
postcss-fallback添加fallback函数以避免重复声明。
postcss-filter-gradient 为旧IE添加渐变过滤器。
postcss-flexibility添加-js-前缀。Flexibility polyfill
postcss-gradient-transparency-fix转换transparent渐变中的值以支持Safari的不同颜色插值。
postcss-hash-classname 将哈希字符串附加到您的css类名称。
postcss-mqwidth-to-class 将min / max-width媒体查询转换为类。
postcss-opacity 为IE8添加不透明度过滤器。
postcss-pseudoelements将::选择:器转换为选择器以实现IE 8兼容性。
postcss-round-subpixels 将子像素值舍入到最近的完整像素的插件。
postcss-unmq 删除媒体查询，同时保留IE≤8的桌面规则。
postcss-vmin在IE9中vm为vmin单位生成后备。
postcss-will-change在will-change属性之前插入3D hack 。
autoprefixer 使用Can I Use中的数据为您添加供应商前缀。
postcss-pie 使IE成为几个最有用的CSS3装饰功能。
cssgrace 为IE和其他旧浏览器提供各种帮助和转换CSS 3。
pixrem生成rem单位的像素回退。
postcss-fixie 增加轻松无痛的IE黑客攻击

postcss-cssnext (内置autoprefixer) 允许你使用未来的css语法，如css4（可以理解为css中的Babel）
postcss-sprites 自动制作雪碧图，不用手动拼接啦，哈哈哈
cssnano 压缩css代码(如果你是用webpack的话，css-loader集成了cssnano，你不需要再次引入)
postcss-hash-classname 把转换后的css文件名附上哈希值
pixrem 将rem转换为px
postcss-px-to-viewport 将px转换为vh和vw（推荐作为移动端的计量单位，而不是rem）
postcss-pxtorem 将px转换为rem
oldie：可以转换css以兼容旧版Internet Explorer的插件
styleint：检查样式表的插件
postcss-preset-env：允许你将现代CSS转换为大多数浏览器可以理解的内容。




包类插件
插件包需要下载才能使用，下载完之后在postcss的配置文件中进行配置，构建的时候会自动使用。

postcss-utilities ：包括最常用的 mixin、快捷方式和辅助程序
atcss：根据特殊注释转换 CSS 的插件
cssnano：优化 CSS 大小以供生产使用的插件
oldie：可以转换css以兼容旧版Internet Explorer的插件
rucksack：包含通过新功能和快捷方式加速CSS开发的插件
level4：仅包含可让你编写CSS4而无需IE9回退的插件
short：添加并拓展了许多速记属性。
styleint：检查样式表的插件
postcss-hamster：用于垂直节奏、排版、模块化比例功能
postcss-preset-env：允许你将现代CSS转换为大多数浏览器可以理解的内容。
postcss -ui-theme：为你提供语法糖并允许你更改主题
未来的CSS语法相关插件
postcss-apply：支持自定义属性集引用
postcss-attribute-case-insensitive：支持不区分大小写的属性
postcss-bidirection：使用单一语法生成从左到右和从右到左的样式。
postcss-color-function：支持转换颜色的函数
postcss-color-gray：支持 gray() 功能
postcss-color-hex-alpha：#rrggbbaa 和 #rgba 表示法。
postcss-extend：递归地支持规则和占位符的规范，近似 @extend
postcss-pseudo-is：将is属性转换为更兼容的CSS
postcss-selector-not：将CSS4:not()转换为CSS3的 :not()
后备措施相关插件
postcss-color-rgba-fallback：将 rgba() 转换为十六进制。
postcss-epub：将 -epub- 前缀添加到相关属性中。
postcss-fallback：添加了fallback函数以避免重复声明
postcss-filter-gradient：为旧版IE添加了渐变滤镜
postcss-flexibility：为 Flexibility polyfill 添加 -js- 前缀。
postcss-hash-classname：将哈希字符串添加到你的css类名中。—— vue的scoped
postcss-mqwidth-to-class：将最小/最大宽度媒体查询转换为类。
postcss-opacity：为 IE8 添加了不透明度过滤器。
postcss-opacity-percentage：将 CSS4 基于百分比的 opacity 值转换为浮点值。
postcss-page-break：将 page-break- 后备添加到 break- 属性。
postcss-pseudoelements：将::转换成:钻则其一兼容IE8
postcss-replace-overflow-wrap ：用 word-wrap 替换 overflow-wrap
postcss-vmin：为 IE9 中的 vmin 单元生成 vm 后备。
autoprefixer：使用 Can I Use 中的数据为你添加浏览器前缀。
postcss-pie：使 IE 具备了几个最有用的 CSS3 装饰功能。
cssgrace：为IE和其他旧浏览器提供各种辅助程序和转义CSS3。
pixrem：为 rem 单位生成像素回退。
webp-in-css：在 CSS 中使用 WebP 背景图片。
postcss-clamp：将clamp()变换为min/max的组合。
postcss-spring-easing：用生成的 linear() 函数替换 spring()
语言扩展相关插件
postcss-aspect-ratio：将元素的尺寸固定为纵横比。
postcss-atroot：将规则直接放置在根节点处。
postcss-click：允许使用 :click 伪类并在 JavaScript 中实现它。
postcss-conditionals：添加@if语法
postcss-css-variables：支持使用 W3C 类似语法的选择器变量和 at 规则。
postcss-define-property]：定义属性快捷方式。
postcss-for：添加@for循环
csstyle：将组建工作流程添加到样式中
颜色相关组件
post-ase-colors： 用从 ASE 调色板文件读取的值替换颜色名称。
postcss-brand-colors：在brand-colors模块中插入公司品牌颜色。
postcss-color-mix：将两种颜色混合在一起。
postcss-color-short：添加了简写颜色声明。
postcss-theme-colors：添加带有颜色组的深色和浅色主题。
postcss-rgba-hex： 将 rgba 值转换为 hex 类似物。
postcss-get-color：从图片中获取突出的颜色。
postcss-randomcolor：支持使用随机颜色的功能。
图片和字体相关的类
postcss-assets：简化 URL、插入图片尺寸和内联文件
postcss-assets-rebase：重新设定 url() 的资源基础。
postcss-copy-assets：将相对 url() 引用的资源复制到构建目录中。
postcss-data-packer：将嵌入的 Base64 数据移动到单独的文件中。
postcss-image-set：将 background-image 添加到 image-set() 的第一张图片。
[postcss-foft-classes]：为使用 Web 字体的块添加了保护类，以实现更好的字体加载策略。
postcss-placehold： 可以轻松放置占位符图片。
postcss-svg：将内联 SVG 插入 CSS 并允许管理它的颜色。
postcss-svgo：通过 SVGO 处理内联 SVG。
postcss-url：变基或内联 url()。
postcss-urlrebase：将 url() 重新设置为给定的根 URL。
postcss-write-svg：在 CSS 中编写内联 SVG。
网格（Grids）
postcss-grid：添加了语义网格系统。
postcss-grid-kiss：将 ASCII-art 网格转换为 CSS 网格布局。
postcss-grid-system：基于固定的列宽创建网格。
postcss-grid-fluid：创建流体网格。
postcss-layout：是一些常见 CSS 布局模式和网格系统的插件。
优化相关插件
postcss-import：内联@import规则引用的样式表。
postcss-calc：将calc()简化为值。
postcss-nested-import： 在嵌套规则块内内联 @import 规则引用的样式表。
postcss-partial-import：内联标准导入和类似 Sass 的部分。
postcss-remove-root：从样式表中删除 :root 的所有实例。
postcss-zindex：重新设置正 z-index 值的基准。
css-byebye： 删除了你不需要的 CSS 规则。
postcss-no-important：删除声明!important。
快捷方式
postcss-alias：为属性创建较短的别名。
postcss-border：在 border 属性中添加了所有边框的宽度和颜色的简写。
postcss-button：创建按钮。
postcss-center：居中元素。
postcss-circle：插入一个带有颜色的圆圈。
postcss-verthorz：添加垂直和水平间距声明。
font-magician：生成 CSS 中所需的所有 @font-face 规则

*/

module.exports = {
  plugins: [
    require("postcss-import"),
    // require("tailwindcss"),
    require("autoprefixer"),


    // require('postcss-hash-classname')({
    //   hashType: 'md5',
    //   digestType: 'base32',
    //   maxLength: 0,
    //   // 例如，可以指定生成哈希的最小字符长度
    //   minLength: 0,
    //   // 是否包含原始类名作为前缀
    //   includeRawSelectorInOutput: true,
    //   // outputName: 'yoyo',
    //   // dist: './dest',
    //   // type: '.js'
    //   // 配置选项，例如 `transformUnderscore` 来控制下划线转换
    // }),

    // purgecss({
    //   content: ['./**/*.html']
    // })
  ],

  // plugins: {
  //   // "postcss-import": {},
  //   // tailwindcss: {},
  //   autoprefixer: {},
  //   // 'postcss-hash-classname': {
  //   //   hashType: 'md5',
  //   //   digestType: 'base32',
  //   //   maxLength: 6,
  //   //   outputName: 'yoyo',
  //   //   dist: './dest',
  //   //   type: '.js'
  //   // },
  //   // 'tailwindcss/nesting': {},
  //   // 'postcss-nested': {},
  // }
};
