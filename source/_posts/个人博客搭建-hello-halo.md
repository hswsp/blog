---
title: 个人博客搭建
date: 2022-03-06 01:10:50.357
updated: 2022-03-07 11:47:14.282
url: /archives/hello-halo
categories: 
  - Blog
tags: 
  - 动态博客
index_img: https://blog.halosecurity.com/content/images/size/w720/2022/06/introducing-halo-security.png
banner_img: https://blog.halosecurity.com/content/images/size/w720/2022/06/introducing-halo-security.png
---

# 博客选择

本博客使用一款现代化的开源博客/CMS系统 [Halo](https://halo.run) 进行创作。

# 使用 Docker 部署 Halo

Halo 在 Docker Hub 上发布的镜像为 [halohub/halo](https://hub.docker.com/r/halohub/halo)

1. 创建[工作目录](https://docs.halo.run/getting-started/prepare#工作目录)

```bash
mkdir ~/.halo && cd ~/.halo
```

2. 下载示例配置文件到[工作目录](https://docs.halo.run/getting-started/prepare#工作目录)

```bash
wget https://dl.halo.run/config/application-template.yaml -O ./application.yaml
```

3. 编辑配置文件，配置数据库或者端口等，如需配置请参考[参考配置](https://docs.halo.run/getting-started/config)。这里使用默认配置

```bash
vim application.yaml
```

```yaml
erver:
  port: 8090

  # Response data gzip.
  compression:
    enabled: false
spring:
  datasource:

    # H2 database configuration.
    driver-class-name: org.h2.Driver
    url: jdbc:h2:file:~/.halo/db/halo
    username: admin
    password: 123456

    # MySQL database configuration.
#    driver-class-name: com.mysql.cj.jdbc.Driver
#    url: jdbc:mysql://127.0.0.1:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
#    username: root
#    password: 123456

  # H2 database console configuration.
  h2:
    console:
      settings:
        web-allow-others: false
      path: /h2-console
      enabled: false

halo:

  # Your admin client path is https://your-domain/{admin-path}
  admin-path: admin
  
  # memory or level
  cache: memory
```

4. 拉取最新的 Halo 镜像

```bash
docker pull halohub/halo:latest
```

5. 创建容器

```bash
docker run -it -d --name halo -p 8090:8090 -v ~/.halo:/root/.halo --restart=unless-stopped halohub/halo:latest
```

- **-it：** 开启输入功能并连接伪终端
- **-d：** 后台运行容器
- **--name：** 为容器指定一个名称
- **-p：** 端口映射，格式为 `主机(宿主)端口:容器端口` ，可在 `application.yaml` 配置。
- **-v：** 工作目录映射。形式为：-v 宿主机路径:`/root/.halo`，后者不能修改。
- **--restart：** 建议设置为 `unless-stopped`，在 Docker 启动的时候自动启动 Halo 容器。

6. 打开 `http://ip:端口号` 即可看到安装引导界面。

> TIP
>
>如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。
>
>如果通过 http://ip:端口号 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。

# 反向代理

这里使用了Nginx作为反向代理。

## 修改apache2服务端口号

本人使用的阿里云作为服务器主机。在配置Nginx时候有个问题，就是默认的情况，会有apache2占用80端口，导致nginx无法完成代理。

1.由于apache2占用的80端口的ipv6，不知道什么原因无法通过`kiil -9 PID`杀掉apache进程；

2.尝试过卸载apache2，无效。。

解决办法：

1) 首先关闭apache2，`sudo service apache2 stop`；
2) 然后马上启动nginx反向代理。

也可以不停止原先的apache2进程，在ubuntu修改apache端口号

### 第一步

`sudo vi /etc/apache2/ports.conf` 修改监听端口以及主机端口为8080

```bash
NameVirtualHost *:8080
Listen 8080
```

### 第二步

`sudo vi /etc/apache2/sites-available/default` 只要修改virtualHost的端口即可：

```bash
<VirtualHost *:8080>
```

### 第三步

重启apache2

```bash
sudo service apache2 stop
sudo service apache2 start
```

或者

```bash
sudo service apache2 restart
```

## 切换默认sh为bash

 这里使用OneinStack 管理Nginx，但是OneinStack安装脚本使用的是bash，Ubuntu默认采用的是 dash，所以要先切换。

### 查看与使用

------

先用命令`ls -l /bin/sh`看看

> /bin/sh -> dash

```bash
lrwxrwxrwx 1 root root 4 Jul 17 22:49 /bin/sh -> dash
```

我们会发现Ubuntu默认采用的是 dash

### 切换sh为bash

------

如果要修改默认的sh，可以采用命令

> sudo dpkg-reconfigure dash

![选择 NO](http://cdn.spphoto.top/img/dedd7b161aae0864b7e3e945d83bbb50.png)

然后选择**否**

```bash
$ sudo dpkg-reconfigure dash
Removing 'diversion of /bin/sh to /bin/sh.distrib by dash'
Adding 'diversion of /bin/sh to /bin/sh.distrib by bash'
Removing 'diversion of /usr/share/man/man1/sh.1.gz to /usr/share/man/man1/sh.distrib.1.gz by dash'
Adding 'diversion of /usr/share/man/man1/sh.1.gz to /usr/share/man/man1/sh.distrib.1.gz by bash'
```

成功后再执行

> ll /bin/sh

结果是： `/bin/sh -> bash`

```bash
$ ls -al /bin/sh
lrwxrwxrwx 1 root root 4 Aug 16 23:00 /bin/sh -> bash
```

修改成功！

### 切换sh为dash

------

当然我们也可以使用

> sudo dpkg-reconfigure dash

把sh修改回去

### 链接

------

[Dash与Bash的语法区别](http://www.2cto.com/os/201305/210033.html)

## 安装Nginx

点击下方链接进入 OneinStack 官网，仅选择 `安装 Nginx`，其他的都可以取消选择。

https://oneinstack.com/auto

最后点击 `复制安装命令` 到服务器执行即可。如果你仅安装 Nginx，你的链接应该是这样：

```bash
wget -c http://mirrors.linuxeye.com/oneinstack-full.tar.gz && tar xzf oneinstack-full.tar.gz && ./oneinstack/install.sh --nginx_option 1
```

> INFO
>
> 这一步会经过编译安装，可能会导致安装时间很漫长，这主要取决于你服务器的性能。

出现下面的信息即代表安装成功：

```bash
Nginx installed successfully!
Created symlink from /etc/systemd/system/multi-user.target.wants/nginx.service to /usr/lib/systemd/system/nginx.service.
Redirecting to /bin/systemctl start nginx.service
####################Congratulations########################
Total OneinStack Install Time: 5 minutes

Nginx install dir:              /usr/local/nginx
```

## 创建 vhost

> 即创建一个站点，你可以通过这样的方式在你的服务器创建无限个站点。

> 接下来的目的就是创建一个站点，并反向代理到 Halo。这一步在此教程使用 `demo.halo.run` 这个域名做演示，实际情况请修改此域名。

1. 进入到 oneinstack 目录，执行 vhost 创建命令

```bash
cd oneinstack
```

```bash
sh vhost.sh
```

2. 按照提示选择或输入相关信息

```bash
What Are You Doing?
    1. Use HTTP Only
    2. Use your own SSL Certificate and Key
    3. Use Let's Encrypt to Create SSL Certificate and Key
    q. Exit
Please input the correct option:
```

这一步是选择证书配置方式，如果你有自己的证书，输入 2 即可。如果需要使用 `Let's Encrypt` 申请证书，选择 3 即可。

```bash
Please input domain(example: www.example.com):
```

输入自己的域名即可，前提是已经提前解析好了域名。

```bash
Please input the directory for the domain:demo.halo.run :
(Default directory: /data/wwwroot/demo.halo.run):
```

没有事先准备好域名的话，直接填入主机ip地址。

提示输入站点根目录，因为我们是使用 Nginx 的反向代理，所以这个目录是没有必要配置的，我们直接使用默认的即可（直接回车）。

```bash
Do you want to add more domain name? [y/n]:
```

是否需要添加其他域名，按照需要选择即可，如果不需要，输入 n 并回车确认。

```bash
Do you want to add hotlink protection? [y/n]:
```

是否需要做防盗链处理，按照需要选择即可。

```bash
Allow Rewrite rule? [y/n]:
```

路径重写配置，我们不需要，选择 n 回车确定即可。

```bash
Allow Nginx/Tengine/OpenResty access_log? [y/n]:
```

Nginx 的请求日志，建议选择 y。

这样就完成了 vhost 站点的创建，最终会输出站点的相关信息：

```bash
Your domain:                  demo.halo.run
Virtualhost conf:             /usr/local/nginx/conf/vhost/demo.halo.run.conf
Directory of:                 /data/wwwroot/demo.halo.run
```

Nginx 的配置文件即 `/usr/local/nginx/conf/vhost/demo.halo.run.conf`。


## 修改 Nginx 配置文件

上方创建 vhost 的过程并没有创建反向代理的配置，所以需要我们自己修改一下配置文件。

1. 使用你熟悉的工具打开配置文件，此教程使用 vim。

```bash
vim /usr/local/nginx/conf/vhost/demo.halo.run.conf
```

2. 删除一些不必要的配置

```nginx
location ~ [^/]\.php(/|$) {
  #fastcgi_pass remote_php_ip:9000;
  fastcgi_pass unix:/dev/shm/php-cgi.sock;
  fastcgi_index index.php;
  include fastcgi.conf;
}
```

此段配置是针对 php 应用的，所以可以删掉。

3. 添加 `upstream` 配置

在 `server` 的同级节点添加如下配置：

```nginx
upstream halo {
  server 127.0.0.1:8090;
}
```

**可能出现的错误：**

nginx集群报错“upstream”directive is not allow here 错误

是upstream backend 位置放错了, upstream位置应该放在http模块里面 但必须是在server模块的外面. 应该是下面这样的结构:

```yaml
http{
	upstream backend { 
		server backend1.example.com weight=5; 
		server backend2.example.com:8080; 
		server unix:/tmp/backend3;
	} 
	server { 
		location / { 
			proxy_pass http://backend; 
		}
	}
}
```

4. 在 `server` 节点添加如下配置

```nginx
location / {
  proxy_set_header HOST $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_pass http://halo;
}
```

5. 修改 `location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$` 节点

```nginx
location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$ {
  proxy_pass http://halo;
  expires 30d;
  access_log off;
}
```

6. 修改 `location ~ .*\.(js|css)?$` 节点

```nginx
location ~ .*\.(js|css)?$ {
  proxy_pass http://halo;
  expires 7d;
  access_log off;
}
```

如果不按照第 5，6 步操作，请求一些图片或者样式文件不会经过 Halo，所以请不要忽略此配置。

7. 添加 acme.sh 续签验证路由

OneinStack 使用的 acme.sh 管理证书，如果你在创建 vhost 的时候选择了使用 `Let's Encrypt` 申请证书，那么 OneinStack 会在系统内添加一个定时任务去自动续签证书，acme.sh 默认验证站点所有权的方式为在站点根目录生成一个文件（.well-known）来做验证，由于配置了反向代理，所以在验证的时候是无法直接访问到站点目录下的 .well-known 文件夹下的验证文件的。需要添加如下配置：

```nginx
location ^~ /.well-known/acme-challenge/ {
  default_type "text/plain";
  allow all;
  root /data/wwwroot/demo.halo.run/;
}
```

至此，配置修改完毕，保存即可。最终你的配置文件可能如下面配置一样：

```nginx
upstream halo {
  server 127.0.0.1:8090;
}
server {
  listen 80;
  listen [::]:80;
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  ssl_certificate /usr/local/nginx/conf/ssl/demo.halo.run.crt;
  ssl_certificate_key /usr/local/nginx/conf/ssl/demo.halo.run.key;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
  ssl_ciphers TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256:TLS13-AES-128-CCM-SHA256:EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
  ssl_prefer_server_ciphers on;
  ssl_session_timeout 10m;
  ssl_session_cache builtin:1000 shared:SSL:10m;
  ssl_buffer_size 1400;
  add_header Strict-Transport-Security max-age=15768000;
  ssl_stapling on;
  ssl_stapling_verify on;
  server_name demo.halo.run;
  access_log /data/wwwlogs/demo.halo.run_nginx.log combined;
  index index.html index.htm index.php;
  root /data/wwwroot/demo.halo.run;
  if ($ssl_protocol = "") { return 301 https://$host$request_uri; }
  include /usr/local/nginx/conf/rewrite/none.conf;
  #error_page 404 /404.html;
  #error_page 502 /502.html;
  location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$ {
    proxy_pass http://halo;
    expires 30d;
    access_log off;
  }
  location ~ .*\.(js|css)?$ {
    proxy_pass http://halo;
    expires 7d;
    access_log off;
  }
  location ~ /(\.user\.ini|\.ht|\.git|\.svn|\.project|LICENSE|README\.md) {
    deny all;
  }
  location / {
    proxy_set_header HOST $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://halo;
  }
  location ^~ /.well-known/acme-challenge/ {
    default_type "text/plain";
    allow all;
    root /data/wwwroot/demo.halo.run/;
  }
}
```

## 重载 Nginx 使配置生效

验证 nginx 配置

```bash
nginx -t
```

如果输出如下提示则代表配置有效：

```bash
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

重载 Nginx 配置：

```bash
nginx -s reload
```

至此，整个教程完毕，现在你可以访问域名检查是否已经配置成功。

# 相关链接

- 官网：[https://halo.run](https://halo.run)
- 文档：[https://docs.halo.run](https://docs.halo.run)
- 社区：[https://bbs.halo.run](https://bbs.halo.run)
- 主题仓库：[https://halo.run/themes.html](https://halo.run/themes.html)
- 开源地址：[https://github.com/halo-dev/halo](https://github.com/halo-dev/halo)





