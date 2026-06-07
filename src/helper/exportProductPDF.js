import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { loadFont } from "./pdfFont"

export const exportProductsPDF = async (products) => {

  // =========================
  // CREATE PDF
  // =========================

  const doc = new jsPDF(
    "p",
    "mm",
    "a4"
  )

  // =========================
  // LOAD FONT VIETNAMESE
  // =========================

  await loadFont(doc)

  // =========================
  // TITLE
  // =========================

  doc.setFontSize(18)

  doc.text(
    "BÁO CÁO SẢN PHẨM",
    14,
    20
  )

  // =========================
  // DATE
  // =========================

  const date =
    new Date().toLocaleDateString(
      "vi-VN"
    )

  doc.setFontSize(11)

  doc.text(
    `Ngày xuất: ${date}`,
    14,
    30
  )

  // =========================
  // TABLE
  // =========================

  const tableColumn = [
    "ID",
    "Tên sách",
    "Thể loại",
    "Giá",
    "Tồn kho",
    "Mô tả"
  ]

  const tableRows = []

  products.forEach((product) => {

    const rowData = [

      product.id,

      product.name,

      product.category || "",

      `${Number(
        product.price
      ).toLocaleString(
        "vi-VN"
      )}đ`,

      product.stock,

      product.description || ""
    ]

    tableRows.push(rowData)
  })

  autoTable(doc, {

    startY: 40,

    head: [tableColumn],

    body: tableRows,

    theme: "grid",

    styles: {

      font: "Roboto",

      fontSize: 10,

      cellPadding: 3,

      valign: "middle",

      overflow: "linebreak",

      cellWidth: "wrap"
    },

    headStyles: {

      fillColor: [13, 110, 253],

      textColor: 255,

      fontStyle: "bold",

      halign: "center"
    },

    columnStyles: {

      0: {
        cellWidth: 15,
        halign: "center"
      },

      1: {
        cellWidth: 40
      },

      2: {
        cellWidth: 28
      },

      3: {
        cellWidth: 28,
        halign: "right"
      },

      4: {
        cellWidth: 20,
        halign: "center"
      },

      5: {
        cellWidth: 55
      }
    }
  })

  // =========================
  // FOOTER
  // =========================

  const pageHeight =
    doc.internal.pageSize.height

  doc.setFontSize(10)

  doc.text(
    `Tổng sản phẩm: ${products.length}`,
    14,
    pageHeight - 10
  )

  // =========================
  // SAVE FILE
  // =========================

  doc.save(
    "bao-cao-san-pham.pdf"
  )
}