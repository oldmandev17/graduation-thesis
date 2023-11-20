/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import ExcelJS from 'exceljs'
import moment from 'moment'

const getImageIdFromUrl = async (image: string, workbook: any) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_URL_SERVER}/${image}`)
    const buffer = await response.arrayBuffer()
    const imageId = workbook.addImage({
      buffer,
      extension: 'png'
    })
    return imageId
  } catch (error) {
    return null
  }
}

const generateExcel = async (
  columns: Array<{ header: string; key: string; width: number }>,
  data: Array<any>,
  sheet: string,
  name: string
) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheet)

  worksheet.columns = columns

  for (const row of data) {
    const rowData = columns.map((col) => row[col.key])
    const dataRow = worksheet.addRow(rowData)

    const imageColumnIndex = columns.findIndex((col) => col.key === 'image')
    if (imageColumnIndex !== -1 && row.image) {
      const imageId = await getImageIdFromUrl(row.image, workbook)
      if (typeof imageId === 'number') {
        const imageColumnLetter = String.fromCharCode('A'.charCodeAt(0) + imageColumnIndex)
        worksheet.addImage(imageId, `${imageColumnLetter}${dataRow.number}:${imageColumnLetter}${dataRow.number + 1}`)
      }
    }
  }

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
