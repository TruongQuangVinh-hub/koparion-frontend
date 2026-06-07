import {
  useEffect,
  useMemo,
  useState
} from "react"

import MenuDashboard from "./components/MenuDashboard"
import NavbarDashboard from "./components/NavbarDashboard"
import FooterDashboard from "./components/FooterDashboard"

import {
  fetchProductsAdminAPI,
  fetchOrdersAPI
} from "../../api/backendAPI"

const Dashboard = () => {

  const [products, setProducts] =
    useState([])

  const [orders, setOrders] =
    useState([])

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    const loadData = async () => {

      try {

        const productRes =
          await fetchProductsAdminAPI()

        const orderRes =
          await fetchOrdersAPI()

        setProducts(
          Array.isArray(productRes)
            ? productRes
            : []
        )

        setOrders(
          Array.isArray(orderRes)
            ? orderRes
            : []

        )

      } catch (error) {

        console.log(error)
      }
    }

    loadData()

  }, [])

  // =========================
  // LAST 12 MONTHS DATA
  // =========================

  const {
    monthLabels,
    revenueByMonth
  } = useMemo(() => {

    const now =
      new Date()

    const labels = []

    const revenueData =
      []

    const last12Months = []

    // TẠO 12 THÁNG GẦN NHẤT
    for (
      let i = 11;
      i >= 0;
      i--
    ) {

      const date =
        new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        )

      const month =
        date.getMonth()

      const year =
        date.getFullYear()

      last12Months.push({
        month,
        year
      })

      labels.push(
        `T${month + 1}/${year}`
      )

      revenueData.push(0)
    }

    // =====================
    // REVENUE
    // CHỈ TÍNH DELIVERED
    // =====================

    orders.forEach((order) => {

      // KHÔNG PHẢI ĐÃ GIAO
      if (
        order.orderStatus !==
        "DELIVERED"
      ) return

      const orderDate =
        new Date(
          order.createdAt
        )

      // BỎ QUA DATA TƯƠNG LAI
      if (
        orderDate > now
      ) return

      const orderMonth =
        orderDate.getMonth()

      const orderYear =
        orderDate.getFullYear()

      const index =
        last12Months.findIndex(
          (item) =>
            item.month ===
              orderMonth &&
            item.year ===
              orderYear
        )

      if (index !== -1) {

        revenueData[index] +=
          order.totalPrice
      }
    })

    return {

      monthLabels:
        labels,

      revenueByMonth:
        revenueData
    }

  }, [orders])

  // =========================
  // AREA CHART
  // =========================

  useEffect(() => {

    if (
      !window.Chart
    ) return

    const ctx =
      document.getElementById(
        "myAreaChart"
      )

    if (!ctx) return

    // DESTROY OLD CHART
    if (
      window.areaChartInstance
    ) {

      window.areaChartInstance.destroy()
    }

    window.areaChartInstance =
      new window.Chart(ctx, {

        type: "line",

        data: {

          labels:
            monthLabels,

          datasets: [
            {
              label:
                "Doanh thu",

              data:
                revenueByMonth,

              lineTension: 0.3,

              backgroundColor:
                "rgba(78, 115, 223, 0.05)",

              borderColor:
                "rgba(78, 115, 223, 1)",

              pointRadius: 4,

              pointBackgroundColor:
                "rgba(78, 115, 223, 1)",

              pointBorderColor:
                "rgba(78, 115, 223, 1)",

              pointHoverRadius: 5,

              pointHoverBackgroundColor:
                "rgba(78, 115, 223, 1)",

              pointHoverBorderColor:
                "rgba(78, 115, 223, 1)",

              pointHitRadius: 10,

              pointBorderWidth: 2,

              fill: true
            }
          ]
        },

        options: {

          maintainAspectRatio:
            false,

          responsive: true,

          scales: {

            yAxes: [
              {
                ticks: {

                  beginAtZero: true,

                  callback:
                    function (
                      value
                    ) {

                      return value.toLocaleString(
                        "vi-VN"
                      ) + "đ"
                    }
                }
              }
            ]
          },

          tooltips: {

            callbacks: {

              label:
                function (
                  tooltipItem
                ) {

                  return (
                    "Doanh thu: " +
                    tooltipItem.yLabel.toLocaleString(
                      "vi-VN"
                    ) +
                    "đ"
                  )
                }
            }
          },

          legend: {
            display: true
          }
        }
      })

  }, [
    monthLabels,
    revenueByMonth
  ])

  // =========================
  // PIE CHART
  // =========================

  useEffect(() => {

    if (
      !orders.length ||
      !window.Chart
    ) return

    const ctx =
      document.getElementById(
        "myPieChart"
      )

    if (!ctx) return

    // DESTROY OLD CHART
    if (
      window.pieChartInstance
    ) {

      window.pieChartInstance.destroy()
    }

    const pending =
      orders.filter(
        (item) =>
          item.orderStatus ===
          "PENDING"
      ).length

    const delivered =
      orders.filter(
        (item) =>
          item.orderStatus ===
          "DELIVERED"
      ).length

    const cancelled =
      orders.filter(
        (item) =>
          item.orderStatus ===
          "CANCELLED"
      ).length

    window.pieChartInstance =
      new window.Chart(ctx, {

        type: "doughnut",

        data: {

          labels: [
            "Đang xử lý",
            "Đã giao",
            "Đã hủy"
          ],

          datasets: [
            {
              data: [
                pending,
                delivered,
                cancelled
              ],

              backgroundColor: [
                "#f6c23e",
                "#1cc88a",
                "#e74a3b"
              ],

              hoverBackgroundColor: [
                "#dda20a",
                "#17a673",
                "#be2617"
              ],

              hoverBorderColor:
                "rgba(234, 236, 244, 1)"
            }
          ]
        },

        options: {

          maintainAspectRatio:
            false,

          responsive: true,

          legend: {
            display: true,
            position: "bottom"
          },

          cutoutPercentage: 70
        }
      })

  }, [orders])

  // =========================
  // TOTAL REVENUE
  // CHỈ TÍNH DELIVERED
  // =========================

  const totalRevenue =
    orders
      .filter(
        (item) =>
          item.orderStatus ===
          "DELIVERED"
      )
      .reduce(
        (total, item) =>
          total + item.totalPrice,
        0
      )

  return (
    <>
      <div
        id="page-top"
        className="d-flex"
      >

        <MenuDashboard />

        <div
          id="content-wrapper"
          className="d-flex flex-column w-100"
        >

          <div id="content">

            <NavbarDashboard />

            <div className="container-fluid">

              {/* STATS */}
              <div className="row mb-4">

                {/* TOTAL PRODUCTS */}
                <div className="col-xl-4 col-md-6 mb-4">

                  <div className="card border-left-primary shadow h-100 py-2">

                    <div className="card-body">

                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">

                        Tổng sản phẩm

                      </div>

                      <div className="h5 mb-0 font-weight-bold text-gray-800">

                        {products.length}

                      </div>

                    </div>

                  </div>

                </div>

                {/* TOTAL ORDERS */}
                <div className="col-xl-4 col-md-6 mb-4">

                  <div className="card border-left-success shadow h-100 py-2">

                    <div className="card-body">

                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">

                        Tổng đơn hàng

                      </div>

                      <div className="h5 mb-0 font-weight-bold text-gray-800">

                        {orders.length}

                      </div>

                    </div>

                  </div>

                </div>

                {/* TOTAL REVENUE */}
                <div className="col-xl-4 col-md-6 mb-4">

                  <div className="card border-left-info shadow h-100 py-2">

                    <div className="card-body">

                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">

                        Tổng doanh thu

                      </div>

                      <div className="h5 mb-0 font-weight-bold text-gray-800">

                        {
                          totalRevenue.toLocaleString(
                            "vi-VN"
                          )
                        }đ

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* CHARTS */}
              <div className="row">

                {/* AREA CHART */}
                <div className="col-xl-8 col-lg-7">

                  <div className="card shadow mb-4">

                    <div className="card-header py-3">

                      <h6 className="m-0 font-weight-bold text-primary">

                        Doanh thu 12 tháng gần nhất

                      </h6>

                    </div>

                    <div className="card-body">

                      <div
                        className="chart-area"
                        style={{
                          height: "400px"
                        }}
                      >

                        <canvas id="myAreaChart"></canvas>

                      </div>

                    </div>

                  </div>

                </div>

                {/* PIE CHART */}
                <div className="col-xl-4 col-lg-5">

                  <div className="card shadow mb-4">

                    <div className="card-header py-3">

                      <h6 className="m-0 font-weight-bold text-primary">

                        Trạng thái đơn hàng

                      </h6>

                    </div>

                    <div className="card-body">

                      <div
                        className="chart-pie pt-4"
                        style={{
                          height: "400px"
                        }}
                      >

                        <canvas id="myPieChart"></canvas>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          <FooterDashboard />

        </div>

      </div>
    </>
  )
}

export default Dashboard