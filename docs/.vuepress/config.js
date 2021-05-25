module.exports = {
  theme: 'vdoing',
  title: "Passerby's Blog",
  description: '',

  // base: '/', 

  markdown: {
    lineNumbers: true, // 代码行号
  },
  themeConfig: {
    nav: [
      // { text: 'canvas', link: '/02.canvas', target: '_self', rel: '', items: [] }
    ],
    sidebar: {
      mode: 'structuring', 
      collapsable: true
    },
    sidebarDepth: 2, // 侧边栏显示深度，默认1，最大2
    searchMaxSuggestions: 10, // 搜索结果显示最大数
    footer: {
      // 页脚信息
      createYear: 2020, // 博客创建年份
      copyrightInfo:
        'passerby | <a href="https://github.com/xugaoyi/vuepress-theme-vdoing/blob/master/LICENSE" target="_blank">MIT License</a>', // 博客版权信息，支持a标签
    }
  }
}