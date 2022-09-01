/*
 * @Author: hswsp hswsp@mail.ustc.edu.cn
 * @Date: 2022-09-01 02:12:19
 * @LastEditors: hswsp hswsp@mail.ustc.edu.cn
 * @LastEditTime: 2022-09-01 02:14:13
 * @FilePath: /undefined/Users/wu000376/Github/blog-hexo/themes/fluid/scripts/photho.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use strict";
const fs = require("fs");
const sizeOf = require('image-size');
//本地照片所在目录
const path = "source/gallery"; 
//要放置生成的照片信息文件目录，建议直接放在 source/photos/ 文件夹下
const output = "source/gallery/photoslist.json";
var dimensions;
fs.readdir(path, function (err, files) {
    if (err) {
        return;
    }
    let arr = [];
    (function iterator(index) {
        if (index == files.length) {
            fs.writeFileSync(output, JSON.stringify(arr, null, "\t"));
            return;
        }
        fs.stat(path + "/" + files[index], function (err, stats) {
            if (err) {
                return;
            }
            if (stats.isFile()) {
                dimensions = sizeOf(path + "/" + files[index]);
                console.log(dimensions.width, dimensions.height);
                arr.push(dimensions.width + '.' + dimensions.height + ' ' + files[index]);
            }
            iterator(index + 1);
        })
    }(0));
});