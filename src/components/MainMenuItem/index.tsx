import NavDropdown from "react-bootstrap/esm/NavDropdown";

import styles from "./styles.module.scss"



const MainMenuItem = () => {
    return 	<NavDropdown
    // show={show}
    // onMouseEnter={showDropdown}
    // onMouseLeave={hideDropdown}
    className={styles.navdropdown}
    title="الإستراتيجية"
    id="basic-nav-dropdown"
>
    <NavDropdown.Item>
        <a
            target="_blank"
            href="/appfiles/f6110/document/strplan2017.pdf"
        >
            {" "}
            الخطة الاستراتيجية
        </a>
    </NavDropdown.Item>
    <NavDropdown.Item>
        <a target="_blank" href="/AppFiles/IMS/">
            نظام الادارة المتكامل IMS
        </a>
    </NavDropdown.Item>
    <NavDropdown.Item>
        <a href="#">كلمة القائد</a>
    </NavDropdown.Item>

    <NavDropdown.Divider />
</NavDropdown>
}

export default MainMenuItem;