---
giscus: 302f9276-0d67-47ef-a2ff-4d774f14653a
---

# 2、[WPF入门]WPF优缺点

## WPF与WinForm

你好，我是丑萌气质狗。

`WPF` 和 `WinForm` 它们都是 `C#的UI框架` ，并且只能在 `Windows` 上使用。

虽然都是 `UI框架` ，但是两者之间还是有着不少区别的，下面分别从几个方面来简述下二者之间的差异。

### 1. **技术基础**

* **WinForm（2002年随 .NET Framework1.0一起发布）**

  * 图形 **API** 采用 **GDI+** 渲染，是对 `Windows API` 的一种封装（类似于MFC）。
  * 本质上是对传统 **Windows** 窗体控件的托管包装，依赖 **Windows** 操作系统的窗口控件。
  * 界面效果老旧，自定义界面效果难度大。

* **WPF（2006年随 .NET Framework3.0一起发布）**

  * 图形 **API** 采用 **DirectX** 渲染，更加现代化的图形处理能力，具备更强的图形性能（2D/3D 渲染），支持硬件加速渲染。
  * 界面元素完全由 WPF 自己绘制，不依赖系统控件。
  * 支持现代化的界面效果（动画、透明、矢量图形等），实现炫酷效果难度低。

### 2. **界面描述**

* **WinForm**

  * Visual Studio提供设计器界面，支持界面控件的拖拽，设计界面方便快捷。
  * 由 **C#** 统一描述界面UI和业务逻辑，导致界面UI和逻辑混杂在 `.cs` 文件中，界面和业务耦合度高。
  * 界面样式修改受限，复杂的外观需要大量自绘。、
  * 动画系统支持羸弱

* **WPF**

  * 虽然 Visual Studio 也提供界面设计器，但是不适合拖拽控件，使用 **XAML** 语言描述界面（类XML标记语言）。
  * 天然支持 **MVVM 模式**（数据绑定、命令、依赖属性）,界面UI和逻辑分离度高，适合大规模应用开发与维护。
  * 界面样式修改方便，可轻松重定义所有控件外观。
  * 方便制作各种界面动画效果

### 3. **性能与兼容性**

* **WinForm**

  * 启动快，学习成本较低，简单应用性能更好（空界面内存占用4M不到）。
  * 依赖 Windows 原生控件，界面风格偏传统。
  * 在高分辨率屏幕、DPI 缩放下表现不佳。

* **WPF**

  * 启动速度可能稍慢，学习成本较高（空界面内存占用20M不到）。
  * 基于 **DirectX** ，复杂的界面、动画、图形处理性能更优。
  * 支持 DPI 自适应，更适合高分屏。

### 4. **生态与未来**

* **WinForm**

  * 成熟稳定，学习曲线低，适合中小型工具和快速开发的项目，但属于较旧的技术栈，功能扩展受限。

* **WPF**

  * 更现代、更灵活，适合中大型应用，适合需要现代 UI 和长期维护的应用。

## 圆角按钮示例（WPF Vs WinForm）

下面这部分，将简单展示二者分别实现圆角按钮的文件结构和代码方式。

此部分仅作为展示，无需跟练。

### WPF实现圆角效果

效果图：

![WPF-圆角按钮](/images/0ac196da3155d579290e6a7e29103316.png)

实现代码：

给 `Button` 标签写上一个 `Template` ，然后设置一些属性即可完成

``` XML
<Button
    x:Name="button"
    Width="472"
    Height="200"
    Margin="25,58,0,0"
    HorizontalAlignment="Left"
    VerticalAlignment="Top"
    Background="#0078d4"
    BorderThickness="0"
    Content="按钮"
    FontSize="40"
    Foreground="White">
    <Button.Template>
        <ControlTemplate TargetType="{x:Type Button}">
            <Border
                Background="{TemplateBinding Background}"
                BorderBrush="Black"
                BorderThickness="1"
                CornerRadius="10">
                <ContentPresenter
                    HorizontalAlignment="Center"
                    VerticalAlignment="Center" />
            </Border>
        </ControlTemplate>
    </Button.Template>
</Button>
```

### WinForm实现圆角效果

效果图：

![WinForm-圆角按钮](/images/e0146349113b821736825bde69cc35d6.png)

实现代码：

创建了一个 `MyButton` 的类型，然后继承自 `Button` 类型，然后添加了一些属性，重写了一些代码。

<details>
  <summary>点击展开代码</summary>
  
``` CSharp
	public enum ControlState { Hover, Normal, Pressed }

	public class MyButton : Button
	{

		private int radius;//半径 
						   //private Color _borderColor = Color.FromArgb(51, 161, 224);//边框颜色
		private Color _hoverColor = Color.FromArgb(220, 80, 80);//基颜色
		private Color _normalColor = Color.FromArgb(51, 161, 224);//基颜色
		private Color _pressedColor = Color.FromArgb(251, 161, 0);//基颜色

		private ContentAlignment _textAlign = ContentAlignment.MiddleCenter;

		public override ContentAlignment TextAlign
		{
			set
			{
				_textAlign = value;
				this.Invalidate();
			}
			get
			{
				return _textAlign;
			}
		}

		/// <summary>
		/// 圆角按钮的半径属性
		/// </summary>
		[CategoryAttribute("Layout"), BrowsableAttribute(true), ReadOnlyAttribute(false)]
		public int Radius
		{
			set
			{
				radius = value;
				// 使控件的整个画面无效并重绘控件
				this.Invalidate();
			}
			get
			{
				return radius;
			}
		}
		[CategoryAttribute("Appearance"), DefaultValue(typeof(Color), "51, 161, 224")]
		public Color NormalColor
		{
			get
			{
				return this._normalColor;
			}
			set
			{
				this._normalColor = value;
				this.Invalidate();
			}
		}
		[CategoryAttribute("Appearance"), DefaultValue(typeof(Color), "220, 80, 80")]
		public Color HoverColor
		{
			get
			{
				return this._hoverColor;
			}
			set
			{
				this._hoverColor = value;
				this.Invalidate();
			}
		}

		[CategoryAttribute("Appearance"), DefaultValue(typeof(Color), "251, 161, 0")]
		public Color PressedColor
		{
			get
			{
				return this._pressedColor;
			}
			set
			{
				this._pressedColor = value;
				this.Invalidate();
			}
		}

		public ControlState ControlState { get; set; }

		protected override void OnMouseEnter(EventArgs e)//鼠标进入时
		{
			ControlState = ControlState.Hover;//Hover
			base.OnMouseEnter(e);
		}
		protected override void OnMouseLeave(EventArgs e)//鼠标离开
		{
			ControlState = ControlState.Normal;//正常
			base.OnMouseLeave(e);
		}
		protected override void OnMouseDown(MouseEventArgs e)//鼠标按下
		{
			if (e.Button == MouseButtons.Left && e.Clicks == 1)//鼠标左键且点击次数为1
			{
				ControlState = ControlState.Pressed;//按下的状态
			}
			base.OnMouseDown(e);
		}

		protected override void OnMouseUp(MouseEventArgs e)//鼠标弹起
		{
			if (e.Button == MouseButtons.Left && e.Clicks == 1)
			{
				if (ClientRectangle.Contains(e.Location))//控件区域包含鼠标的位置
				{
					ControlState = ControlState.Hover;
				}
				else
				{
					ControlState = ControlState.Normal;
				}
			}
			base.OnMouseUp(e);
		}
		public MyButton()
		{
			ForeColor = Color.White;
			Radius = 20;
			this.FlatStyle = FlatStyle.Flat;
			this.FlatAppearance.BorderSize = 0;
			this.ControlState = ControlState.Normal;
			this.SetStyle(
			 ControlStyles.UserPaint |  //控件自行绘制，而不使用操作系统的绘制
			 ControlStyles.AllPaintingInWmPaint | //忽略背景擦除的Windows消息，减少闪烁，只有UserPaint设为true时才能使用。
			 ControlStyles.OptimizedDoubleBuffer |//在缓冲区上绘制，不直接绘制到屏幕上，减少闪烁。
			 ControlStyles.ResizeRedraw | //控件大小发生变化时，重绘。                  
			 ControlStyles.SupportsTransparentBackColor, //支持透明背景颜色
			 true);
		}


		//重写OnPaint
		protected override void OnPaint(System.Windows.Forms.PaintEventArgs e)
		{
			base.OnPaint(e);
			// base.OnPaintBackground(e);

			// 尽可能高质量绘制
			e.Graphics.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;
			e.Graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
			e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
			e.Graphics.CompositingQuality = CompositingQuality.HighQuality;
			e.Graphics.InterpolationMode = InterpolationMode.HighQualityBilinear;

			Rectangle rect = new Rectangle(0, 0, this.Width, this.Height);
			var path = GetRoundedRectPath(rect, radius);

			this.Region = new Region(path);

			Color baseColor;
			//Color borderColor;
			//Color innerBorderColor = this._baseColor;//Color.FromArgb(200, 255, 255, 255); ;

			switch (ControlState)
			{
				case ControlState.Hover:
					baseColor = this._hoverColor;
					break;
				case ControlState.Pressed:
					baseColor = this._pressedColor;
					break;
				case ControlState.Normal:
					baseColor = this._normalColor;
					break;
				default:
					baseColor = this._normalColor;
					break;
			}

			using (SolidBrush b = new SolidBrush(baseColor))
			{
				e.Graphics.FillPath(b, path); // 填充路径，而不是DrawPath
				using (Brush brush = new SolidBrush(this.ForeColor))
				{
					// 文本布局对象
					using (StringFormat gs = new StringFormat())
					{
						// 文字布局
						switch (_textAlign)
						{
							case ContentAlignment.TopLeft:
								gs.Alignment = StringAlignment.Near;
								gs.LineAlignment = StringAlignment.Near;
								break;
							case ContentAlignment.TopCenter:
								gs.Alignment = StringAlignment.Center;
								gs.LineAlignment = StringAlignment.Near;
								break;
							case ContentAlignment.TopRight:
								gs.Alignment = StringAlignment.Far;
								gs.LineAlignment = StringAlignment.Near;
								break;
							case ContentAlignment.MiddleLeft:
								gs.Alignment = StringAlignment.Near;
								gs.LineAlignment = StringAlignment.Center;
								break;
							case ContentAlignment.MiddleCenter:
								gs.Alignment = StringAlignment.Center; //居中
								gs.LineAlignment = StringAlignment.Center;//垂直居中
								break;
							case ContentAlignment.MiddleRight:
								gs.Alignment = StringAlignment.Far;
								gs.LineAlignment = StringAlignment.Center;
								break;
							case ContentAlignment.BottomLeft:
								gs.Alignment = StringAlignment.Near;
								gs.LineAlignment = StringAlignment.Far;
								break;
							case ContentAlignment.BottomCenter:
								gs.Alignment = StringAlignment.Center;
								gs.LineAlignment = StringAlignment.Far;
								break;
							case ContentAlignment.BottomRight:
								gs.Alignment = StringAlignment.Far;
								gs.LineAlignment = StringAlignment.Far;
								break;
							default:
								gs.Alignment = StringAlignment.Center; //居中
								gs.LineAlignment = StringAlignment.Center;//垂直居中
								break;
						}
						// if (this.RightToLeft== RightToLeft.Yes)
						// {
						//     gs.FormatFlags = StringFormatFlags.DirectionRightToLeft;
						// }  
						e.Graphics.DrawString(this.Text, this.Font, brush, rect, gs);
					}
				}
			}
		}
		/// <summary>
		/// 根据矩形区域rect，计算呈现radius圆角的Graphics路径
		/// </summary>
		/// <param name="rect"></param>
		/// <param name="radius"></param>
		/// <returns></returns>
		private GraphicsPath GetRoundedRectPath(Rectangle rect, int radius)
		{
			#region 正确绘制圆角矩形区域
			int R = radius * 2;
			Rectangle arcRect = new Rectangle(rect.Location, new Size(R, R));
			GraphicsPath path = new GraphicsPath();
			// 左上圆弧 左手坐标系，顺时针为正 从180开始，转90度
			path.AddArc(arcRect, 180, 90);
			// 右上圆弧
			arcRect.X = rect.Right - R;
			path.AddArc(arcRect, 270, 90);
			// 右下圆弧
			arcRect.Y = rect.Bottom - R;
			path.AddArc(arcRect, 0, 90);
			// 左下圆弧
			arcRect.X = rect.Left;
			path.AddArc(arcRect, 90, 90);
			path.CloseFigure();
			return path;
			#endregion
		}

		protected override void OnSizeChanged(EventArgs e)
		{
			base.OnSizeChanged(e);
		}
	}
```

</details>

从上述的对比可以看到，看到二者的对比之后，无论是从实现效果还是代码量，可以明确的感知到 **WPF** 的优雅。

## 个人对WPF的发展设想

因为 .NET 平台开发的软件需要自带一个 .NET 运行时，对于早期这种网络受限，电脑性能普遍较低的年代，WPF错失了一次很好的发展机会，以致于像现在这样不温不火，微软也放弃了对它进行持续的扩展和维护。

早在2011年左右，腾讯也尝试做过基于 **WPF** 的 **QQ概念版（Beta 1.1 - 1.3）** ，当时的效果还是很惊艳的，最后因为各种原因，放弃了该方案。

下面放几张当时的界面效果（网络图片，如有侵权，请联系删除）。

![WPF的QQ概念版-登录](/images/WPFQQ1.png)

![WPF的QQ概念版-主页](/images/WPFQQ2.png)

![WPF的QQ概念版-QQ好友管理](/images/WPFQQ3.png)

![WPF的QQ概念版-好友操作](/images/WPFQQ4.png)

可以看出 **WPF** 的图形能力，早在2010年左右就被认定是超现代化的，目前虽然不被大力支持与维护，但是经过这么多年的叠代，稳定性和适用性也已经是足够的了，几乎能够满足日常的所有界面开发需求。

所以个人单方面认为，虽然界面开发技术日新月异，也出现了很多跨平台的界面开发技术。不过 **Windows** 依然是主流平台，至少未来10年，甚至是20年。 **WPF** 虽然是 `Only Windows` 的界面开发框架，但它仍然具备一战之力，特别是现代的网络和电脑性能都有了跨越式的提升。相信现在，乃至未来10年都是使用 **WPF** 的最佳时机。

（给大家吃个定心丸，哈哈哈！）

**后续也会进行很长一段时间的 WPF 开发内容。**