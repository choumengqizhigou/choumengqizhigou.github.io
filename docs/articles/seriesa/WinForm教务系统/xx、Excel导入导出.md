---
giscus: b625102d-84a4-4431-ad0b-702dc704253b
---

你好，我是丑萌气质狗，这里临时贴出两个 `NPOI` 导入/导出 `Excel` 文件的方法代码（后续补充流程后可能存在一定差异 - 2026.1.6）。

## Excel导入C#（格式化数据）

``` CSharp
		/// <summary>
		/// 读取Excel表格，返回List<PersonnelTModel>模型数据
		/// </summary>
		/// <param name="filePath">Excel文件路径</param>
		/// <returns></returns>
		public static List<PersonnelTModel> ReadExcelToPersonnels(string filePath)
		{
			List<PersonnelTModel> list = new List<PersonnelTModel>();

			using (FileStream fs = new FileStream(filePath, FileMode.Open))
			{
				//读取工作簿对象 .xlsx（Excel 2007+，XSSF） .xls（Excel 2003，HSSF）
				//IWorkbook workbook = new HSSFWorkbook(); // 2003
				IWorkbook workbook = new XSSFWorkbook(fs);
				//读取工作簿对象下的Sheet页面对象
				ISheet sheet = workbook.GetSheetAt(0);

				//循环遍历所有行数据（直接跳过第一行）
				for (int i = sheet.FirstRowNum; i <= sheet.LastRowNum; i++)
				{
					if (i == 0)
						continue;

					IRow row = sheet.GetRow(i);
					if (row == null) continue;

					PersonnelTModel model = new PersonnelTModel
					{
						Name = row.GetCell(0).ToString(),
						Gender = row.GetCell(1).ToString(),
						Address = row.GetCell(2).ToString()
					};

					list.Add(model);
				}
			}
			return list;
		}
```

## C#导出Excel

``` CSharp
		/// <summary>
		/// 导出List<PersonnelTModel>模型数据到Excel
		/// </summary>
		/// <param name="list"></param>
		/// <param name="filePath"></param>
		public static void ExportPersonnelToExcel(List<PersonnelTModel> list, string filePath)
		{
			//创建xlsx格式的工作簿
			IWorkbook workbook = new XSSFWorkbook(); // xlsx
			ISheet sheet = workbook.CreateSheet("Personnel");

			//创建表头
			IRow headerRow = sheet.CreateRow(0);
			headerRow.CreateCell(0).SetCellValue("学号");
			headerRow.CreateCell(1).SetCellValue("姓名");
			headerRow.CreateCell(2).SetCellValue("性别");
			headerRow.CreateCell(3).SetCellValue("家庭住址");

			//已有表头，直接从第二行开始创建
			int i = 1;
			foreach (var model in list)
			{
				IRow row = sheet.CreateRow(i);

				row.CreateCell(0).SetCellValue(model.PersonnelID);
				row.CreateCell(1).SetCellValue(model.Name);
				row.CreateCell(2).SetCellValue(model.Gender);
				row.CreateCell(3).SetCellValue(model.Address);

				//每次创建一行，i++，下次创建下一行
				i++;
			}

			//写入文件
			using (FileStream fs = new FileStream(filePath, FileMode.Create))
			{
				workbook.Write(fs);
			}
		}
```
