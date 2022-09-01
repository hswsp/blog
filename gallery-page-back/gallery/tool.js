/*
 * @Author: hswsp hswsp@mail.ustc.edu.cn
 * @Date: 2022-09-01 11:48:15
 * @LastEditors: hswsp hswsp@mail.ustc.edu.cn
 * @LastEditTime: 2022-09-01 11:48:18
 * @FilePath: /undefined/Users/wu000376/Github/blog-hexo/source/gallery/tool.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use strict";
const fs = require("fs");
const path = "./capsule";

fs.readdir(path, function (err, files) {
    if (err) {
        return;
    }
    let arr = [];
    (function iterator(index) {
        if (index == files.length) {
            fs.writeFile("output.json", JSON.stringify(arr, null, "\t"));
            return;
        }

        fs.stat(path + "/" + files[index], function (err, stats) {
            if (err) {
                return;
            }
            if (stats.isFile()) {
                arr.push(files[index]);
            }
            iterator(index + 1);
        })
    }(0));
});
