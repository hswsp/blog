/*
 * @Author: hswsp hswsp@mail.ustc.edu.cn
 * @Date: 2022-09-01 10:31:20
 * @LastEditors: hswsp hswsp@mail.ustc.edu.cn
 * @LastEditTime: 2022-09-01 10:31:28
 * @FilePath: /undefined/Users/wu000376/Github/blog-hexo/source/assets/gallery.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
(function () {
    el = $("article.page-content");
    if (el !== undefined) {
        el.innerHTML = '';
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                galleryContent = document.createElement("div");
                galleryContent.id = "gallery-content";
                galleryContent.class = "justified-gallery";
                function renderGallery(node) {
                    if (node.contents !== undefined && node.contents.length > 0) {
                        node.contents.forEach(sd => {
                            imgUrl = node.name + '/' + sd.name;
                            imgThumbUrl = node.name + '/thumbnails/thumb_' + sd.name;
                            galleryContent.innerHTML += `
                                <a  href="`+ imgUrl + `" data-fancybox="images">
                                    <img src="`+ imgThumbUrl + `">
                                </a>
                            `;
                        });
                    }
                }
                data.forEach(d => renderGallery(d) );
                el.append(galleryContent);
                $('#gallery-content').justifiedGallery({ rowHeight: 150, margins: 5 });
            });
    }
})();

