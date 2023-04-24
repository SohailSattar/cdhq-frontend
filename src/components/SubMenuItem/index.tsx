import { FC } from "react";
import NavDropdown from "react-bootstrap/esm/NavDropdown";
import { Link } from "react-router-dom";

interface Props{
    title: string;
    url: string;
    opensIn?: "Another Window" | "Same Window"
}

const SubMenuItem: FC<Props> = ({ title, url, opensIn}) => {
    return <NavDropdown.Item>
        {opensIn==="Same Window" ? <Link to={url}>{title}</Link> : 
        <a
            target={"_blank"}
            href={url}
        >
            {title}
        </a>}
    </NavDropdown.Item>
}

export default SubMenuItem;