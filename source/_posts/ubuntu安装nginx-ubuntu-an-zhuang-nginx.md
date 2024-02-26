---
title: ubuntu安装nginx
date: 2022-03-07 00:15:29.028
updated: 2022-03-07 00:43:09.68
url: /archives/ubuntu-an-zhuang-nginx
categories: 
  - Infrastructure
tags: 
 - 网络设施
index_img: https://www.lukas-petereit.com/wp-content/uploads/2017/10/Rakotzbr%C3%BCcke-Bridge-Rakotz-Kromlau-Lake-Sun-Sunrise-Landscape-Reflection-Germany-Saxony-Travel-Photography-Nature-Photo-Spreewald-2.jpg
banner_img: https://www.lukas-petereit.com/wp-content/uploads/2017/10/Rakotzbr%C3%BCcke-Bridge-Rakotz-Kromlau-Lake-Sun-Sunrise-Landscape-Reflection-Germany-Saxony-Travel-Photography-Nature-Photo-Spreewald-2.jpg
---

# apt-get安装nginx

1. 切换至root用户

```
sudo su root
apt-get install nginx
```

2. 查看nginx是否安装成功

```
nginx -v
```


3. 启动nginx

```
service nginx start
```

启动后，在网页重输入ip地址，即可看到nginx的欢迎页面。至此nginx安装成功

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031203230618.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIzODMyMzEz,size_16,color_FFFFFF,t_70)


nginx文件安装完成之后的文件位置：

`/usr/sbin/nginx`：主程序
`/etc/nginx`：存放配置文件
`/usr/share/nginx`：存放静态文件
`/var/log/nginx`：存放日志

# 下载nginx包安装

由于上面已经安装了nginx，所以我们先卸载nginx。再重新上传nginx包，解压下载。有输入提示时，输入Y即可

1. 卸载apt-get安装的nginx

```
# 彻底卸载nginx
apt-get --purge autoremove nginx
```

2. 查看nginx的版本号
```
nginx -v
```


![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031203843950.png)


3. 安装依赖包

```bash
apt-get install gcc
apt-get install libpcre3 libpcre3-dev
apt-get install zlib1g zlib1g-dev
```

Ubuntu14.04的仓库中没有发现openssl-dev，由下面openssl和libssl-dev替代

```bash
#apt-get install openssl openssl-dev
sudo apt-get install openssl 
sudo apt-get install libssl-dev
```

4. 安装nginx

```bash
cd /usr/local
mkdir nginx
cd nginx
wget http://nginx.org/download/nginx-1.13.7.tar.gz
tar -xvf nginx-1.13.7.tar.gz 
```


![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031205721673.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIzODMyMzEz,size_16,color_FFFFFF,t_70)

5. 编译nginx

```bash
# 进入nginx目录

/usr/local/nginx/nginx-1.13.7

# 执行命令

./configure

# 执行make命令

make

# 执行make install命令

make install
```

6. 启动nginx

```bash
#进入nginx启动目录
cd /usr/local/nginx/sbin

# 启动nginx

./nginx
```


![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031210133487.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIzODMyMzEz,size_16,color_FFFFFF,t_70)

7. 访问nginx

网页输入ip地址，访问成功，到此，nginx安装完毕

![在这里插入图片描述](https://img-blog.csdnimg.cn/2018103121025275.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIzODMyMzEz,size_16,color_FFFFFF,t_70)

# 使用 OneinStack安装

参考下面命令，一步步自定义安装。

```bash
yum -y install wget screen #for CentOS/Redhat
# apt-get -y install wget screen #for Debian/Ubuntu
wget http://mirrors.linuxeye.com/oneinstack-full.tar.gz #包含源码，国内外均可下载
tar xzf oneinstack-full.tar.gz
cd oneinstack #如果需要修改目录(安装、数据存储、Nginx日志)，请修改options.conf文件
screen -S oneinstack #如果网路出现中断，可以执行命令`screen -R oneinstack`重新连接安装窗口
./install.sh
```

![img](https://static.oneinstack.com/images/install.png)

## 如何添加附加组件？

> 注意
>
> 如果之前没有安装组件，后续补充安装，统一入口为`./install.sh`，addons.sh脚本不在提供，如之前没有安装php redis扩展，补充安装命令：`./install.sh --php_extensions redis`

```bash
~/oneinstack/addons.sh
```

![img](https://static.oneinstack.com/images/addons.png)

## 如何添加虚拟主机?

```bash
~/oneinstack/vhost.sh
```

![img](https://static.oneinstack.com/images/vhost.png)

## 启动Nginx

```
service nginx start
```

## 重载 Nginx 使配置生效

验证 nginx 配置

```
nginx -t
```

如果输出如下提示则代表配置有效：
```
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

重载 Nginx 配置：

```
nginx -s reload
```

重启Nginx
```
service nginx restart
```

**可能遇到的问题：**

nginx使用`service nginx restart`报错

启动nginx服务时如果遇到这个错误 `Job for nginx.service failed because the control process exited with error code. See "systemctl status nginx.service" and "journalctl -xe" for details`.

可能原因:

1、配置文件语法有误，`执行nginx -t`

**查看输出提示信息 并检查端口是否被占用`netstat -tnlp`**

2、nginx的配置文件nginx.conf中监听了其他端口，这些端口的子进程仍然运行，导致端口占用。需要首先关闭子进程，才能使用该命令。

此时可以`kill -9 pid` 。

![img](https://img-blog.csdnimg.cn/20210425123334652.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NlZV9feW91X19hZ2Fpbg==,size_16,color_FFFFFF,t_70)

# Linux环境Nginx命令

| **Linux环境Nginx命令**                         | **功能**         |
| ---------------------------------------------- | ---------------- |
| sudo nginx -t                                  | 查看配置文件语法 |
| sudo nginx -c /usr/local/nginx/conf/nginx.conf | 指定配置文件启动 |
| sudo nginx -s stop                             | 强制停止nginx    |
| sudo nginx -s reload                           | 重新加载配置文件 |
| sudo systemctl(或者service) start nginx        | 启动nginx        |
| sudo systemctl(或者service) enable nginx       | 开机自启动       |
| sudo systemctl(service) restart nginx          | 重启nginx        |


> 参考：[oneinstack安装步骤](https://oneinstack.com/install/)

