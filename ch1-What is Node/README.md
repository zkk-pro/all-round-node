## ❓什么是Node

Node.js是一个开源跨平台的运行环境，用来在浏览器外执行JavaScript代码，我们常用Node来创建后端程序（我们更常说API，也就是application Programming Interface），这些是用来支撑客户端的服务，比如网络应用，它们在浏览器中运行，或者手机应用，它们在手机中运行。

Node是创建高可拓展性(Highly-scalable)、数据密集型(data-intensive)和实时(real-time)的后端服务.

**🔔这么多后端语言，为什么选择Node？**

- 容易上手，可以很好的适应原型和敏捷的开发工作
- 支持开发超快速和高拓展的服务（使用 Node 的公司：Paypal、优步、沃尔玛等）
- 使用的JavaScript语言，可复用你的知识
- 前后端使用JavaScript，代码将更简洁明了，可以使用相同的命名规范、工具、和最佳实践
- 拥有强大的生态和众多开源库

## Node 的安装📚
Node 的开发环境是非常容易搭建的，首先打开`https://nodejs.org/en/download` Node 的下载页面，会看到有LTS（长期支持版本）和（Curren）最新版本，建议安装LTS版本。如果想安装该版本的其他子版本，在下面有一个`All download options` 链接，点击选择可以看到该版本的所有子版本；如果想安装其他版本的 Node，点击下面有的 `Previous Releases`，点击可以看到 Node 所有历史发布版本。

- Windows 系统下安装 Node

  选择 `.msi`选项和对应的系统位数下载，下载完成打开后，就是一个界面安装向导，一直下一步安装就可以了，最后打开命令行，输入`node -v`，即可验证安装结果和查看当前安装的 Node 版本。

- Mac 系统下安装 Node

  Mac 系统下的安装和 Windows 大径相同，但是下载是`.pkg`选项文件，下载打开后，也是跟着安装向导一直下一步即可。最后打开终端，输入`node -v`，即可验证安装结果和查看当前安装的 Node 版本。

- Linux 系统下安装 Node

  对于Linux系统下，Linux下安装方式比较多，官方推荐的是通过源代码安装，所以，在这里我们使用源码安装的方式：

  1. 首先进入到你需要存储文件的目录，我这里选择`/home`目录
    ```
    cd /home
    ```

  2. 使用 curl 下载 Node 源码
    ```javascript
    curl -O https://nodejs.org/dist/v10.15.3/node-v10.15.3.tar.gz

    // v10.15.3 版本
    // node-v10.15.3.tar.gz 文件名
    ```

  3. 解压压缩文件，然后进入解压后的目录
    ```javascript
    // 解压
    tar zxvf node-v10.15.3.tar.gz
    // 进入目录
    cd node-v10.15.3
    ```

  4. 配置、编译和安装
    ```javascript
    // 配置
    sudo ./configure
    // 编译
    make
    // 安装
    sudo make install
    ```

  5. 最后一步，检测安装和检测版本

    ```javascript
    node -v
    ```

**总结**

Windowns 和 Mac 安装是相对简单的，没有太多技术性操作，Linux下安装可能会出现各种问题，当遇到问题没有按上面的流程走下来时，可以参考这篇文章看看有没有解决的问题：`https://www.cnblogs.com/randomsteps/p/5904879.html`


