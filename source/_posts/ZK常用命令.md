---
title: ZK常用命令
description: ZK常用命令
author: Starry
tags:
  - Zookeeper
categories:
  - Infrastructure
date: 2021-11-09 18:21:56
index_img: https://th.bing.com/th/id/OIP.vlYXX8-1xuQQTZve-oFq8AHaE7?pid=ImgDet&rs=1
banner_img: https://www.10wallpaper.com/wallpaper/1366x768/1511/Winter_lapland_finland-2015_Landscape_Wallpaper_1366x768.jpg
---

# 常用命令

| 启动ZK服务     | bin/zkServer.sh start           |
| -------------- | ------------------------------- |
| 查看ZK服务状态 | bin/zkServer.sh status          |
| 停止ZK服务     | bin/zkServer.sh stop            |
| 重启ZK服务     | bin/zkServer.sh restart         |
| 连接服务器     | zkCli.sh -server 127.0.0.1:2181 |

 

# 客户端连接

运行 `zkCli.sh –server <ip>`进入命令行工具

![img](https://cdn.jsdelivr.net/gh/hswsp/IMAGE_HOST/img/Center.png)

在192.168.106.82服务器上连接到192.168.106.81服务器下的zk

```bash
[root@hadoop3bin]# zkCli.sh -server 192.168.106.81:2181
```

![img](https://cdn.jsdelivr.net/gh/hswsp/IMAGE_HOST/img/Center1.png)

# 查看znode路径

查看根目录：

```bash
[zk: 192.168.106.81:2181(CONNECTED) 0] ls /
[zookeeper, mygirls]
```

查看其它节点中的内容

```bash
[zk: 192.168.106.81:2181(CONNECTED) 1] ls /mygirls
[liuyifei, angelababy]
[zk: 192.168.106.81:2181(CONNECTED) 2] ls /zookeeper
[quota]
```

# 创建节点

创建testnode节点，关联字符串”zz”

```bash
[zk: 192.168.106.81:2181(CONNECTED) 3] create /zookeeper/testnode "zzzzzzz"
Created /zookeeper/testnode
```

# 获取znode数据，查看节点内容，设置节点内容，删除节点

```bash
[zk: 192.168.106.81:2181(CONNECTED) 4] get /mygirls

lsadasdasd

cZxid = 0x800000002

ctime = Wed Jan 04 23:26:09 CST 2017

mZxid = 0x80000000c

mtime = Wed Jan 04 23:38:06 CST 2017

pZxid = 0x800000004

cversion = 2

dataVersion = 6

aclVersion = 0

ephemeralOwner = 0x0

dataLength = 10

numChildren = 2

[zk: 192.168.106.81:2181(CONNECTED) 5]
```

设置节点内容

```bash
[zk: 192.168.106.81:2181(CONNECTED) 6] ls /mygirls

[liuyifei, angelababy]

[zk: 192.168.106.81:2181(CONNECTED) 7] set /mygirls/liuyifei aaaaaaa

cZxid = 0x800000003

ctime = Wed Jan 04 23:27:56 CST 2017

mZxid = 0x800000010

mtime = Thu Jan 05 00:50:37 CST 2017

pZxid = 0x800000003

cversion = 0

dataVersion = 1

aclVersion = 0

ephemeralOwner = 0x0

dataLength = 7

numChildren = 0

[zk: 192.168.106.81:2181(CONNECTED) 8] get /mygirls/liuyifei

aaaaaaa

cZxid = 0x800000003

ctime = Wed Jan 04 23:27:56 CST 2017

mZxid = 0x800000010

mtime = Thu Jan 05 00:50:37 CST 2017

pZxid = 0x800000003

cversion = 0

dataVersion = 1

aclVersion = 0

ephemeralOwner = 0x0

dataLength = 7

numChildren = 0

[zk: 192.168.106.81:2181(CONNECTED) 9]
```

删除节点

```bash
[zk: 192.168.106.81:2181(CONNECTED) 15] ls /zookeeper

[testnode, quota]

[zk: 192.168.106.81:2181(CONNECTED) 16] delete /zookeeper/testnode

[zk: 192.168.106.81:2181(CONNECTED) 17] ls /zookeeper

[quota]

[zk: 192.168.106.81:2181(CONNECTED) 18]
```

退出客户端的命令：quit

```bash
[zk: 192.168.106.81:2181(CONNECTED) 18] quit

Quitting...

2017-01-05 00:58:21,076 [myid:] - INFO  [main:ZooKeeper@684] - Session: 0x25969e0732e0001 closed

2017-01-05 00:58:21,076 [myid:] - INFO  [main-EventThread:ClientCnxn$EventThread@509] - EventThread shut down

[root@hadoop3 bin]#
```

# 监听znode事件

```bash
ls /mygirls watch   ## 就对一个节点的子节点变化事件注册了监听
```

![img](https://cdn.jsdelivr.net/gh/hswsp/IMAGE_HOST/img/Center2.png)

当在82服务器上写`ls /mygirls watch`的时候，在81上创建一个znode,发现80上的上图出现提醒。

 ```bash
 get /mygirls watch   ## 就对一个节点的数据内容变化事件注册了监听
 ```



![img](https://cdn.jsdelivr.net/gh/hswsp/IMAGE_HOST/img/Center3.png)

![img](https://cdn.jsdelivr.net/gh/hswsp/IMAGE_HOST/img/Center4.png)

开始的时候在80上执行`get /mygirls watch`，接着在81上执行`set /mygirls bbbbbb`，执行完成之后，发现在80上的右上角有消息提醒。 

注意：监听器只生效一次

监听器的工作机制，其实是在客户端会专门创建一个监听线程，在本机的一个端口上等待zk集群发送过来事件

![img](https://cdn.jsdelivr.net/gh/hswsp/IMAGE_HOST/img/Center5.png)

# telnet连接zookeeper

```bash
telnet 192.168.106.82 2181
```

成功之后，输入conf，会出现一下内容：

```bash
clientPort=2181

dataDir=/home/tuzq/software/zookeeper/zkdata/version-2

dataLogDir=/home/tuzq/software/zookeeper/log/version-2

tickTime=2000                                     

maxClientCnxns=60                                                                                                                                                   

minSessionTimeout=4000                                                                           

maxSessionTimeout=40000                                                                                                                                

serverId=3                                                                                                                                                                                                                   

initLimit=10

syncLimit=5

electionAlg=3

electionPort=3888

quorumPort=2888

peerType=0
```
