import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { loadFont } from "./pdfFont"

const translateStatus = (
  status
) => {

  switch (status) {

    case "PENDING":
      return "Đang xử lý"

    case "PAID":
      return "Đã thanh toán"

    case "DELIVERED":
      return "Đã giao"

    case "CANCELLED":
      return "Đã hủy"

    default:
      return status
  }

}

export const exportOrdersPDF =
  async (
    orders,
    selectedMonths = []
  ) => {

    const filteredOrders =
      Array.isArray(orders)
        ? orders
        : []

    // =========================
    // GROUP ORDERS
    // =========================

    const deliveredOrders =
      filteredOrders.filter(
        (item) =>
          item.orderStatus ===
          "DELIVERED"
      )

    const pendingOrders =
      filteredOrders.filter(
        (item) =>
          item.orderStatus ===
          "PENDING"
      )

    const paidOrders =
      filteredOrders.filter(
        (item) =>
          item.orderStatus ===
          "PAID"
      )

    const cancelledOrders =
      filteredOrders.filter(
        (item) =>
          item.orderStatus ===
          "CANCELLED"
      )

    // =========================
    // ONLY DELIVERED REVENUE
    // =========================

    const totalRevenue =
      deliveredOrders.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.totalPrice || 0
          ),
        0
      )

    // =========================
    // PAYMENT METHODS
    // =========================

    const vnpayOrders =
      filteredOrders.filter(
        (item) =>
          item.paymentMethod ===
          "VNPAY"
      )

    const codOrders =
      filteredOrders.filter(
        (item) =>
          item.paymentMethod ===
          "COD"
      )

    // =========================
    // CREATE PDF
    // =========================

    const doc = new jsPDF(
      "l",
      "mm",
      "a4"
    )

    await loadFont(doc)

    // =========================
    // HEADER
    // =========================

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setFontSize(24)

    doc.setTextColor(
      13,
      110,
      253
    )

    doc.text(
      "KOPARION",
      14,
      18
    )

    doc.setFontSize(18)

    doc.text(
      "BÁO CÁO ĐƠN HÀNG",
      14,
      30
    )

    doc.setTextColor(
      0,
      0,
      0
    )

    // =========================
    // SHOP INFO
    // =========================

    doc.setFont(
      "Roboto",
      "normal"
    )

    doc.setFontSize(10)

    doc.text(
      "Hệ thống quản lý bán sách trực tuyến",
      14,
      40
    )

    doc.text(
      "Koparion BookStore",
      14,
      46
    )

    doc.text(
      "TP. Hồ Chí Minh, Việt Nam",
      14,
      52
    )

    // =========================
    // EXPORT INFO
    // =========================

    const exportDate =
      new Date().toLocaleDateString(
        "vi-VN"
      )

    const exportTime =
      new Date().toLocaleTimeString(
        "vi-VN"
      )

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setFontSize(10)

    doc.text(
      `Ngày xuất: ${exportDate}`,
      205,
      24
    )

    doc.text(
      `Giờ xuất: ${exportTime}`,
      205,
      32
    )

    // =========================
    // SELECTED MONTHS BOX
    // =========================

    const monthText =
      selectedMonths.length > 0
        ? selectedMonths
          .map((item) => {

            const [
              year,
              month
            ] =
              item.split("-")

            return `Tháng ${month}/${year}`

          })
          .join("   •   ")
        : "Tất cả tháng"

    doc.setFillColor(
      232,
      244,
      255
    )

    doc.roundedRect(
      14,
      60,
      265,
      22,
      3,
      3,
      "F"
    )

    doc.setDrawColor(
      13,
      110,
      253
    )

    doc.roundedRect(
      14,
      60,
      265,
      22,
      3,
      3
    )

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setFontSize(11)

    doc.setTextColor(
      13,
      110,
      253
    )

    doc.text(
      "THÁNG ĐƯỢC THỐNG KÊ",
      18,
      69
    )

    doc.setFont(
      "Roboto",
      "normal"
    )

    doc.setFontSize(10)

    doc.setTextColor(
      0,
      0,
      0
    )

    const splitMonthText =
      doc.splitTextToSize(
        monthText,
        235
      )

    doc.text(
      splitMonthText,
      18,
      77
    )

    // =========================
    // STATISTICS BOX
    // =========================

    const statsY = 92

    doc.setFillColor(
      248,
      249,
      250
    )

    doc.roundedRect(
      14,
      statsY,
      265,
      38,
      3,
      3,
      "F"
    )

    doc.setDrawColor(
      220,
      220,
      220
    )

    doc.roundedRect(
      14,
      statsY,
      265,
      38,
      3,
      3
    )

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setFontSize(11)

    doc.text(
      "THỐNG KÊ ĐƠN HÀNG",
      18,
      statsY + 8
    )

    doc.setFont(
      "Roboto",
      "normal"
    )

    doc.setFontSize(10)

    // ROW 1

    doc.text(
      `Tổng đơn: ${filteredOrders.length}`,
      18,
      statsY + 18
    )

    doc.text(
      `Đã giao: ${deliveredOrders.length}`,
      70,
      statsY + 18
    )

    doc.text(
      `Đã hủy: ${cancelledOrders.length}`,
      120,
      statsY + 18
    )

    doc.text(
      `Đang xử lý: ${pendingOrders.length}`,
      170,
      statsY + 18
    )

    doc.text(
      `Đã thanh toán: ${paidOrders.length}`,
      225,
      statsY + 18
    )

    // ROW 2

    doc.text(
      `VNPAY: ${vnpayOrders.length}`,
      18,
      statsY + 30
    )

    doc.text(
      `COD: ${codOrders.length}`,
      70,
      statsY + 30
    )

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setTextColor(
      220,
      53,
      69
    )

    doc.text(
      `Doanh thu thực nhận: ${totalRevenue.toLocaleString(
        "vi-VN"
      )}đ`,
      120,
      statsY + 30
    )

    doc.setTextColor(
      0,
      0,
      0
    )

    // =========================
    // TABLE DATA
    // =========================

    const tableColumn = [

      "STT",

      "ID",

      "Khách hàng",

      "SĐT",

      "Địa chỉ",

      "Thanh toán",

      "Trạng thái",

      "Tổng tiền",

      "Ngày tạo"

    ]

    const tableRows = []

    filteredOrders.forEach(
      (
        item,
        index
      ) => {

        tableRows.push([

          index + 1,

          `#${item.id}`,

          item.customerName || "",

          item.customerPhone || "",

          item.customerAddress || "",

          item.paymentMethod || "",

          translateStatus(
            item.orderStatus
          ),

          `${Number(
            item.totalPrice || 0
          ).toLocaleString(
            "vi-VN"
          )}đ`,

          item.createdAt
            ? new Date(
              item.createdAt
            ).toLocaleString(
              "vi-VN"
            )
            : ""

        ])

      }
    )

    // =========================
    // TABLE
    // =========================

    autoTable(doc, {

      startY: 140,

      head: [tableColumn],

      body: tableRows,

      theme: "grid",

      margin: {

        left: 8,

        right: 8

      },

      styles: {

        font: "Roboto",

        fontSize: 8,

        overflow: "linebreak",

        cellPadding: 2,

        valign: "middle"

      },

      headStyles: {

        fillColor: [
          13,
          110,
          253
        ],

        textColor: 255,

        fontStyle: "bold",

        halign: "center"

      },

      alternateRowStyles: {

        fillColor: [
          248,
          249,
          250
        ]

      },

      columnStyles: {

        0: {
          cellWidth: 12,
          halign: "center"
        },

        1: {
          cellWidth: 15,
          halign: "center"
        },

        2: {
          cellWidth: 28
        },

        3: {
          cellWidth: 22
        },

        4: {
          cellWidth: 50
        },

        5: {
          cellWidth: 22,
          halign: "center"
        },

        6: {
          cellWidth: 28,
          halign: "center"
        },

        7: {
          cellWidth: 30,
          halign: "right"
        },

        8: {
          cellWidth: 40
        }

      }

    })

    // =========================
    // SUMMARY
    // =========================

    let finalY =
      doc.lastAutoTable.finalY + 15

    // nếu gần cuối trang thì tạo page mới

    if (finalY > 165) {

      doc.addPage()

      finalY = 20

    }

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setFontSize(14)

    doc.setTextColor(
      13,
      110,
      253
    )

    doc.text(
      "TỔNG KẾT BÁO CÁO",
      14,
      finalY
    )

    doc.setTextColor(
      0,
      0,
      0
    )

    doc.setFontSize(11)

    doc.text(
      `Tổng số đơn hàng: ${filteredOrders.length}`,
      14,
      finalY + 12
    )

    doc.text(
      `Đơn đã giao: ${deliveredOrders.length}`,
      14,
      finalY + 22
    )

    doc.text(
      `Đơn đã thanh toán: ${paidOrders.length}`,
      14,
      finalY + 32
    )

    doc.text(
      `Đơn đang xử lý: ${pendingOrders.length}`,
      14,
      finalY + 42
    )

    doc.text(
      `Đơn đã hủy: ${cancelledOrders.length}`,
      14,
      finalY + 52
    )

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setTextColor(
      220,
      53,
      69
    )

    doc.setFontSize(13)

    doc.text(
      `Tổng doanh thu thực nhận: ${totalRevenue.toLocaleString(
        "vi-VN"
      )}đ`,
      14,
      finalY + 68
    )

    doc.setTextColor(
      0,
      0,
      0
    )

    // =========================
    // FOOTER
    // =========================

    const totalPages =
      doc.internal.getNumberOfPages()

    for (
      let i = 1;
      i <= totalPages;
      i++
    ) {

      doc.setPage(i)

      const pageHeight =
        doc.internal.pageSize.height

      const pageWidth =
        doc.internal.pageSize.width

      doc.setDrawColor(
        220,
        220,
        220
      )

      doc.line(
        14,
        pageHeight - 16,
        pageWidth - 14,
        pageHeight - 16
      )

      doc.setFont(
        "Roboto",
        "normal"
      )

      doc.setFontSize(9)

      doc.setTextColor(
        120
      )

      doc.text(
        "© 2026 Koparion BookStore Management System",
        14,
        pageHeight - 8
      )

      doc.text(
        `Trang ${i}/${totalPages}`,
        pageWidth - 35,
        pageHeight - 8
      )

    }

    // =========================
    // SAVE FILE
    // =========================

    doc.save(
      "bao-cao-don-hang-koparion.pdf"
    )

  }


export const exportInvoicePDF =
  async (
    order,
    orderItems
  ) => {

    const doc = new jsPDF(
      "p",
      "mm",
      "a4"
    )

    await loadFont(doc)

    // =========================
    // HEADER
    // =========================

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setFontSize(24)

    doc.setTextColor(
      13,
      110,
      253
    )

    doc.text(
      "KOPARION",
      14,
      20
    )

    doc.setFontSize(18)

    doc.text(
      "HÓA ĐƠN ĐƠN HÀNG",
      14,
      30
    )

    doc.setTextColor(
      0,
      0,
      0
    )

    // =========================
    // ORDER INFO
    // =========================

    doc.setFont(
      "Roboto",
      "normal"
    )

    doc.setFontSize(11)

    doc.text(
      `Mã đơn hàng: #${order.id}`,
      14,
      45
    )

    doc.text(
      `Ngày tạo: ${order.createdAt
        ? new Date(
          order.createdAt
        ).toLocaleString(
          "vi-VN"
        )
        : ""
      }`,
      14,
      53
    )

    // =========================
    // CUSTOMER INFO BOX
    // =========================

    doc.setFillColor(
      248,
      249,
      250
    )

    doc.roundedRect(
      14,
      62,
      182,
      40,
      3,
      3,
      "F"
    )

    doc.setDrawColor(
      220,
      220,
      220
    )

    doc.roundedRect(
      14,
      62,
      182,
      40,
      3,
      3
    )

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setFontSize(13)

    doc.text(
      "THÔNG TIN KHÁCH HÀNG",
      18,
      72
    )

    doc.setFont(
      "Roboto",
      "normal"
    )

    doc.setFontSize(11)

    doc.text(
      `Khách hàng: ${order.customerName}`,
      18,
      82
    )

    doc.text(
      `Số điện thoại: ${order.customerPhone}`,
      18,
      89
    )

    doc.text(
      `Địa chỉ: ${order.customerAddress}`,
      18,
      96
    )

    // =========================
    // PRODUCT TABLE
    // =========================

    const tableColumn = [

      "Sản phẩm",

      "Danh mục",

      "SL",

      "Đơn giá",

      "Thành tiền"

    ]

    const tableRows = []

    orderItems.forEach(
      (item) => {

        tableRows.push([

          item.product?.name || "",

          item.product?.category
            ?.name || "",

          item.quantity || 0,

          `${Number(
            item.price || 0
          ).toLocaleString(
            "vi-VN"
          )}đ`,

          `${(
            Number(
              item.quantity || 0
            ) *
            Number(
              item.price || 0
            )
          ).toLocaleString(
            "vi-VN"
          )}đ`

        ])

      }
    )

    autoTable(doc, {

      startY: 112,

      head: [tableColumn],

      body: tableRows,

      theme: "grid",

      styles: {

        font: "Roboto",

        fontSize: 9,

        overflow: "linebreak",

        cellPadding: 2

      },

      headStyles: {

        fillColor: [
          13,
          110,
          253
        ],

        textColor: 255,

        fontStyle: "bold",

        halign: "center"

      },

      alternateRowStyles: {

        fillColor: [
          248,
          249,
          250
        ]

      },

      columnStyles: {

        0: {
          cellWidth: 65
        },

        1: {
          cellWidth: 40
        },

        2: {
          cellWidth: 20,
          halign: "center"
        },

        3: {
          cellWidth: 30,
          halign: "right"
        },

        4: {
          cellWidth: 35,
          halign: "right"
        }

      }

    })

    // =========================
    // TOTAL
    // =========================

    const finalY =
      doc.lastAutoTable.finalY +
      15

    doc.setFont(
      "Roboto",
      "bold"
    )

    doc.setFontSize(14)

    doc.setTextColor(
      220,
      53,
      69
    )

    doc.text(
      `TỔNG TIỀN: ${Number(
        order.totalPrice || 0
      ).toLocaleString(
        "vi-VN"
      )}đ`,
      14,
      finalY
    )

    doc.setTextColor(
      0,
      0,
      0
    )

    // =========================
    // FOOTER
    // =========================

    const pageHeight =
      doc.internal.pageSize.height

    doc.setFontSize(9)

    doc.setTextColor(
      120
    )

    doc.text(
      "Cảm ơn quý khách đã mua hàng tại Koparion",
      14,
      pageHeight - 10
    )

    // =========================
    // SAVE FILE
    // =========================

    doc.save(
      `hoa-don-${order.id}.pdf`
    )

  }