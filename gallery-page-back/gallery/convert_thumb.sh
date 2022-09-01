#!/bin/bash
###
 # @Author: hswsp hswsp@mail.ustc.edu.cn
 # @Date: 2022-09-01 10:41:24
 # @LastEditors: hswsp hswsp@mail.ustc.edu.cn
 # @LastEditTime: 2022-09-01 10:41:25
 # @FilePath: /undefined/Users/wu000376/Github/blog-hexo/source/gallery/capsule/convert_thumb.sh
 # @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
### 
for i in *.jpg
do
    echo "生成缩略图 $i ..."
    convert -thumbnail 480 $i ./thumbnails/thumb_$i
done