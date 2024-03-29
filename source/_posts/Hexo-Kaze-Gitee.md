---
title: Hexo+Kaze+Gitee Pages 搭建静态博客网站
date: 2022-08-30 17:46:10
tags: 
  - 静态博客
categories:
  - Blog
banner_img: /img/post-5.jpg
index_img: https://img.freepik.com/free-vector/nature-scene-with-river-hills-forest-mountain-landscape-flat-cartoon-style-illustration_1150-37326.jpg?w=2000
description: "Hexo 详解 "
---

# 前言

建网站本身是一个很大的工程，涉及前端页面的搭建，网站数据的存储，还要购置服务器资源，甚至是后期的维护，过程相当繁琐。

不过如果仅仅是想搭建个人的网站，写写博客，想要美观，又不想操心太多和写博客无关的事情。那么，Hexo + Kaze + Gitee Pages 的方式就很适合你。

本文就讲下如何借助这三样免费的技术或服务，来搭建一个可访问的静态博客网站。

![bda1e275b460aa88f2e023392ad910bb.png](https://img-blog.csdnimg.cn/img_convert/bda1e275b460aa88f2e023392ad910bb.png)

# Hexo 简介

## Hexo 是什么？

[Hexo](https://hexo.io/docs/)[1]  是一个快速，简单且功能强大的博客框架。如果你用 Markdown 写博客，Hexo 可以在几秒内生成带有精美主题的静态文件。

## Hexo 安装

### 前置要求

- Node.js(版本 10.13 以上，建议使用 12.0 以上版本)
- Git

### 安装 Git

- Windows：下载并安装 [git](https://git-scm.com/download/win)[2]。
- Mac：使用 [Homebrew](https://brew.sh/)[3] 安装。

- Linux(Ubuntu，Debian)：`sudo apt-get install git-core`
- Linux(Fedora，Red Hat，CentOS)：`sudo yum install git-core`

### 安装 Node.js

Node.js 为大多数平台提供了 官方安装程序[4]。

替代安装方法：

- Windows：使用 nvs[5] 安装它。
- Mac：使用 Homebrew[6] 安装。
- Linux(基于 DEB / RPM)：与 NodeSource[7] 一起安装。
- 其他：通过相应的软件包管理器进行安装。请参阅 Node.js 提供的指南[8]。

### 安装 Hexo

用 npm 安装 Hexo。

```coffeescript
npm install -g hexo-cli
```

使用以下指令查看是否安装成功。

```bash
hexo version
```

![48c8eefd10f68b12e1f587971c2f286e.png](https://img-blog.csdnimg.cn/img_convert/48c8eefd10f68b12e1f587971c2f286e.png)

如果你想卸载 Hexo，使用以下指令：

```coffeescript
npm uninstall -g hexo-cli
```

### 运行 hexo

安装后，你可以通过 `hexo `运行 Hexo。比如通过 `hexo help` 指令来获取使用帮助。

```scss
hexo help
```

![409d93031d2120880acd225e9c7dee86.png](https://img-blog.csdnimg.cn/img_convert/409d93031d2120880acd225e9c7dee86.png)



帮助里提到 `hexo init` 命令可以创建一个新的 Hexo 文件夹，这个文件夹其实就是利用 Hexo 生成的站点信息了。接下来讲下怎么建站。

# Hexo 建站

## 初始化操作

使用 `hexo init `指令就可以在指定文件夹下建立站点信息，我一般用域名做名称，如下：

```swift
hexo init java4u.cn
```

站点初始化中：

![e8a6ba2002283d33f15b4d2af55da634.png](https://img-blog.csdnimg.cn/img_convert/e8a6ba2002283d33f15b4d2af55da634.png)



站点初始化完成，会生成指定的文件夹：

![064fb5da16e15506ac9e8d0168b1d353.png](https://img-blog.csdnimg.cn/img_convert/064fb5da16e15506ac9e8d0168b1d353.png)



## 目录结构

进入该站点，我们看下目录结构，如下：

![bbc758343f8b9e4061728b39705bdcac.png](https://img-blog.csdnimg.cn/img_convert/bbc758343f8b9e4061728b39705bdcac.png)



这些文件有着各自的职责：

- _config.landscape.yml：自定义的主题配置文件，此处的 landscape 是默认主题。配置其他主题可以参考这种方式。
- _config.yml：站点全局的配置文件。

- node_modules：node 模块文件夹。包含可执行文件和依赖的资源。
- package-lock.json：node_modules 文件中所有模块的版本信息，模块来源。

- package.json：Hexo 框架的基本参数信息以及它所依赖的插件。
- scaffolds：scaffolds 原意是脚手架，这里可以理解为模板文件夹。当你创建新的文章时，Hexo 会根据该文件夹下的对应文件进行初始化构建。

- source：资源文件夹。这里是你放自己资源比如博文和图片的地方。`_posts` 文件夹下的 Markdown 和 HTML 文件会被解析并放到 `public` 文件夹下。其他文件或文件夹，如果开头命名不是 `_` (下划线)，也都会被拷贝过去。
- themes：主题文件夹。Hexo 会根据主题来生成静态页面。

基于这样的结构，Hexo 就具备了生成静态网站的能力。

## 本地启动

我们先本地启动，看下实际效果。输入以下命令：

```vbscript
hexo server
```


![5cc75a44459f5436ea15ca69fb36cda7.png](https://img-blog.csdnimg.cn/img_convert/5cc75a44459f5436ea15ca69fb36cda7.png)



Hexo 会启动服务，将默认生成的网站运行在本机的 4000 端口上，可以直接访问 `http://localhost:4000` 就能看到网站首页，它基于默认主题生成，同时有一篇默认文章。

![b0415eba97e110e9c3700fa52a78ed6a.png](https://img-blog.csdnimg.cn/img_convert/b0415eba97e110e9c3700fa52a78ed6a.png)



这个页面只是官方提供的一个样例，看到它就意味着你本地环境跑通了。我们可以通过修改配置的方式，对页面相关元素做调整。

## 核心配置

以下是我们需要了解或者修改的配置信息。

### package.json

这个文件列出了 Hexo 的基本参数信息以及它所依赖的插件。可以看到，EJS[9]，Stylus[10] 和 Markdown[11] 渲染器都是默认安装的

```javascript
{ "name": "hexo-site",  
  "version": "0.0.0",  
    "private": true,  
      "scripts": {    
        "build": "hexo generate",    
          "clean": "hexo clean",    
            "deploy": "hexo deploy",    
              "server": "hexo server"  
      },  
        "hexo": {    
          "version": ""  
        },  
          "dependencies": {    
            "hexo": "^5.0.0",    
              "hexo-generator-archive": "^1.0.0",    
                "hexo-generator-category": "^1.0.0",    
                  "hexo-generator-index": "^2.0.0",    
                    "hexo-generator-tag": "^1.0.0",    
                      "hexo-renderer-ejs": "^1.0.0",    
                        "hexo-renderer-marked": "^3.0.0",    
                          "hexo-renderer-stylus": "^2.0.0",    
                            "hexo-server": "^2.0.0",    
                              "hexo-theme-landscape": "^0.0.3"  
          }
}
```

> 如果后边要切换主题，记得把最后一个默认的主题依赖删除掉。

### _config.yml

可设置网站、网址、目录、文章、分类&标签、日期/时间格式、分页和扩展等信息。

### 网站

![a9d712d8e2fc006a9b0aacb7bae0bd84.png](https://img-blog.csdnimg.cn/img_convert/a9d712d8e2fc006a9b0aacb7bae0bd84.png)

| 参数          | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| `title`       | 网站标题                                                     |
| `subtitle`    | 网站副标题                                                   |
| `description` | 网站描述，用于 SEO                                           |
| `keywords`    | 网站的关键词，支持多个关键词。                               |
| `author`      | 文章作者。                                                   |
| `language`    | 网站使用的语言。对于简体中文用户来说，使用不同的主题可能需要设置成不同的值，请参考你的主题的文档自行设置，常见的有 `zh-Hans`和 `zh-CN`。 |
| `timezone`    | 网站时区。Hexo 默认使用你电脑的时区。请参考 时区列表[12] 进行设置，如 `America/New_York`, `Japan`, 和 `UTC` 。一般的，对于中国大陆地区可以使用 `Asia/Shanghai`。 |

### URL

![7914f5f7af790c204a057011036eed1e.png](https://img-blog.csdnimg.cn/img_convert/7914f5f7af790c204a057011036eed1e.png)

| 参数                         | 描述                                                         | 默认值                      |
| :--------------------------- | :----------------------------------------------------------- | :-------------------------- |
| `url`                        | 网址, must starts with `http://` or `https://`               | http://example.com          |
| `root`                       | 网站根目录，如果放子目录，设置 `/blog/`                      | /                           |
| `permalink`                  | 文章的 永久链接[13] 格式                                     | `:year/:month/:day/:title/` |
| `permalink_defaults`         | 永久链接中各部分的默认值                                     |                             |
| `pretty_urls`                | 改写 `permalink`[14] 的值来美化 URL                          |                             |
| `pretty_urls.trailing_index` | 是否在永久链接中保留尾部的 `index.html`，设置为 `false` 时去除 | `true`                      |
| `pretty_urls.trailing_html`  | 是否在永久链接中保留尾部的 `.html`, 设置为 `false` 时去除 (*对尾部的 `index.html`无效*) | `true`                      |

### 目录

![b05165191376b2ae89c859ff3489cd78.png](https://img-blog.csdnimg.cn/img_convert/b05165191376b2ae89c859ff3489cd78.png)

| 参数           | 描述                                                         | 默认值           |
| :------------- | :----------------------------------------------------------- | :--------------- |
| `source_dir`   | 资源文件夹，这个文件夹用来存放内容。                         | `source`         |
| `public_dir`   | 公共文件夹，这个文件夹用于存放生成的站点文件。               | `public`         |
| `tag_dir`      | 标签文件夹                                                   | `tags`           |
| `archive_dir`  | 归档文件夹                                                   | `archives`       |
| `category_dir` | 分类文件夹                                                   | `categories`     |
| `code_dir`     | Include code 文件夹，`source_dir` 下的子目录                 | `downloads/code` |
| `i18n_dir`     | 国际化(i18n)文件夹                                           | `:lang`          |
| `skip_render`  | 跳过指定文件的渲染。匹配到的文件将会被不做改动地复制到 `public` 目录中。 |                  |

### 文章

![3940f054b0c964bb6892093281a28676.png](https://img-blog.csdnimg.cn/img_convert/3940f054b0c964bb6892093281a28676.png)

| 参数                    | 描述                                                       | 默认值    |
| :---------------------- | :--------------------------------------------------------- | :-------- |
| `new_post_name`         | 新文章的文件名称                                           | :title.md |
| `default_layout`        | 预设布局                                                   | post      |
| `auto_spacing`          | 在中文和英文之间加入空格                                   | false     |
| `titlecase`             | 把标题转换为 title case                                    | fals      |
| `external_link`         | 在新标签中打开链接                                         | true      |
| `external_link.enable`  | 在新标签中打开链接                                         | `true`    |
| `external_link.field`   | 对整个网站(`site`)生效或仅对文章(`post`)生效               | `site`    |
| `external_link.exclude` | 需要排除的域名。主域名和子域名如 `www` 需分别配置          | `[]`      |
| `filename_case`         | 把文件名称转换为 (1) 小写或 (2) 大写                       | 0         |
| `render_drafts`         | 显示草稿                                                   | false     |
| `post_asset_folder`     | 启动 Asset 文件夹[15]                                      | false     |
| `relative_link`         | 把链接改为与根目录的相对地址，建议使用绝对地址。           | false     |
| `future`                | 显示未来的文章                                             | true      |
| `highlight`             | 代码块的设置, see Highlight.js[16] section for usage guide |           |
| `prismjs`               | 代码块的设置, see PrismJS[17] section for usage guide      |           |

### 分类 & 标签

![ca4f2e0662a5e17d9a584fd3aeb757e7.png](https://img-blog.csdnimg.cn/img_convert/ca4f2e0662a5e17d9a584fd3aeb757e7.png)

| 参数               | 描述     | 默认值          |
| :----------------- | :------- | :-------------- |
| `default_category` | 默认分类 | `uncategorized` |
| `category_map`     | 分类别名 |                 |
| `tag_map`          | 标签别名 |                 |

### 日期/时间格式

![a83d703d3dc42389934650c2c5347927.png](https://img-blog.csdnimg.cn/img_convert/a83d703d3dc42389934650c2c5347927.png)

Hexo 使用 Moment.js[18] 来解析和显示时间。

| 参数             | 描述                                                         | 默认值       |
| :--------------- | :----------------------------------------------------------- | :----------- |
| `date_format`    | 日期格式                                                     | `YYYY-MM-DD` |
| `time_format`    | 时间格式                                                     | `HH:mm:ss`   |
| `updated_option` | 当 Front Matter 中没有指定 `updated`[19] 时 `updated` 的取值，支持 mtime(文件最后修改时间)，date(使用 date 的值)，empty(不指定) | `mtime`      |

### 分页

![4275a4ad9a21feb4e345997cb84f2792.png](https://img-blog.csdnimg.cn/img_convert/4275a4ad9a21feb4e345997cb84f2792.png)

| 参数             | 描述                                | 默认值 |
| :--------------- | :---------------------------------- | :----- |
| `per_page`       | 每页显示的文章量 (0 = 关闭分页功能) | `10`   |
| `pagination_dir` | 分页目录                            | `page` |

### 扩展

![4bbeef3cc97c063aa50269e818cc028c.png](https://img-blog.csdnimg.cn/img_convert/4bbeef3cc97c063aa50269e818cc028c.png)

【主题】

| 参数             | 描述                                                         | 默认值     |
| :--------------- | :----------------------------------------------------------- | :--------- |
| `theme`          | 当前主题名称。值为`false`时禁用主题                          | landscape  |
| `theme_config`   | 主题的配置文件。在这里放置的配置会覆盖主题目录下的 `_config.yml` 中的配置 | 无初始配置 |
| `deploy`         | 部署部分的设置                                               |            |
| `meta_generator` | Meta generator[20] 标签。值为 `false` 时 Hexo 不会在头部插入该标签 | true       |

【部署】

配置如下：

```yaml
deploy:  
	type: git  
	repo:  #https://bitbucket.org/JohnSmith/johnsmith.bitbucket.io  branch: [branch]  message: [message]
```

| 参数      | 描述                                                         | 默认                                                         |
| :-------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `repo`    | 库(Repository)地址                                           |                                                              |
| `branch`  | 分支名称                                                     | `gh-pages` (GitHub) `coding-pages` (Coding.net) `master` (others) |
| `message` | 自定义提交信息                                               | `Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}`)            |
| `token`   | Optional token value to authenticate with the repo. Prefix with `$` to read token from environment variable |                                                              |

# 常用指令

## 创建文章

使用以下指令：

```typescript
hexo new "test"
```

或者简写：

```erlang
hexo n "test"
```

![40c0e78ae8caca227ea62e99a609fa01.png](https://img-blog.csdnimg.cn/img_convert/40c0e78ae8caca227ea62e99a609fa01.png)



## 运行服务器

输入以下命令以启动服务器，你的网站会在 `http://localhost:4000` 下启动。在服务器启动期间，Hexo 会监视文件变动并自动更新，你无须重启服务器。

```vbscript
hexo server
```

或者简写：

```undefined
hexo s
```

![4698666cba614faddb6add08eab32b6c.png](https://img-blog.csdnimg.cn/img_convert/4698666cba614faddb6add08eab32b6c.png)

## 生成静态文件

```undefined
hexo generate
```

或者简写

```undefined
hexo g
```

监视文件变动立即重新生成。该操作会阻塞命令。

```scss
hexo g --watch
```

生成完毕后自动部署网站。

```scss
hexo generate --deploy
```

## 部署

Hexo 提供了快速方便的一键部署功能，让你只需一条命令就能将网站部署到服务器上。

```undefined
hexo deploy
```

或者简写为：

```undefined
hexo d
```

# Hexo 主题

## 为什么选择 Kaze

Hexo 默认主题为 landscape，但我觉得不够美观，这里推荐 **kaze[21]** ,它有以下特性：

- 响应式设计，适配桌面端、平板、手机等各种设备
- 前端性能优化，加载快速，眨眼之间即可加载完成
  - 图片懒加载，应用懒加载技术加快页面的生成速度
  - 资源压缩，提升本地资源请求速度
  - 精简设计，不包含 Jquery 等额外库

- 支持侧边栏小组件，例如最近文章，作者卡片
- 暗黑模式，享受黑夜的魅力
- 代码高亮，支持 **prismjs**
- 公式渲染，支持 **katex** 和 **mathjax**
- 评论系统，集成 **valine**、**gitalk** 和 **livere**
- 访问量统计和谷歌分析支持

## 安装 Kaze

在 `your site/themes` 下输入

```bash
cd themesgit clone https://github.com/theme-kaze/hexo-theme-Kaze.git
```

![0d703fe586809b6b76702b6856440efe.png](https://img-blog.csdnimg.cn/img_convert/0d703fe586809b6b76702b6856440efe.png)



安装成功后，会生出目录：hexo-theme-Kaze。

修改站点配置文件 `_config.yml` 下的主题值为：hexo-theme-Kaze。

![8b590c918ef1233e0e4d061f6fe95555.png](https://img-blog.csdnimg.cn/img_convert/8b590c918ef1233e0e4d061f6fe95555.png)



用 `hexo server` 启动 Hexo 服务看下效果。


![492f95d43eeb6d7d66bf4c98d1e1ee48.png](https://img-blog.csdnimg.cn/img_convert/492f95d43eeb6d7d66bf4c98d1e1ee48.png)



会看到已经生成了默认的主题，只是很多东西都没有，需要改造一下。

## 主题配置

可在该主题目录下的 **_config.yml** 文件里配置。

```yaml
color:  
	text-color: "#3c4858"  
	text-strong-color: "#2f3d4e"  
	text-light-color: "#909faf"  
	divider-color: "#e6e8ee"  
	title-color: "#475b6d"  
	link-color: "#3273dc"  
	link-hover-color: "#6596e5"  
	info-text-color: "#909faf"  
	widget-background-color: "#fff"  
	body-background-color: "#f2f5f8"  
	border-color: "#e1e4e9"  
	pre-color: "#2d2d2d"  
	code-color: "#50687c"  
	code-background-color: "#e9eaf0"
```

## 字号与字体

在 **font** 中进行配置，以下是默认值。

```yaml
font:  
	font-size: 16px # global font-size  
	font-family: '-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue","PingFang SC","Microsoft YaHei",sans-serif' # global font-family
```

## 站点访问量统计

访问量统计目前仅支持不蒜子，默认关闭，可统计站点总访问量和总访客数。

```yaml
footer:  #------------------------  # pv / uv statistics config  #------------------------  
statistics:    
	enable: false    
	type: busuanzi # now version only supports busuanzi    
	pv:     
  	enable: true      
  	style: 本站总访问量{}次 # the style will be shown as $1{pv}$2    
  uv:      
  	enable: true      
  	style: 本站总访客数{}次 # the style will be shown as $1{uv}$2
```

## 数据分析

```bash
analytics:  enable: false  type: google # google  google:    id:
```

`enable` 开启分析支持(默认关闭)

type 目前仅支持 google

`google.id` 有关谷歌分析的具体使用说明和 `id` 使用可以参考谷歌文档[22]

## 首页

### 文章头图

在文章 `Front-matter` 中 `banner_img` 可以设置首页头图

### 小组件

```vbnet
widgets:  showWidgetsMobiles: "none"
```

`showWidgetsMobiles` : 在窄屏幕上是否显示小组件，`none` 关闭(默认)，`flex` 开启

## 关于

关于页面需要自行创建，在站点 `source` 中新建 `about` 文件夹并在文件夹内创建 `index.md`，该文件至少需要包含

```crystal
# at ${yoursite}/about/index.md---title: 关于layout: about---
```

### 社交链接

在 about 下的 `social_links`中进行配置，主题图标依赖于 iconfont[23]，Hexo 内置了一部分社交图标，你可以自定义其他 icon 文件或者解决方案来添加自定义图标。

```yaml
about:  
	description: description  
	social_links:    - { icon: icon-github, link:  https://xxx}    # - { icon: icon, link: your link }
```

![2e658deb369ea09af6d548e81e0bfaf7.png](https://img-blog.csdnimg.cn/img_convert/2e658deb369ea09af6d548e81e0bfaf7.png)



### 友链

友链格式按如下填写即可生成友链页面

```yaml
links:  example-name-1:    
	url: https://example.com    
	avatar: https://example.com/avatar.jpg  
example-name-2:    
	url: https://example.com    
	avatar: https://example.com/avatar.jpg
```

## 文章页

### 搜索功能

```sql
search:  enable: true  path: search.json  field: posts  searchContent: true
```

- `enable` 开启搜索功能(默认开启)
- `path` 文件名称(暂无用处)

- `field` 需要搜索的范围，支持 posts | pages | all
- `searchContent` 搜索文件是否包含正文内容(不建议开启，包含所有文章内容这样会使得搜索文件异常巨大)替代方案是搜索分类标签或使用 algolia 等第三方搜索服务(Todo)

### 目录

主题目录通过 Hexo 原生函数生成，具体可参见 文档[24]

```vbnet
toc:  showListNumber: false  maxDepth: 6  minDepth: 1
```

`showListNumber` 是否生成编号

`maxDepth` TOC 最大深度

`minDepth` TOC 最小深度

### 代码高亮

参见代码 高亮文档[25]

### 数学公式

主题支持 `mathjax` 和 `katex` 两种渲染引擎，具体参见 相关文档[26]

## copyright

```yaml
copyright:  
	enable: true  
	writer: # if writer is empty we will use config.author as writer  
	declare: 本博客所有文章除特别声明外，均采用"_blank" rel="noopener" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh">CC BY-NC-SA 4.0 协议。转载请注明出处！  
	style: warning
```

`enable` 开起版权说明(默认开启)

`writer` 作者id，如果不填则会使用主题配置 author 或站点配置 author

`declare` 版权声明具体内容，支持 html 语句

`style` 声明内容样式，与 note 样式相同

版权内容有三部分：作者、文章链接、版权声明

作者使用 writer 参数，文章链接基于站点配置文件中`url`参数生成，版权声明使用 declare 参数

## Front-matter

### banner_img

设置文章与首页头图

### banner_img_set

在图片加载时预先加载的图片，可以设置为 loading 图或缩略图等

### excerpt

为文章设置在首页显示的简介，还可以通过 ``来控制显示

## 评论

支持 `valine`，`gitalk` 和 `livere`

具体设置可参考主题配置文档说明和相关评论插件文档

## 字数统计

主题集成 hexo-wordcount[27] 插件，在主题配置文件中设置

```bash
wordcount:  enable: true
```

开启(默认开启)

## 图片画廊

图片画廊功能基于 fslightbox[28]，在主题配置文件中设置

```bash
fslightbox:  enable: true
```

开启(默认开启)

## 标签插件

主题集成了一些标签方便书写

### note

在 `markdown` 文件中如下书写即可

```crystal
{% note style %}...markdown content{% endnote %}
```

有五种样式可以选择，`primary`，`success`，`info`，`warning`，`danger`

![5c542237bd770348639042e52cf53839.png](https://img-blog.csdnimg.cn/img_convert/5c542237bd770348639042e52cf53839.png)

## 备案信息

你可以在主题配置文件内增加备案信息。

```yaml
footer:  #------------------------  # 备案配置  # 请将公安备案的缩略图置于 ${yoursite}/img/beian.png  
RecordInfo: "" # '某ICP备xxx号'  
govRecordInfo: "" # '某公网安备xxx号'  
govRecordUrl: "" # 公网安备案信息地址  #------------------------
```

# 站点托管

## 为什么选择 Gitee Pages

GitHub 和 Gitee 都提供免费的静态网页托管服务。我们可以使用 GitHub Pages 或 Gitee Pages 托管博客、项目官网等静态网页，这样就省去了购买服务器的钱，也不需要耗费太多精力维护。

GitHub Pages 使用很广泛，我之前也用过，不过访问不够稳定，会影响页面加载速度。Gitee 是国内版的 GitHub，访问速度优秀，并且国内发展势头不错，因此我选取 Gitee Pages 来托管我的网站。

## 建立仓库

申请一个 Gitee 账号，创建一个新的仓库，仓库名尽量和账号名一致，这样可以避免一些因为路径引发的问题。

![9595394417228d86e93a5ce6fde5de4a.png](https://img-blog.csdnimg.cn/img_convert/9595394417228d86e93a5ce6fde5de4a.png)



然后在仓库首页服务一栏开启 Gitee Pages 服务。

![59923d4821997bb12cc44c9dbb35f7a9.png](https://img-blog.csdnimg.cn/img_convert/59923d4821997bb12cc44c9dbb35f7a9.png)



开启后，你就拥有了专属的二级域名网址。

**注意：仓库内容有变化，需要手动触发更新，页面才能真正生效。**

## 连接仓库

一、安装 hexo-deployer-git [29]。

```scss
npm install hexo-deployer-git --save
```

![095c6e30d4719302062e52b459861c97.png](https://img-blog.csdnimg.cn/img_convert/095c6e30d4719302062e52b459861c97.png)

二、修改配置。

```scala
deploy:  type: git  repo: git@gitee.com:java4u/java4u.git
```

注意上面的 repo 地址并不是仓库的地址，而是你下载/克隆项目时弹出的那个地址，type 如果是 git 就选择 SSH。

![c7c88f74cb218d639bd6c27adf10fb87.png](https://img-blog.csdnimg.cn/img_convert/c7c88f74cb218d639bd6c27adf10fb87.png)

三、生成/添加 SSH 公钥

Gitee 、GitHub 提供了基于 SSH 协议的 Git 服务，在使用 SSH 协议访问仓库仓库之前，需要先配置好账户/仓库的 SSH 公钥。

先看下自己有没有配置过用户名和邮箱：

```scss
git config --global user.namegit config --global user.email
```

![30e3abe4b021a3af90c7d30f51467e3f.png](https://img-blog.csdnimg.cn/img_convert/30e3abe4b021a3af90c7d30f51467e3f.png)



如果没有就做下配置：

```scss
# 设置邮箱git config --global user.email *********@qq.com# 设置用户名git config --global user.name '****'
```

然后本地生成 SSH 公钥，邮箱为刚配置好的账户：

```crystal
ssh-keygen -t rsa -C yong__1994@163.com
```

生成后可查看 SSH 公钥：

```typescript
cat ~/.ssh/id_rsa.pub
```

复制公钥去 Gitee 粘贴，添加。

![69c118d18ad50558168a02ee80270d11.png](https://img-blog.csdnimg.cn/img_convert/69c118d18ad50558168a02ee80270d11.png)



测试是否连接成功：

```crystal
ssh -T git@gitee.com
```

![cd3be0a2772429c5fe9c5ff075fbbdc4.png](https://img-blog.csdnimg.cn/img_convert/cd3be0a2772429c5fe9c5ff075fbbdc4.png)

## 上传仓库

执行部署命令，即可将本地资源上传远程仓库。

```undefined
hexo d
```

![5c29ed57feeaad818b12bbe6bc221735.png](https://img-blog.csdnimg.cn/img_convert/5c29ed57feeaad818b12bbe6bc221735.png)



## 手动更新

远程仓库虽然可以看到提交记录，但静态网站不会感知到实时变更，需要去 Gitee Pages 服务页面做下更新。

![391409895d9185cec0e434eb74fd67f7.png](https://img-blog.csdnimg.cn/img_convert/391409895d9185cec0e434eb74fd67f7.png)



稍等片刻，访问 https://java4u.gitee.io/ 即可看到 Hexo 结合 kaze 主题搭建的静态网站。点击文章底部「阅读原文」也可以直接访问。

![40914673c79669ba07d17b49c4626c89.png](https://img-blog.csdnimg.cn/img_convert/40914673c79669ba07d17b49c4626c89.png)



# **参考资料**

[1]Hexo: https://hexo.io/docs/

[2]git: https://git-scm.com/download/win

[3]Homebrew: https://brew.sh/

[4]官方安装程序: https://nodejs.org/en/download/

[5]nvs: https://github.com/jasongin/nvs/

[6]Homebrew: https://brew.sh/

[7]NodeSource: https://github.com/nodesource/distributions

[8]指南: https://nodejs.org/en/download/package-manager/

[9]EJS: https://ejs.co/

[10]Stylus: http://learnboost.github.io/stylus/

[11]Markdown: http://daringfireball.net/projects/markdown/

[12]时区列表: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

[13]永久链接: https://hexo.io/zh-cn/docs/permalinks

[14]permalink: https://hexo.io/zh-cn/docs/variables

[15]Asset 文件夹: https://hexo.io/zh-cn/docs/asset-folders

[16]Highlight.js: https://hexo.io/docs/syntax-highlight#Highlight-js

[17]PrismJS: https://hexo.io/docs/syntax-highlight#PrismJS

[18]Moment.js: http://momentjs.com/

[19]updated: https://hexo.io/zh-cn/docs/variables#页面变量

[20]Meta generator: https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#属性

[21]kaze: https://demo.theme-kaze.top/

[22]谷歌文档: https://analytics.google.com/

[23]iconfont: https://www.iconfont.cn/

[24]文档: https://hexo.io/docs/helpers#toc

[25]高亮文档: https://demo.theme-kaze.top/highlight/

[26]相关文档: https://demo.theme-kaze.top/latex/

[27]hexo-wordcount: https://github.com/willin/hexo-wordcount

[28]fslightbox: https://fslightbox.com/

[29]hexo-deployer-git: https://github.com/hexojs/hexo-deployer-git
