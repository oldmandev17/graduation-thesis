import ExcelJS from 'exceljs'
import moment from 'moment'

const generateExcel = async (
  columns: Array<{ header: string; key: string; width: number }>,
  data: Array<any>,
  sheet: string,
  name: string
) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheet)

  worksheet.columns = columns

  data.forEach((row) => {
    worksheet.addRow(row)
  })

  const blob = await workbook.xlsx.writeBuffer()
  const now = moment()

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([blob]))
  a.download = `${name}_${now.format('YYYYMMDDHHMMSS')}.xlsx`
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export default generateExcel
