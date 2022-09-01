/*
 * @Author: hswsp hswsp@mail.ustc.edu.cn
 * @Date: 2022-09-01 01:35:08
 * @LastEditors: hswsp hswsp@mail.ustc.edu.cn
 * @LastEditTime: 2022-09-01 10:24:07
 * @FilePath: /undefined/Users/wu000376/Github/blog-hexo/scripts/injector.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
hexo.extend.injector.register('head_end', 
`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css">
<link rel="stylesheet" href="/assets/justifiedGallery.min.css" />
`,
'gallery')
hexo.extend.injector.register('body_end', 
`
  <script src="https://cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"></script>
  <script src="/assets/jquery.justifiedGallery.min.js"></script>
  <script src="/assets/gallery.js"></script>
`,
'gallery')