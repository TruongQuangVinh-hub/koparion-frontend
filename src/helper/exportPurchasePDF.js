import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { loadFont } from "./pdfFont"

export const exportPurchasePDF = async (
  purchase,
  purchaseDetails = []
) => {

  const doc = new jsPDF(
    "p",
    "mm",
    "a4"
  )

  await loadFont(doc)

  // =========================
  // COLORS
  // =========================

  const PRIMARY = [13, 110, 253]
  const GRAY = [248, 249, 250]
  const BORDER = [220, 220, 220]
  const RED = [220, 53, 69]

  // =========================
  // TOTAL
  // =========================

  const totalQuantity =
    purchaseDetails.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    )

  const totalAmount =
    purchaseDetails.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0) *
        Number(item.importPrice || 0),
      0
    )

  // =========================
  // HEADER
  // =========================

  doc.setFont(
    "Roboto",
    "bold"
  )

  doc.setFontSize(24)

  doc.setTextColor(...PRIMARY)

  doc.text(
    "KOPARION",
    14,
    20
  )

  doc.setFontSize(17)

  doc.text(
    "PHIẾU NHẬP HÀNG",
    14,
    30
  )

  doc.setTextColor(0, 0, 0)

  // =========================
  // SHOP INFO
  // =========================

  doc.setFont(
    "Roboto",
    "normal"
  )

  doc.setFontSize(10)

  doc.text(
    "Hệ thống quản lý nhập sách",
    14,
    38
  )

  doc.text(
    "Địa chỉ: TP. Hồ Chí Minh",
    14,
    44
  )

  doc.text(
    "Email: koparion@gmail.com",
    14,
    50
  )

  // =========================
  // PURCHASE INFO
  // =========================

  doc.setFillColor(...GRAY)

  doc.roundedRect(
    14,
    58,
    182,
    38,
    3,
    3,
    "F"
  )

  doc.setDrawColor(...BORDER)

  doc.roundedRect(
    14,
    58,
    182,
    38,
    3,
    3
  )

  doc.setFont(
    "Roboto",
    "bold"
  )

  doc.setFontSize(13)

  doc.text(
    "THÔNG TIN PHIẾU NHẬP",
    18,
    68
  )

  doc.setFont(
    "Roboto",
    "normal"
  )

  doc.setFontSize(10)

  doc.text(
    `Mã phiếu nhập: #${purchase?.id || ""}`,
    18,
    78
  )

  doc.text(
    `Ngày tạo: ${purchase?.createdAt
      ? new Date(
        purchase.createdAt
      ).toLocaleString("vi-VN")
      : ""
    }`,
    18,
    85
  )

  doc.text(
    `Tổng sản phẩm: ${purchaseDetails.length}`,
    110,
    78
  )

  doc.text(
    `Tổng số lượng: ${totalQuantity}`,
    110,
    85
  )

  // =========================
  // SUPPLIER INFO
  // =========================

  doc.setFillColor(...GRAY)

  doc.roundedRect(
    14,
    104,
    182,
    42,
    3,
    3,
    "F"
  )

  doc.setDrawColor(...BORDER)

  doc.roundedRect(
    14,
    104,
    182,
    42,
    3,
    3
  )

  doc.setFont(
    "Roboto",
    "bold"
  )

  doc.setFontSize(13)

  doc.text(
    "THÔNG TIN NHÀ CUNG CẤP",
    18,
    114
  )

  doc.setFont(
    "Roboto",
    "normal"
  )

  doc.setFontSize(10)

  doc.text(
    `Tên nhà cung cấp: ${purchase?.supplier?.name || ""}`,
    18,
    124
  )

  doc.text(
    `Số điện thoại: ${purchase?.supplier?.phone || ""}`,
    18,
    131
  )

  doc.text(
    `Tổng tiền nhập: ${Number(
      purchase?.totalAmount || 0
    ).toLocaleString("vi-VN")}đ`,
    18,
    138
  )

  // =========================
  // TABLE DATA
  // =========================

  const tableColumn = [
    "STT",
    "Tên sản phẩm",
    "Danh mục",
    "Số lượng",
    "Giá nhập",
    "Thành tiền"
  ]

  const tableRows = []

  purchaseDetails.forEach(
    (item, index) => {

      tableRows.push([

        index + 1,

        item.product?.name || "",

        item.product?.category?.name || "",

        Number(
          item.quantity || 0
        ).toLocaleString("vi-VN"),

        `${Number(
          item.importPrice || 0
        ).toLocaleString("vi-VN")}đ`,

        `${(
          Number(item.quantity || 0) *
          Number(item.importPrice || 0)
        ).toLocaleString("vi-VN")}đ`

      ])
    }
  )

  // =========================
  // TABLE
  // =========================

  autoTable(doc, {

    startY: 156,

    head: [tableColumn],

    body: tableRows,

    theme: "grid",

    margin: {
      left: 14,
      right: 14
    },

    styles: {

      font: "Roboto",

      fontSize: 9,

      overflow: "linebreak",

      cellPadding: 3,

      valign: "middle",

      lineColor: BORDER,

      lineWidth: 0.1

    },

    headStyles: {

      fillColor: PRIMARY,

      textColor: 255,

      fontStyle: "bold",

      halign: "center"

    },

    alternateRowStyles: {

      fillColor: GRAY

    },

    columnStyles: {

      0: {
        cellWidth: 15,
        halign: "center"
      },

      1: {
        cellWidth: 65
      },

      2: {
        cellWidth: 38
      },

      3: {
        cellWidth: 22,
        halign: "center"
      },

      4: {
        cellWidth: 25,
        halign: "right"
      },

      5: {
        cellWidth: 30,
        halign: "right"
      }

    }

  })

  // =========================
  // SUMMARY
  // =========================

  let finalY =
    doc.lastAutoTable.finalY + 15

  const pageHeight =
    doc.internal.pageSize.height

  // tránh đè footer

  if (finalY > pageHeight - 40) {

    doc.addPage()

    finalY = 30

  }

  doc.setFont(
    "Roboto",
    "bold"
  )

  doc.setFontSize(13)

  doc.text(
    "TỔNG KẾT PHIẾU NHẬP",
    14,
    finalY
  )

  doc.setFont(
    "Roboto",
    "normal"
  )

  doc.setFontSize(11)

  doc.text(
    `Tổng loại sản phẩm: ${purchaseDetails.length}`,
    14,
    finalY + 10
  )

  doc.text(
    `Tổng số lượng nhập: ${totalQuantity}`,
    14,
    finalY + 18
  )

  doc.setFont(
    "Roboto",
    "bold"
  )

  doc.setTextColor(...RED)

  doc.text(
    `TỔNG TIỀN NHẬP: ${totalAmount.toLocaleString(
      "vi-VN"
    )}đ`,
    14,
    finalY + 30
  )

  doc.setTextColor(0, 0, 0)

  // =========================
  // SIGNATURE
  // =========================

  doc.setFont(
    "Roboto",
    "normal"
  )

  doc.setFontSize(10)

  doc.text(
    "Người lập phiếu",
    25,
    finalY + 50
  )

  doc.text(
    "Nhà cung cấp",
    140,
    finalY + 50
  )

  // =========================
  // FOOTER
  // =========================

  const footerY =
    doc.internal.pageSize.height - 10

  doc.setFontSize(9)

  doc.setTextColor(120)

  doc.text(
    "© 2026 Koparion BookStore Management System",
    14,
    footerY
  )

  // =========================
  // SAVE
  // =========================

  doc.save(
    `phieu-nhap-${purchase?.id}.pdf`
  )

}