# 2、WinForm教务系统-创建项目

你好，我是丑萌气质狗，下面咱们就正式开始创建项目。

## 项目创建步骤

1、打开 `VS 2022` ，点击 `创建项目`

![点击创建项目](/images/face846e988ae27430c13b45c7b6573b.png)

2、在右侧项目模板中，找到 `Windows 窗体应用(.NET Framework) `，点击 `下一步`

![选择项目模板](/images/aa137b5f3b062236f76ed99af198219a.png)

3、依次编辑 `项目名称` 、 `项目保存位置` 、 `解决方案名称` 、 `框架版本` ，然后点击 `创建`

- 项目名称：**MaAnShanTeachersCollege**

- 项目保存位置：**D:\\WinForm\\**

- 解决方案名称：**MaAnShanProjects**

- 框架：**.NET Framework 4.7.2**

![配置项目信息](/images/654b92e3ec85ea4e388385609b9250b8.png)

创建完成之后， VS 会自动打开我们的项目，咱们就可以正式开始进行界面的设计和功能的添加了。

## 提醒事项

在这里需要注意的就是，当我们创建好一个项目的时候，第一步就是点击 `运行` 按钮，确保我们的项目能够正常启动并跑起来。

![运行项目](/images/b091ecf2096881c4839f340451931f71.png)

因为现在是最初始状态，有任何的编译错误，导致项目无法启动。我们都可以以最小的代价去尝试修复错误，甚至是重新创建项目。

## 项目启动逻辑

创建项目就是在创建对应的文件模板，下面是咱们这个项目的文件目录结构。

- D:\WinForm
  - MaAnShanProjects
    - MaAnShanTeachersCollege
      - bin
        - ...
        - ...
        ...
      - obj
        - ...
        - ...
        ...
      - Properties
        - ...
        - ...
        ...
      - App.config
      - Form1.cs
      - Form1.Designer.cs
      - MaAnShanTeachersCollege.csproj
      - Program.cs
    - MaAnShanProjects.sln

点击 `启动` 按钮，就是 `VS` 帮我们编译项目代码，然后将编译后的程序给拉起来。

当前项目文件夹名称（**MaAnShanTeachersCollege**），默认的编译生成文件目录为：**MaAnShanTeachersCollege\\bin\\Debug** 。

**至于是 `bin\\Debug` 还是 `bin\\Release` 目录，取决你 `启动` 按钮旁边的选择是 `Debug` 还是 `Release` 。 不同的选项，会导致编译的优化设置不一样，一般我们打包给别人使用的时候，就会选择 `Release`**

可以看到我们编译之后生成到文件信息。

- bin\Debug
  - MaAnShanTeachersCollege.exe
  - MaAnShanTeachersCollege.exe.config
  - MaAnShanTeachersCollege.pdb

这里的 `MaAnShanTeachersCollege.exe` 就是我们编译之后生成的可执行应用程序，我们直接双击它就可以打开我们的程序界面了。

![项目启动效果](/images/8ba6980b473274ed6ee6f680c7416d28.png)

此项目中并未引入其它第三方代码，所以这个 `exe` 文件就是我们的最终程序，咱们可以称它为**程序免安装版本**，发给别人就是直接能用的（**前提是别人安装了.NET Framework 4.7.2**）

如果引用了一些第三方的代码，那么可能需要把整个 `Debug` 目录拷贝出来才行，也就是说引用的环境不能丢。

当然了，如果你希望打包成一个安装包给别人，那自然也是可以的。后续我们也会介绍一些打包工具。

其实就是将 `Debug or Release` 这个文件夹里面的所有文件，打包成一个安装文件，到时候别人在进行安装的时候，再把安装文件里面的所有文件，解压到别人选择的安装目录中。

**注：编译出来的程序是否是exe，取决于我们的编译选项，默认的WPF项目模板已经给设置好了。（下方有图，仅仅针对.NET Framework）**

可以用记事本打开文件 `MaAnShanTeachersCollege.csproj` ，内部有多个默认生成的编译参数设置，可以看到我们的输出类型 **（OutputType）** 为 `WinExe` 。

![MaAnShanTeachersCollege.csproj 文件参数展示](/images/0a3102c6f23320b08e548077428266cf.png)

参数比较多，看起来也没啥意思，相信你也不是很想知道每个参数代表什么意思，如果你真的有兴趣，欢迎随时去搜一下！