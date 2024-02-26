---
title: Linux 查看端口占用情况
date: 2022-03-07 01:12:49.905
updated: 2022-03-07 01:12:49.905
url: /archives/linuxcha-kan-duan-kou-zhan-yong-qing-kuang
categories: 
  - Operating System
tags: Linux 
index_img: https://th.bing.com/th/id/R.b096784df52615eb18bec77fa6c1e8ce?rik=Lcpb7KHr7p7A2Q&riu=http%3a%2f%2fnews.baosteel.com%2fnewscenter%2fupload%2fimages%2f2017%2f4%2f13%2f13111352969.jpg&ehk=UvhIWM%2b%2fnxdEh4AeU4EPecDEttFS2GA%2bv46r8jfZCjs%3d&risl=&pid=ImgRaw&r=0
banner_img: https://th.bing.com/th/id/OIP.SUA6xczdez0359Dmb4oySAHaE3?pid=ImgDet&rs=1
---

Linux 查看端口占用情况可以使用 **lsof** 和 **netstat** 命令。

------

# lsof

`lsof(list open files)`是一个列出当前系统打开文件的工具。

lsof 查看端口占用语法格式：

```bash
lsof -i:端口号
```

## 实例

查看服务器 8000 端口的占用情况：

```bash
# lsof -i:8000
COMMAND   PID USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
nodejs  26993 root   10u  IPv4 37999514      0t0  TCP *:8000 (LISTEN)
```

可以看到 8000 端口已经被轻 nodejs 服务占用。

lsof -i 需要 root 用户的权限来执行，如下图：

![img](https://www.runoob.com/wp-content/uploads/2018/09/lsof.png)

更多 lsof 的命令如下：

```bash
lsof -i:8080：查看8080端口占用
lsof abc.txt：显示开启文件abc.txt的进程
lsof -c abc：显示abc进程现在打开的文件
lsof -c -p 1234：列出进程号为1234的进程所打开的文件
lsof -g gid：显示归属gid的进程情况
lsof +d /usr/local/：显示目录下被进程开启的文件
lsof +D /usr/local/：同上，但是会搜索目录下的目录，时间较长
lsof -d 4：显示使用fd为4的进程
lsof -i -U：显示所有打开的端口和UNIX domain文件
```

------

# netstat

`netstat -tunlp` 用于显示 tcp，udp 的端口和进程等相关情况。

netstat 查看端口占用语法格式：

```bash
netstat -tunlp | grep 端口号
```

- -t (tcp) 仅显示tcp相关选项
- -u (udp)仅显示udp相关选项
- -n 拒绝显示别名，能显示数字的全部转化为数字
- -l 仅列出在Listen(监听)的服务状态
- -p 显示建立相关链接的程序名

例如查看 8000 端口的情况，使用以下命令：

```bash
# netstat -tunlp | grep 8000
tcp        0      0 0.0.0.0:8000            0.0.0.0:*               LISTEN      26993/nodejs   
```

更多命令：

```bash
netstat -ntlp   //查看当前所有tcp端口
netstat -ntulp | grep 80   //查看所有80端口使用情况
netstat -ntulp | grep 3306   //查看所有3306端口使用情况
```

------

# kill

在查到端口占用的进程后，如果你要杀掉对应的进程可以使用 kill 命令：

```bash
kill -9 PID
```

如上实例，我们看到 8000 端口对应的 PID 为 26993，使用以下命令杀死进程：

```bash
kill -9 26993
```

