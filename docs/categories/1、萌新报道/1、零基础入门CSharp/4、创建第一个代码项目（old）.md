# 创建第一个C#代码项目

目前咱们的开发工具已经具备了， 下面就开始愉快的写代码吧！

之前的演示如果你还记得，咱们手动创建了一个 `代码文件` ，然后编写代码，巴拉巴拉。。。

现在呢，完全不需要这么麻烦了，可以通过 `VS 2022` 来帮助创建代码，不过呢，在 `VS 2022` 中，创建的叫做 **项目** ，需要选择 **项目模板** ，然后创建对应的 **项目** ，这是什么意思呢。一起来看看呗。


## 创建第一个Console程序

在这里做一个简单的说明 `Console` 程序是一个只有黑框框的程序，之前演示的就是一个 `Console` 程序。

直接开始创建。

![20230519093736](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519093736.png)

打开我们的 `VS 2022` ，注意是 `Visual Studio 2022` ，不是 `Visual Studio Install` ，后者之前已经介绍过了，就是用来管理 `VS版本` 以及 `修改VS组件` 。

![20230519094054](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519094054.png)

可以看到界面左边是 `打开最近使用的内容(R)` 说的很详细了，就是操作过的内容，都会在左边作为一个历史记录，供你快速访问的。

![20230519094600](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519094600.png)

我们点击右边的 `创建新项目(N)` 即可。

![20230519094850](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519094850.png)

来到 `创建项目` 的界面，又是左右结构，右边就是 `项目模板` ，左边是创建过的 `项目模板` ，也是历史操作记录，供你快捷操作的。

![20230519095057](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519095057.png)

这里语言选择 `C#` ，然后翻到下面找到 `控制台应用（.NET Framework）` 这个项目模板。

![20230519095305](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519095305.png)

**而不是选择 `控制台应用` 这个模板** 。

这两个区别就是使用的 `.NET平台` 不一致，关于 `.NET平台` 的说明，我们后续来简单聊一下，不过这里为了保持操作步骤的一致，还是需要你选择推荐的 **项目模板** 。

选择好 `控制台应用（.NET Framework）` 后，点击 `下一步` 。

![20230519102917](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519102917.png)

现在我们需要给我们的项目取一个名字，并且指定创建的这个项目要放在哪个文件夹下。

名字随意取，我这里叫 `FirstCode` ，路径选择 `D:\Csharp\` ，可通过右边的 `...` 按钮进行路径选择 。

下面其实还有一个名称，叫做 **解决方案名称** 这个名称会随着 **项目名称** 一同变动，但是你也可以单独对它进行更改。

![20230519103120](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519103120.png)

为了更好的说明，这里将 **解决方案名称** 改为 `AllCsharpCode` 。

最后要设置的就是 **框架** ，这就是 `.NET平台` 的版本选择，选择什么版本都可以，越靠下，表示版本越新，目前 `.NET Framework平台` 最新版本永远停留在了 `.NET Framework 4.8` 。

![20230519103432](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519103432.png)

我这里就选择了 `.NET Framework 4.8` 然后点击 `创建`，你选择其他版本不影响后续的教学内容。

![20230519103617](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519103617.png)

看到这个界面项目就算是创建完成了！

撒花。。。


## 项目文件结构介绍

首先要搞清楚的就是创建的 **项目** 到底是什么？

其实 **项目** 就是 **文件模板** ，在创建的时候，不是选择了一个保存路径 `D:\Csharp\` 么！现在就去一探究竟。

![20230519104045](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519104045.png)

来到 `D:\Csharp\` 目录下，可以看到一个这里多出了一个 `AllCsharpCode` 文件夹。

![20230519104219](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519104219.png)

然后进到 `AllCsharpCode` 文件夹中可以看到 `FirstCode` 文件夹和 `AllCsharpCode.sln` 文件。

![20230519104759](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519104759.png)

继续深入到 `FirstCode` 文件夹，又能看到一些文件，后面就不继续深入了。

这里不知道你有没有眼熟一个文件，那就是 `Program.cs` ，这就是代码文件，如果你用记事本打开它。

![20230519105107](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519105107.png)

可以看到它与我们 `VS 2022` 中展示的是一样的内容，所以 `VS 2022` 编辑的就是这个代码文件。

上面的这些说明，咱们可以列个文件结构出来

```
AllCsharpCode
    ├─AllCsharpCode.sln
    │  
    └─FirstCode
        ├─App.config
        ├─FirstCode.csproj
        ├─Program.cs
        │  
        ├─bin
        │  └─Debug
        ├─obj
        │  └─Debug
        │      │  .NETFramework,Version=v4.8.AssemblyAttributes.cs
        │      │  DesignTimeResolveAssemblyReferencesInput.cache
        │      │  FirstCode.csproj.AssemblyReference.cache
        │      │  
        │      └─TempPE
        └─Properties
                AssemblyInfo.cs
```

这是我们新建一个 **项目** 时所生成的目录结构,可能看着挺复杂，随着你的使用，这些目录里面还会有一些其他文件被添加进来，但它们都是用来协助 `VS 2022` 管理代码以及存放一些编译参数的文件，或者编译过程中产生的文件。

如果此时你回到 `VS 2022` 里面就会觉得文件清晰了很多。

![20230519145217](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519145217.png)

我们暂且只需要关心 `Program.cs` 代码文件即可，很多设置选项，暂时都还用不到，或者说，已经有了默认值，暂时没有特殊需求，还无需更改这些默认值。

主要做以下几点说明

1、创建 **项目** 就是创建 **文件模板**

2、解决方案名称与项目名称，分别对应了文件夹的名称

3、 `.sln` 文件是 `VS 2022` 的解决方案文件，它里面存储了一些信息来帮助 `VS 2022` 寻找对应的项目，双击它也可以打开我们的项目

4、一个解决方案可以有多个项目，对应到文件夹中就是 `FirstCode` 项目一个文件夹， `SecondCode` 项目另外一个文件夹,但是他们都在 `AllCsharpCode` 这个文件夹的下方，并且同级（目前我们只有一个项目，暂时可以不用理会）

5、还有一个文件也可以打开我们的项目代码，就是 `FirstCode` 文件夹下的 `FirstCode.csproj` 文件，这个就是当前这个项目的管理文件，双击也可以打开的项目（二者展示有什么区别，可以自己试试看）

## 写上代码并运行

下面需要你跟着操作一下，把两句简单的代码 `复制到VS 2022` 里面，如果你的代码没有打开，或者不小心点到其他地方去了，看不到代码内容，你可以双击右侧 `Program.cs` 。

**如果右侧展示解决方案、项目的窗口都不见了，那你很悲催，咱们考虑到这个问题了，指导你一下（其他窗口不见了，也可参照）**

![20230519150827](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519150827.png)

左上角 `视图` -> `解决方案管理器` ，就可以打开我们的解决方案窗口了，这里还有一些其他视图窗口。

``` Csharp
Console.WriteLine("这是我的第一句代码");
Console.ReadKey();
```

![20230519151159](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519151159.png)

注意代码复制的位置，一定要在 `{` `}`的范围内。

![20230519151344](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519151344.png)

如果你有兴趣手敲的话，还可以看到敲字符之后，是会有 **代码提示** 的，点击提示内容会直接被应用。

但是还是那句话，注意代码的 **位置** 以及每句代码最后的 **分号** 。

完成两句代码的书写之后，就可以运行代码了。

![20230519153720](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519153720.png)

![20230519151820](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230519151820.png)

点击上方 **绿色三角形** 的 `启动` ，应该可以看到一个黑色的框框，里面有一段文字输出。

这标志着你开发了自己第一个 `C#` 的代码程序。

欢呼。。。

如果不可以，我要放大招了，列出所有的代码，全部复制即可。

``` Csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FirstCode
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("这是我的第一句代码");
            Console.ReadKey();
        }
    }
}
```

如果一切都不正常，还烦请重新创建一个新的项目，再来试试看！

再不行，记得联系我哦！
