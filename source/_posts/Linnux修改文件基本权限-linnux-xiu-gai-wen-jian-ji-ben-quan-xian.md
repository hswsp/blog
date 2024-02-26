---
title: Linnux修改文件基本权限
date: 2022-03-07 01:04:30.086
updated: 2022-03-07 01:29:07.183
url: /archives/linnux-xiu-gai-wen-jian-ji-ben-quan-xian
categories: 
  - Operating System
tags: Linux
index_img: https://img.freepik.com/premium-vector/meadows-landscape-with-mountains-hill_104785-943.jpg?w=2000
banner_img: https://img.freepik.com/premium-vector/meadows-landscape-with-mountains-hill_104785-943.jpg?w=2000
---

# 命令格式

Linux既然每个文件或目录都有自己的权限属性，那么如何来修改他们的权限属性呢，在学命令之前先了解一下Linux命令的格式：

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/1.png?raw=true)

[-选项]：就是用来调整命令功能的。

[参数]：命令操作的对象。

# 修改文件基本权限的命令

想要改文件的权限，只有管理员root和所有者才能修改

## chmod：更改文件9个属性

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/2.png?raw=true)

 

Linux文件属性有两种设置方法，一种是数字，一种是符号。

Linux文件的基本权限就有九个，分别是owner/group/others三种身份各有自己的read/write/execute权限。

### 数字改变文件权限（常用）

我们可以使用数字来代表各个权限，各权限的分数对照表如下：

- r:4
- w:2
- x:1

每种身份(owner/group/others)各自的三个权限(r/w/x)分数是需要累加的，例如当权限为： [-rwxrwx---] 分数则是：

- owner = rwx = 4+2+1 = 7
- group = rwx = 4+2+1 = 7
- others= --- = 0+0+0 = 0

所以等我们设定权限的变更时，该文件的权限数字就是770啦！变更权限的指令chmod的语法是这样的：

```
 chmod [-R] xyz 文件或目录
```

- xyz : 就是刚刚提到的数字类型的权限属性，为 rwx 属性数值的相加。
- -R : 进行递归(recursive)的持续变更，亦即连同次目录下的所有文件都会变更

### 符号类型改变文件权限

 我们就可以藉由u, g, o来代表三种身份的权限！

此外， a 则代表 all 亦即全部的身份！那么读写的权限就可以写成r, w, x！也就是可以使用底下的方式来看：

|       | u    | +(加入) | r    |            |
| ----- | ---- | ------- | ---- | ---------- |
|       | g    | -(除去) | w    |            |
| chmod | o    | =(设定) | x    | 文件或目录 |
|       | a    |         |      |            |

如果我们需要将文件权限设置为` -rwxr-xr--` ，可以使用 `chmod u=rwx,g=rx,o=r `文件名 来设定。

例：

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/3.png?raw=true)

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/4.png?raw=true)

注意：如果一个目录有写的权限，其他用户对于这个目录下的文件也可以删除。

## chown：更改文件属主，也可以同时更改文件属组

注意：这个命令只有管理员root才可以操作。而且系统里是必须存在这个用户。

 

 

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/5.png?raw=true)

语法：

chown [–R] 属主名： 文件名

chown [-R] 属主名：属组名 文件名

## chgrp：更改文件属组。

 

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/6.png?raw=true)

语法：

```
chgrp [-R] 属组名 文件名
```

参数选项

- -R：递归更改文件属组，就是在更改某个目录文件的属组时，如果加上-R的参数，那么该目录下的所有文件的属组都会更改。

## **umask设置预设的权限掩码**

Linux umask命令指定在建立文件时预设的权限掩码，在学习这个命令之前，先了解一下默认的所有者和所属组是哪来的？

一个文件创建的时候所有者和所属组是哪来的？

所有者：谁创建的文件谁就是这个文件的所有者。

所属组：就是这个文件创建者的缺省组，每个用户只能有一个缺省组。

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/7.png?raw=true)

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/8.png?raw=true)显示新建文件的缺省权限。

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/9.png?raw=true)

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/10.png?raw=true)

 

创建一个目录的时候查看发现 权限跟缺省权限是一致的，但是在test目录里创建一个文件后，查看文件缺省权限跟默认缺省权限不一致，这个是为什么呢？

`rwxr-xr-x`

rw-r--r--  对比发现都少了一个x可执行权限，这是因为在Linux里缺省权限创建的文件是不可具有可执行权限的。

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/11.png?raw=true)

单独执行  **umask**  发现现实出 **0022** ，这是什么意思呢？

022是权限掩码意思，真正的权限是777-022=755 写出来就是rwxr-xr-x.

如果我们自己要是想修改这个缺省权限，该怎么修改的。

先把想修改的权限格式表示出来，算出对应的数字，再用777-对应的数字就可以，例如：

![img](https://github.com/hswsp/IMAGE_HOST/blob/main/Blog/linux-aut/12.png?raw=true)