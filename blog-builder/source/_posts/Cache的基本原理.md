---
title: Cache的基本原理
description: Cache的基本原理
author: Starry
date: 2022-09-14 11:13:29
tags:
  - Architecture
categories:
  - Operating System
index_img: https://pic1.zhimg.com/80/v2-1a6af4b2fdf482c39f5f03e554b3a494_1440w.jpg
banner_img: https://pic1.zhimg.com/80/v2-1a6af4b2fdf482c39f5f03e554b3a494_1440w.jpg
---

对于没有接触过底层技术的朋友来说，或许从未听说过cache。毕竟cache的存在对程序员来说是透明的。在接触cache之前，先为你准备段code分析。

```c
int arr[10][128];

for (i = 0; i < 10; i++)
        for (j = 0; j < 128; j++)
                arr[i][j] = 1;
```

如果你曾经学习过C/C++语言，这段code自然不会陌生。如此简单的将`arr`数组所有元素置1。 你有没有想过这段code还有下面的一种写法。

```c
int arr[10][128];

for (i = 0; i < 128; i++)
        for (j = 0; j < 10; j++)
                arr[j][i] = 1;
```

功能完全一样，但是我们一直在重复着第一种写法（或许很多的书中也是建议这么编码），你是否想过这其中的缘由？文章的主角是cache，所以你一定猜到了答案。那么cache是如何影响这2段code的呢？

# 为什么需要cache

在思考为什么需要cache之前，我们首先先来思考另一个问题：我们的程序是如何运行起来的？

我们应该知道程序是运行在 RAM之中，RAM 就是我们常说的DDR（例如： DDR3、DDR4等）。我们称之为main memory（主存）。当我们需要运行一个进程的时候，首先会从磁盘设备（例如，eMMC、UFS、SSD等）中将可执行程序load到主存中，然后开始执行。在CPU内部存在一堆的通用寄存器（register）。如果CPU需要将一个变量（假设地址是A）加1，一般分为以下3个步骤：

1. CPU 从主存中读取地址A的数据到内部通用寄存器 x0（ARM64架构的通用寄存器之一）。
2. 通用寄存器 x0 加1。
3. CPU 将通用寄存器 x0 的值写入主存。

我们将这个过程可以表示如下：

![img](https://pic1.zhimg.com/80/v2-1aa0caac22aec470dd15d0a7ca1f4c80_1440w.jpg)

其实现实中，CPU通用寄存器的速度和主存之间存在着太大的差异。两者之间的速度大致如下关系：

![img](https://pic2.zhimg.com/80/v2-cce58cab829ecc2755f6797b41bea821_1440w.jpg)

CPU register的速度一般小于1ns，主存的速度一般是65ns左右。速度差异近百倍。因此，上面举例的3个步骤中，步骤1和步骤3实际上速度很慢。当CPU试图从主存中load/store 操作时，由于主存的速度限制，CPU不得不等待这漫长的65ns时间。如果我们可以提升主存的速度，那么系统将会获得很大的性能提升。如今的DDR存储设备，动不动就是几个GB，容量很大。如果我们采用更快材料制作更快速度的主存，并且拥有几乎差不多的容量。其成本将会大幅度上升。我们试图提升主存的速度和容量，又期望其成本很低，这就有点难为人了。因此，我们有一种折中的方法，那就是制作一块速度极快但是容量极小的存储设备。那么其成本也不会太高。这块存储设备我们称之为cache memory。在硬件上，我们将cache放置在CPU和主存之间，作为主存数据的缓存。 当CPU试图从主存中load/store数据的时候， CPU会首先从cache中查找对应地址的数据是否缓存在cache 中。如果其数据缓存在cache中，直接从cache中拿到数据并返回给CPU。当存在cache的时候，以上程序如何运行的例子的流程将会变成如下：

![img](https://pic2.zhimg.com/80/v2-bc15d8c0612599fc3de51c4382e07aa5_1440w.jpg)

CPU和主存之间直接数据传输的方式转变成CPU和cache之间直接数据传输。cache负责和主存之间数据传输。

# 多级cache存储结构

cahe的速度在一定程度上同样影响着系统的性能。一般情况cache的速度可以达到1ns，几乎可以和CPU寄存器速度媲美。但是，这就满足人们对性能的追求了吗？并没有。当cache中没有缓存我们想要的数据的时候，依然需要漫长的等待从主存中load数据。为了进一步提升性能，引入多级cache。前面提到的cache，称之为L1 cache（第一级cache）。我们在L1 cache 后面连接L2 cache，在L2 cache 和主存之间连接L3 cache。等级越高，速度越慢，容量越大。但是速度相比较主存而言，依然很快。不同等级cache速度之间关系如下：

![img](https://pic1.zhimg.com/80/v2-0910f3308b1d0e425c308307869a3f68_1440w.jpg)

经过3级cache的缓冲，各级cache和主存之间的速度最萌差也逐级减小。在一个真实的系统上，各级cache之间硬件上是如何关联的呢？我们看下Cortex-A53架构上各级cache之间的硬件抽象框图如下：

![img](https://pic3.zhimg.com/80/v2-155a251f204f87982b21b742002ef136_1440w.jpg)

在Cortex-A53架构上，L1 cache分为单独的instruction cache（ICache）和data cache（DCache）。L1 cache是CPU私有的，每个CPU都有一个L1 cache。一个cluster 内的所有CPU共享一个L2 cache，L2 cache不区分指令和数据，都可以缓存。所有cluster之间共享L3 cache。L3 cache通过总线和主存相连。

## 多级cache之间的配合工作

首先引入两个名词概念，命中和缺失。 CPU要访问的数据在cache中有缓存，称为“命中” (hit)，反之则称为“缺失” (miss)。多级cache之间是如何配合工作的呢？我们假设现在考虑的系统只有两级cache。

![img](https://pic2.zhimg.com/80/v2-4974c1f109f00f887fceda68b37bd3f5_1440w.jpg)

当CPU试图从某地址load数据时，首先从L1 cache中查询是否命中，如果命中则把数据返回给CPU。如果L1 cache缺失，则继续从L2 cache中查找。当L2 cache命中时，数据会返回给L1 cache以及CPU。如果L2 cache也缺失，很不幸，我们需要从主存中load数据，将数据返回给L2 cache、L1 cache及CPU。这种多级cache的工作方式称之为inclusive cache。某一地址的数据可能存在多级缓存中。与inclusive cache对应的是exclusive cache，这种cache保证某一地址的数据缓存只会存在于多级cache其中一级。也就是说，任意地址的数据不可能同时在L1和L2 cache中缓存。

# 直接映射缓存(Direct mapped cache)

我们继续引入一些cache相关的名词。cache的大小称之为cahe size，代表cache可以缓存最大数据的大小。我们将cache平均分成相等的很多块，每一个块大小称之为cache line，其大小是cache line size。例如一个64 Bytes大小的cache。如果我们将64 Bytes平均分成64块，那么cache line就是1字节，总共64行cache line。如果我们将64 Bytes平均分成8块，那么cache line就是8字节，总共8行cache line。现在的硬件设计中，一般cache line的大小是4-128 Byts。为什么没有1 byte呢？原因我们后面讨论。

这里有一点需要注意，cache line是cache和主存之间数据传输的最小单位。什么意思呢？当CPU试图load一个字节数据的时候，如果cache缺失，那么cache控制器会从主存中一次性的load cache line大小的数据到cache中。例如，cache line大小是8字节。CPU即使读取一个byte，在cache缺失后，cache会从主存中load 8字节填充整个cache line。又是因为什么呢？后面说完就懂了。

我们假设下面的讲解都是针对64 Bytes大小的cache，并且cache line大小是8字节。我们可以类似把这块cache想想成一个数组，数组总共8个元素，每个元素大小是8字节。就像下图这样。

![img](https://pic1.zhimg.com/80/v2-3e0de5f8b95e27dbd41328c9d089224c_1440w.jpg)

现在我们考虑一个问题，CPU从0x0654地址读取一个字节，cache控制器是如何判断数据是否在cache中命中呢？cache大小相对于主存来说，可谓是小巫见大巫。所以cache肯定是只能缓存主存中极小一部分数据。我们如何根据地址在有限大小的cache中查找数据呢？现在硬件采取的做法是对地址进行散列（可以理解成地址取模操作）。我们接下来看看是如何做到的？

![img](https://pic2.zhimg.com/80/v2-e8deb539258684ad9d4dffef08b02c09_1440w.jpg)

我们一共有8行cache line，cache line大小是8 Bytes。所以我们可以利用地址低3 bits（如上图地址蓝色部分）用来寻址8 bytes中某一字节，我们称这部分bit组合为offset。同理，8行cache line，为了覆盖所有行。我们需要3 bits（如上图地址黄色部分）查找某一行，这部分地址部分称之为index。现在我们知道，如果两个不同的地址，其地址的bit3-bit5如果完全一样的话，那么这两个地址经过硬件散列之后都会找到同一个cache line。所以，当我们找到cache line之后，只代表我们访问的地址对应的数据可能存在这个cache line中，但是也有可能是其他地址对应的数据。所以，我们又引入tag array区域，tag array和data array一一对应。每一个cache line都对应唯一一个tag，tag中保存的是整个地址位宽去除index和offset使用的bit剩余部分（如上图地址绿色部分）。tag、index和offset三者组合就可以唯一确定一个地址了。因此，当我们根据地址中index位找到cache line后，取出当前cache line对应的tag，然后和地址中的tag进行比较，如果相等，这说明cache命中。如果不相等，说明当前cache line存储的是其他地址的数据，这就是cache缺失。在上述图中，我们看到tag的值是0x19，和地址中的tag部分相等，因此在本次访问会命中。由于tag的引入，因此解答了我们之前的一个疑问“为什么硬件cache line不做成一个字节？”。这样会导致硬件成本的上升，因为原本8个字节对应一个tag，现在需要8个tag，占用了很多内存。tag也是cache的一部分，但是我们谈到cache size的时候并不考虑tag占用的内存部分。

我们可以从图中看到tag旁边还有一个valid bit，这个bit用来表示cache line中数据是否有效（例如：1代表有效；0代表无效）。当系统刚启动时，cache中的数据都应该是无效的，因为还没有缓存任何数据。cache控制器可以根据valid bit确认当前cache line数据是否有效。所以，上述比较tag确认cache line是否命中之前还会检查valid bit是否有效。只有在有效的情况下，比较tag才有意义。如果无效，直接判定cache缺失。

上面的例子中，cache size是64 Bytes并且cache line size是8 bytes。offset、index和tag分别使用3 bits、3 bits和42 bits（假设地址宽度是48 bits）。我们现在再看一个例子：512 Bytes cache size，64 Bytes cache line size。根据之前的地址划分方法，offset、index和tag分别使用6 bits、3 bits和39 bits。如下图所示。

![img](https://pic2.zhimg.com/80/v2-f6fdf760d314f146941e2192957f1a81_1440w.jpg)

## 直接映射缓存的优缺点

直接映射缓存在硬件设计上会更加简单，因此成本上也会较低。根据直接映射缓存的工作方式，我们可以画出主存地址0x00-0x88地址对应的cache分布图。

![img](https://pic2.zhimg.com/80/v2-b3d111caabc93c638bb08bde5026d711_1440w.jpg)

我们可以看到，地址0x00-0x3f地址处对应的数据可以覆盖整个cache。0x40-0x7f地址的数据也同样是覆盖整个cache。我们现在思考一个问题，如果一个程序试图依次访问地址0x00、0x40、0x80，cache中的数据会发生什么呢？首先我们应该明白0x00、0x40、0x80地址中index部分是一样的。因此，这3个地址对应的cache line是同一个。所以，当我们访问0x00地址时，cache会缺失，然后数据会从主存中加载到cache中第0行cache line。当我们访问0x40地址时，依然索引到cache中第0行cache line，由于此时cache line中存储的是地址0x00地址对应的数据，所以此时依然会cache缺失。然后从主存中加载0x40地址数据到第一行cache line中。同理，继续访问0x80地址，依然会cache缺失。这就相当于每次访问数据都要从主存中读取，所以cache的存在并没有对性能有什么提升。访问0x40地址时，就会把0x00地址缓存的数据替换。这种现象叫做cache颠簸（cache thrashing）。针对这个问题，我们引入多路组相连缓存。我们首先研究下最简单的两路组相连缓存的工作原理。

# 两路组相连缓存(Two-way set associative cache)

我们依然假设64 Bytes cache size，cache line size是8 Bytes。什么是路（way）的概念。我们将cache平均分成多份，每一份就是一路。因此，两路组相连缓存就是将cache平均分成2份，每份32 Bytes。如下图所示。

![img](https://pic1.zhimg.com/80/v2-4653656ec3d4d5942bae805df6723690_1440w.jpg)

cache被分成2路，每路包含4行cache line。我们将所有索引一样的cache line组合在一起称之为组。例如，上图中一个组有两个cache line，总共4个组。我们依然假设从地址0x0654地址读取一个字节数据。由于cache line size是8 Bytes，因此offset需要3 bits，这和之前直接映射缓存一样。不一样的地方是index，在两路组相连缓存中，index只需要2 bits，因为一路只有4行cache line。上面的例子根据index找到第2行cache line（从0开始计算），第2行对应2个cache line，分别对应way 0和way 1。因此index也可以称作set index（组索引）。先根据index找到set，然后将组内的所有cache line对应的tag取出来和地址中的tag部分对比，如果其中一个相等就意味着命中。

因此，两路组相连缓存较直接映射缓存最大的差异就是：第一个地址对应的数据可以对应2个cache line，而直接映射缓存一个地址只对应一个cache line。那么这究竟有什么好处呢？

## 两路组相连缓存优缺点

两路组相连缓存的硬件成本相对于直接映射缓存更高。因为其每次比较tag的时候需要比较多个cache line对应的tag（某些硬件可能还会做并行比较，增加比较速度，这就增加了硬件设计复杂度）。为什么我们还需要两路组相连缓存呢？因为其可以有助于降低cache颠簸可能性。那么是如何降低的呢？根据两路组相连缓存的工作方式，我们可以画出主存地址0x00-0x4f地址对应的cache分布图。

![img](https://pic4.zhimg.com/80/v2-9db10cd5b86e5a10f08980ab1d1cfc07_1440w.jpg)

我们依然考虑直接映射缓存一节的问题“如果一个程序试图依次访问地址0x00、0x40、0x80，cache中的数据会发生什么呢？”。现在0x00地址的数据可以被加载到way 1，0x40可以被加载到way 0。这样是不是就在一定程度上避免了直接映射缓存的尴尬境地呢？在两路组相连缓存的情况下，0x00和0x40地址的数据都缓存在cache中。试想一下，如果我们是4路组相连缓存，后面继续访问0x80，也可能被被缓存。

因此，当cache size一定的情况下，组相连缓存对性能的提升最差情况下也和直接映射缓存一样，在大部分情况下组相连缓存效果比直接映射缓存好。同时，其降低了cache颠簸的频率。从某种程度上来说，直接映射缓存是组相连缓存的一种特殊情况，每个组只有一个cache line而已。因此，直接映射缓存也可以称作单路组相连缓存。

# 全相连缓存(Full associative cache)

既然组相连缓存那么好，如果所有的cache line都在一个组内。岂不是性能更好。是的，这种缓存就是全相连缓存。我们依然以64 Byts大小cache为例说明。

![img](https://pic3.zhimg.com/80/v2-1e61e8d13030ed4f0b42c2d1a854ffce_1440w.jpg)

由于所有的cache line都在一个组内，因此地址中不需要set index部分。因为，只有一个组让你选择，间接来说就是你没得选。我们根据地址中的tag部分和所有的cache line对应的tag进行比较（硬件上可能并行比较也可能串行比较）。哪个tag比较相等，就意味着命中某个cache line。因此，在全相连缓存中，任意地址的数据可以缓存在任意的cache line中。所以，这可以最大程度的降低cache颠簸的频率。但是硬件成本上也是更高。

# 一个四路组相连缓存实例问题

考虑这么一个问题，32 KB大小4路组相连cache，cache line大小是32 Bytes。请思考以下2个问题：

1. 多少个组？
2. 假设地址宽度是48 bits，index、offset以及tag分别占用几个bit？

总共4路，因此每路大小是8 KB。cache line size是32 Bytes，因此一共有256组（8 KB / 32 Bytes）。由于cache line size是32 Bytes，所以offset需要5位。一共256组，所以index需要8位，剩下的就是tag部分，占用35位。这个cache可以绘制下图表示。

![img](https://pic4.zhimg.com/80/v2-ad47fa00875dcca7ea3e58b828edaeef_1440w.jpg)

# Cache分配策略(Cache allocation policy)

cache的分配策略是指我们什么情况下应该为数据分配cache line。cache分配策略分为读和写两种情况。

## 读分配(read allocation)

当CPU读数据时，发生cache缺失，这种情况下都会分配一个cache line缓存从主存读取的数据。默认情况下，cache都支持读分配。

## 写分配(write allocation)

当CPU写数据发生cache缺失时，才会考虑写分配策略。当我们不支持写分配的情况下，写指令只会更新主存数据，然后就结束了。当支持写分配的时候，我们首先从主存中加载数据到cache line中（相当于先做个读分配动作），然后会更新cache line中的数据。

# Cache更新策略(Cache update policy)

cache更新策略是指当发生cache命中时，写操作应该如何更新数据。cache更新策略分成两种：写直通和回写。

## 写直通(write through)

当CPU执行store指令并在cache命中时，我们更新cache中的数据并且更新主存中的数据。**cache和主存的数据始终保持一致**。

## 写回(write back)

当CPU执行store指令并在cache命中时，我们只更新cache中的数据。并且每个cache line中会有一个bit位记录数据是否被修改过，称之为dirty bit（翻翻前面的图片，cache line旁边有一个D就是dirty bit）。我们会将dirty bit置位。主存中的数据只会在cache line被替换或者显示的clean操作时更新。因此，主存中的数据可能是未修改的数据，而修改的数据躺在cache中。**cache和主存的数据可能不一致。**

同时思考个问题，为什么cache line大小是cache控制器和主存之间数据传输的最小单位呢？这也是因为每个cache line只有一个dirty bit。这一个dirty bit代表着整个cache line是否被修改的状态。

## 实例

假设我们有一个64 Bytes大小直接映射缓存，cache line大小是8 Bytes，采用写分配和写回机制。当CPU从地址0x2a读取一个字节，cache中的数据将会如何变化呢？假设当前cache状态如下图所示(tag旁边valid一栏的数字1代表合法。0代表非法。后面Dirty的1代表dirty，0代表没有写过数据，即非dirty)。

![img](https://pic3.zhimg.com/80/v2-ff2a4d78af3ff8d411e092a96941fd6a_1440w.jpg)

根据index找到对应的cache line，对应的tag部分valid bit是合法的，但是tag的值不相等，因此发生缺失。此时我们需要从地址0x28地址（请注意cacheline大小对齐）加载8字节数据到该cache line中。但是，我们发现当前cache line的dirty bit置位。因此，cache line里面的数据不能被简单的丢弃，由于采用写回机制，所以我们需要将cache中的数据0x11223344写到地址0x0128地址（这个地址根据tag中的值及所处的cache line行计算得到）。这个过程如下图所示。

![img](https://pic3.zhimg.com/80/v2-1630dc6c3c099fdc1b92c8f33f1eea32_1440w.jpg)

当写回操作完成，我们将主存中0x28地址开始的8个字节加载到该cache line中，并清除dirty bit。然后根据offset找到0x52返回给CPU。

# 问题解答

回到最初提到的问题。不知你是否已经明白其中的原因。我们下篇文章仔细展开该问题。

## 问题背景

先贴出建议的代码片段1：

```c
int arr[10][128];

for (i = 0; i < 10; i++)
        for (j = 0; j < 128; j++)
                arr[i][j] = 1;
```

与之对比的代码片段2：

```c
int arr[10][128];

for (i = 0; i < 128; i++)
        for (j = 0; j < 10; j++)
                arr[j][i] = 1;
```

在有了cache的基础知识后，我们就可以简单的解答这个问题了。我们假设使用的L1 cache line大小是64字节，采用写分配及写回策略。继续假设数组`arr`内存首地址是64字节对齐。

## 问题分析

在有了以上背景假设后，我们先分析下片段1导致的cache miss/hit情况。当执行`arr[0][0] = 1`时， cache控制器发现`arr[0][0]`的值不在cache中，此时发生一次cache miss。然后从主存中读取`arr[0][0]到arr[0][15]` 的内存值到cache中。当执行访问`arr[0][1] = 1` 时会发生一次cache hit。此时内存访问速度极快。接着继续往下执行，会一直cache hit。直到执行`arr[0][16] = 1`，此时会cache miss。总结来说就是访问内存每发生一次cache miss。接下来会发生15次cache hit。因此这种初始化方法**cache命中率很高**。

我们再来分析下片段2。当执行`arr[0][0] = 1`时， cache控制器发现`arr[0][0]`的值不在cache中，此时发生一次cache miss。然后从主存中读取`arr[0][0]`到`arr[0][15]` 的内存值到cache中。当执行访问`arr[1][0] = 1 `时依然发生一次cache miss。一直执行到`arr[9][0] = 1`依然是一次cache miss。现在思考下，访问`arr[0][1]`会是怎么情况呢？ 此时就需要考虑cache的大小了。如果cache大小大于数组arr大小，cache此时相当于缓存了整个arr数组的内容。那么后续访问其他元素，确实是cache hit。似乎和片段1代码分析结果差不多。但是如果cache的大小很小，例如只有数组一半大小，那么cache命中率就很明显会降低。同样的cache大小，片段1的代码依然会获得很高的cache命中率。

## 总结

在大多数情况下，片段1代码的性能比片段2好。因此我们倾向片段1代码的写法。

# Cache组织方式

我们这里一直避开了一个关键问题。我们都知道cache控制器根据地址查找缓存并判断是否命中cache，这里的地址究竟是虚拟地址(virtual address，VA)还是物理地址(physical address，PA)？可以前往下面的文章一探究竟。

但是，我们一直避开了一个关键问题。我们都知道cache控制器根据地址查找判断是否命中，这里的地址究竟是虚拟地址(virtual address，VA)还是物理地址(physical address，PA)？我们应该清楚CPU发出对某个地址的数据访问，这个地址其实是虚拟地址，虚拟地址经过MMU转换成物理地址，最终从这个物理地址读取数据。因此cache的硬件设计既可以采用虚拟地址也可以采用物理地址甚至是取两者地址部分组合作为查找cache的依据。

## 虚拟高速缓存(VIVT)

我们首先介绍的是虚拟高速缓存，这种cache硬件设计简单。在cache诞生之初，大部分的处理器都使用这种方式。虚拟高速缓存以虚拟地址作为查找对象。如下图所示。

![img](https://pic1.zhimg.com/80/v2-1a6af4b2fdf482c39f5f03e554b3a494_1440w.jpg)

虚拟地址直接送到cache控制器，如果cache hit。直接从cache中返回数据给CPU。如果cache miss，则把虚拟地址发往MMU，经过MMU转换成物理地址，根据物理地址从主存(main memory)读取数据。由于我们根据虚拟地址查找高速缓存，所以我们是用虚拟地址中部分位域作为索引(index)，找到对应的的cacheline。然后根据虚拟地址中部分位域作为标记(tag)来判断cache是否命中。因此，我们针对这种index和tag都取自虚拟地址的高速缓存称为虚拟高速缓存，简称VIVT(Virtually Indexed Virtually Tagged)。另外，我们复习下cache控制器查找数据以及判断是否命中的规则：通过index查找对应的cacheline，通过tag判断是否命中cache。 虚拟高速缓存的优点是不需要每次读取或者写入操作的时候把虚拟地址经过MMU转换为物理地址，这在一定的程度上提升了访问cache的速度，毕竟MMU转换虚拟地址需要时间。同时硬件设计也更加简单。但是，正是使用了虚拟地址作为tag，所以引入很多软件使用上的问题。 操作系统在管理高速缓存正确工作的过程中，主要会面临两个问题。歧义(ambiguity)和别名(alias)。为了保证系统的正确工作，操作系统负责避免出现歧义和别名。

### 歧义(ambiguity)

歧义是指不同的数据在cache中具有相同的tag和index。cache控制器判断是否命中cache的依据就是tag和index，因此这种情况下，cache控制器根本没办法区分不同的数据。这就产生了歧义。什么情况下发生歧义呢？我们知道不同的物理地址存储不同的数据，只要相同的虚拟地址映射不同的物理地址就会出现歧义。例如两个互不相干的进程，就可能出现相同的虚拟地址映射不同的物理地址。假设A进程虚拟地址0x4000映射物理地址0x2000。B进程虚拟地址0x4000映射物理地址0x3000。当A进程运行时，访问0x4000地址会将物理地址0x2000的数据加载到cacheline中。当A进程切换到B进程的时候，B进程访问0x4000会怎样？当然是会cache hit，此时B进程就访问了错误的数据，B进程本来想得到物理地址0x3000对应的数据，但是却由于cache hit得到了物理地址0x2000的数据。操作系统如何避免歧义的发生呢？当我们切换进程的时候，可以选择flush所有的cache。flush cache操作有两种： - 使主存储器有效。针对write back高速缓存，首先应该使主存储器有效，保证已经修改数据的cacheline写回主存储器，避免修改的数据丢失。 - 使高速缓存无效。保证切换后的进程不会错误的命中上一个进程的缓存数据。

因此，切换后的进程刚开始执行的时候，将会由于大量的cache miss导致性能损失。所以，VIVT高速缓存明显的缺点之一就是经常需要flush cache以保证歧义不会发生，最终导致性能的损失。VIVT高速缓存除了面对歧义问题外，还面临另一个问题：别名(alias)。

### 别名(alias)

当不同的虚拟地址映射相同的物理地址，而这些虚拟地址的index不同，此时就发生了别名现象(多个虚拟地址被称为别名)。通俗点来说就是指同一个物理地址的数据被加载到不同的cacheline中就会出现别名现象。 考虑这样的一个例子。虚拟地址0x2000和0x4000都映射到相同的物理地址0x8000。这意味着进程既可以从0x2000读取数据，也能从地址0x4000读取数据。假设系统使用的是直接映射VIVT高速缓存，cache更新策略采用写回机制，并且使用虚拟地址的位<15...4>作为index。那么虚拟地址0x2000和虚拟地址0x4000的index分别是0x200和0x400。这意味同一个物理地址的数据会加载到不同的cacheline。假设物理地址0x8000存储的数据是0x1234。程序先访问0x2000把数据0x1234加载到第0x200(index)行cacheline中。接着访问0x4000，会将0x1234再一次的加载到第0x400(index)行cacheline中。现在程序将0x2000地址数据修改成0x5678。由于采用的是写回策略，因此修改的数据依然躺在cacheline中。当程序访问0x4000的时候由于cache hit导致读取到旧的数据0x1234。这就造成了数据不一致现象，这不是我们想要的结果。可以选择下面的方法避免这个问题。

![img](https://pic3.zhimg.com/80/v2-c2a5303f950c195b800917f117b36f72_1440w.jpg)

针对共享数据所在页的映射方式采用nocache映射。例如上面的例子中，0x2000和0x4000映射物理地址0x8000的时候都采用nocache的方式，这样不通过cache的访问，肯定可以避免这种问题。但是这样就损失了cache带来的性能好处。这种方法既适用于不同进程共享数据，也适用于同一个进程共享数据。 如果是不同进程之间共享数据，还可以在进程切换时主动flush cache(使主存储器有效和使高速缓存无效)的方式避免别名现象。但是，如果是同一个进程共享数据该怎么办？除了nocache映射之外，还可以有另一种解决方案。这种方法只针对直接映射高速缓存，并且使用了写分配机制有效。在建立共享数据映射时，保证每次分配的虚拟地址都索引到相同的cacheline。这种方式，后面还会重点说。

## 物理高速缓存(PIPT)

基于对VIVT高速缓存的认识，我们知道VIVT高速缓存存在歧义和名别两大问题。主要问题原因是：tag取自虚拟地址导致歧义，index取自虚拟地址导致别名。所以，如果想让操作系统少操心，最简单的方法是tag和index都取自物理地址。物理的地址tag部分是独一无二的，因此肯定不会导致歧义。而针对同一个物理地址，index也是唯一的，因此加载到cache中也是唯一的cacheline，所以也不会存在别名。我们称这种cache为物理高速缓存，简称PIPT(Physically Indexed Physically Tagged)。PIPT工作原理如下图所示。

![img](https://pic4.zhimg.com/80/v2-69fb9056736bae258ecfb10246fc1d77_1440w.jpg)

CPU发出的虚拟地址经过MMU转换成物理地址，物理地址发往cache控制器查找确认是否命中cache。虽然PIPT方式在软件层面基本不需要维护，但是硬件设计上比VIVT复杂很多。因此硬件成本也更高。同时，由于虚拟地址每次都要翻译成物理地址，因此在查找性能上没有VIVT方式简洁高效，毕竟PIPT方式需要等待虚拟地址转换物理地址完成后才能去查找cache。顺便提一下，为了加快MMU翻译虚拟地址的速度，硬件上也会加入一块cache，作用是缓存虚拟地址和物理地址的映射关系，这块cache称之为TLB(Translation Lookaside Buffer)。当MMU需要转换虚拟地址时，首先从TLB中查找，如果cache hit，则直接返回物理地址。如果cache miss则需要MMU查找页表。这样就加快了虚拟地址转换物理地址的速度。如果系统采用的PIPT的cache，那么软件层面基本不需要任何的维护就可以避免歧义和别名问题。这是PIPT最大的优点。现在的CPU很多都是采用PIPT高速缓存设计。在Linux内核中，可以看到针对PIPT高速缓存的管理函数都是空函数，无需任何的管理。

## 物理标记的虚拟高速缓存(VIPT)

为了提升cache查找性能，我们不想等到虚拟地址转换物理地址完成后才能查找cache。因此，我们可以使用虚拟地址对应的index位查找cache，与此同时(硬件上同时进行)将虚拟地址发到MMU转换成物理地址。当MMU转换完成，同时cache控制器也查找完成，此时比较cacheline对应的tag和物理地址tag域，以此判断是否命中cache。我们称这种高速缓存为VIPT(Virtually Indexed Physically Tagged)。

![img](https://pic4.zhimg.com/80/v2-12969d6792ebc4b5256e1822ffde6caf_1440w.jpg)

VIPT以物理地址部分位作为tag，因此我们不会存在歧义问题。但是，采用虚拟地址作为index，所以可能依然存在别名问题。是否存在别名问题，需要考虑cache的结构，我们需要分情况考虑。

### VIPT Cache为什么不存在歧义

在这里重点介绍下为什么VIPT Cache不存在歧义。假设以32位CPU为例，页表映射最小单位是4KB。我们假设虚拟地址<12:4>位(这是一个有别名问题的VIPT Cache)作为index，于此同时将虚拟地址<31:12>发送到MMU转换得到物理地址的<31:12>，这里**我们把<31:12>作为tag，并不是<31:13>**。这地方很关键，也就是说VIPT的tag取决于物理页大小的剩余位数，而不是去掉index和offset的剩余位数。物理tag是惟一的，所以不存在歧义。

### VIPT Cache什么情况不存在别名

我们知道VIPT的优点是查找cache和MMU转换虚拟地址同时进行，所以性能上有所提升。歧义问题虽然不存在了，但是别名问题依旧可能存在，那么什么情况下别名问题不会存在呢？Linux系统中映射最小的单位是页，一页大小是4KB。那么意味着虚拟地址和其映射的物理地址的位<11...0>是一样的。针对直接映射高速缓存，如果cache的size小于等于4KB，是否就意味着无论使用虚拟地址还是物理地址的低位查找cache结果都是一样呢？是的，因为虚拟地址和物理地址对应的index是一样的。这种情况，VIPT实际上相当于PIPT，软件维护上和PIPT一样。如果示例是一个四路组相连高速缓存呢？只要满足一路的cache的大小小于等于4KB，那么也不会出现别名问题。

### VIPT Cache的别名问题

假设系统使用的是直接映射高速缓存，cache大小是8KB，cacheline大小是256字节。这种情况下的VIPT就存在别名问题。因为index来自虚拟地址位<12...8>，虚拟地址和物理地址的位<11...8>是一样的，但是bit12却不一定相等。 假设虚拟地址0x0000和虚拟地址0x1000都映射相同的物理地址0x4000。那么程序读取0x0000时，系统将会从物理地址0x4000的数据加载到第0x00行cacheline。然后程序读取0x1000数据，再次把物理地址0x4000的数据加载到第0x10行cacheline。这不，别名出现了。相同物理地址的数据被加载到不同cacheline中。

### 如何解决VIPT Cache别名问题

我们接着上面的例子说明。首先出现问题的场景是共享映射，也就是多个虚拟地址映射同一个物理地址才可能出现问题。我们需要想办法避免相同的物理地址数据加载到不同的cacheline中。如何做到呢？那我们就避免上个例子中0x1000映射0x4000的情况发生。我们可以将虚拟地址0x2000映射到物理地址0x4000，而不是用虚拟地址0x1000。0x2000对应第0x00行cacheline，这样就避免了别名现象出现。因此，在建立共享映射的时候，返回的虚拟地址都是按照cache大小对齐的地址，这样就没问题了。如果是多路组相连高速缓存的话，返回的虚拟地址必须是满足一路cache大小对齐。在Linux的实现中，就是通过这种方法解决别名问题。

## 不存在的PIVT高速缓存

按照排列组合来说，应该还存在一种PIVT方式的高速缓存。因为PIVT没有任何优点，却包含以上的所有缺点。你想想，PIVT方式首先要通过MMU转换成物理地址，然后才能根据物理地址index域查找cache。这在速度上没有任何优势，而且还存在歧义和别名问题。请忘记它吧。不，应该不算是忘记，因为它从来就没出现过。

## 总结

VIVT Cache问题太多，软件维护成本过高，是最难管理的高速缓存。所以现在基本只存在历史的文章中。现在我们基本看不到硬件还在使用这种方式的cache。现在使用的方式是PIPT或者VIPT。如果多路组相连高速缓存的一路的大小小于等于4KB，一般硬件采用VIPT方式，因为这样相当于PIPT，岂不美哉。当然，如果一路大小大于4KB，一般采用PIPT方式，也不排除VIPT方式，这就需要操作系统多操点心了。

# Note

- tag array 存储在硬件 cache 里，占用真实 cache 内存。但是我们提到 cache size 的时候，并没有考虑 tag 的占用。所以计算时，请忽略 tag 占用。



> 摘录自：[https://zhuanlan.zhihu.com/p/107096130](https://zhuanlan.zhihu.com/p/107096130)
