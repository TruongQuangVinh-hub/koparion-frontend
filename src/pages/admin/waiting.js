import MenuDashboard from "./components/MenuDashboard"
import NavbarDashboard from "./components/NavbarDashboard"
import FooterDashboard from "./components/FooterDashboard"

const Inventory = () => {
  return (
    <>
      <div className="d-flex">

        <MenuDashboard />
        <div
          id="content-wrapper"
          className="d-flex flex-column w-100"
        >

          <div id="content">
            <NavbarDashboard />
            <div className="container-fluid">

            </div>
          </div>
          <FooterDashboard />
        </div>
      </div>
    </>
  )
}

export default Inventory