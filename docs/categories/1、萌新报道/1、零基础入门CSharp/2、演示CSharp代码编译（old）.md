# 演示C#代码编译

前面我们说过，经过层层包装，我们终于可以用很简短的代码，来和计算机进行交流实现一些简单的功能。

那么接下来，我将为你演示，如何创建一段 `C#代码` ，并且使用 `C#的编译器` ，来将他转换成一个 `Windows` 平台下的 **可执行应用程序** 。

**此部分仅仅作为演示，大家看一下即可，不必跟着操作，是因为你目前还没有C#的编译器。（安装完我们的开发工具VS2022，可以跟着本节一起动手试试）**

`每个语言都有自己的编译器，甚至还不止一款。`

`可以说一款编程语言的特性、语法几乎都是编译器去决定的，因为它们才是那个翻译官，帮我们跟计算机打交道，它翻译的怎么样，以及支持哪些翻译这至关重要！`


## 操作说明

下面操作是按照 `Windows10` 操作系统来的，其主要目的就是为了创建一个 **文本文件** ，并且写上一些代码，保存即可！（需要修改文件后缀名为`.cs` ，文本文件的后缀名是 `.txt` ，这里后缀名是 `.txt` 也可以进行 `编译` 操作，只是表明一下这是一个 `C#` 的代码文件，大家以后看到 `.cs` 结尾的就知道这是一个 `C#` 的代码文件）


## 书写C#代码

首先我们在桌面 **右键** -> **新建** -> **文本文档**，给这个新建的文件取一个名字，叫做 `FirstCsharpCode.cs` ，这里要注意，我们修改的是 **文件后缀名** ,如果你不知道这是什么，或者不知道如何查看 **文件后缀名** ，可以尝试在下方图片中参考修改。

![20230512102847](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230512102847.png)

`打开此电脑，点击查看 -> 勾选 -> 文件扩展名。`

创建好的文件如下图:

![20230512104602](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230512104602.png)

可能你的图标跟我的不一样，是那种空白图标，或者记事本的什么图标，那是因为我已经安装了开发工具 `Visual Studio 2022` ， `.cs` 文件的图标被修改掉了，不过这并不影响我们接下来的演示。

![20230512105110](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230512105110.png)

`这种情况是因为 Windows 没有见过这个文件，不知道以何种方式去打开它。`


紧接着我们就需要打开这个文件，**选中文件** -> **右键** -> **打开方式** -> **更多应用** -> **找到记事本** -> **点击确定**

`其实就是用记事本的方式打开这个文件而已`

然后我们将下面贴出的代码，复制进去， 保存即可！

``` Csharp
using System;

namespace MySpace
{
	internal class Program
	{
		static void Main(string[] args)
		{
			Console.WriteLine("这是我的第一个程序");
			Console.ReadKey();
		}
	}
}
```

## 编译代码

现在代码已经写好了，我们只需要调用 `编译器` `编译` 一下代码就行了,下面我将演示 `编译器` 的使用。

`这里你是不会有编译器的，还是老情况，你没安装 Visual Studio 2022。`

默认的编译器路径在 `C:\Program Files\Microsoft Visual Studio\2022\Professional\Msbuild\Current\Bin\Roslyn` 这个文件夹下，有一个 `csc.exe` 这个程序， 这就是我们的 `C#编译器` 

`补充一个知识点，.exe结尾的文件是 Windows 下的可执行应用程序，一般我们双击该文件就能运行程序了，不过有意外，有些程序没有独立的界面，或者需要一些参数，咱们可以通过 cmd 窗口来运行他们。`

![20230512112401](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230512112401.png)

现在有了 `编译器` 我们可以运行它，并且 `编译` 我们的代码了！

可是这里有一个问题就是，这个 `编译器` 程序并不能直接双击运行， 需要我们在 `cmd` 窗口中去运行它。

## CMD窗口运行csc.exe

我们可以直接在地址栏输入 `cmd` ，就会启动 `cmd` 命令窗口，并且自动定位到当前目录。

![20230512141452](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230512141452.png)

![20230512141654](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230512141654.png)

现在我们要输入命令启动 `编译器` 并传入对应的参数，目前这里不做过多的 `编译` 设置。

首先启动 `编译器` 需要输入 **可执行程序** 的名称，这里就是 `csc` ，然后输入我们需要编译的文件路径和文件名，文件名是我们自己命名的，叫 `FirstCsharpCode.cs`，我们在桌面创建的，所以文件的完整路径就是 `C:\Users\LIFEI\Desktop\FirstCsharpCode.cs` ，接下来是我们 `编译` 后的文件输出路径，我们需要把这段代码变成一个可执行的应用程序，并且输出到桌面上，所以路径就直接是桌面路径再加上输出的文件名称，输出的文件名称跟之前创建的文件名称一样，随便我们怎么叫，我们这里就叫 `FirstCsharpCode.exe` ，不过输出需要加一个标识符号 `/out:` ，那么完整的输出内容就是 `/out:C:\Users\LIFEI\Desktop\FirstCsharpCode.cs` 。

这么下来，我们需要在 `cmd` ，里面输入的内容就是：`csc C:\Users\LIFEI\Desktop\FirstCsharpCode.cs /out:C:\Users\LIFEI\Desktop\FirstCsharpCode.exe` ，输入完成之后敲击回车。

`三段内容之间需用 空格 间隔。`

执行之后如果有错误会提示错误，没错误就像现在这样，代表编译成功了：

![20230512143407](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230512143407.png)

此时你会看到桌面多出来一个文件，就是我们 `编译` 后的输出文件 `FirstCsharpCode.exe` 。

![20230512143615](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230512143615.png)

咱们双击运行这个程序，可以看到程序弹出一个黑框，里面输出了 `这是我的第一个程序` 这样的文字！

![20230512143755](https://blog-image-group.oss-cn-shanghai.aliyuncs.com/BlogImages/20230512143755.png)

此时咱们的演示就算是结束了！

可以看到，我们创建了 **文本文件** ，写了 **代码** ，调用了 **编译器** ， 最后生成了一个完整的 **程序** 。 

可以说是非常完美了。

不过呢目前我们还不知道写的代码是什么意思，本节也仅仅是作为演示的！后面我们再来依次给与说明！
