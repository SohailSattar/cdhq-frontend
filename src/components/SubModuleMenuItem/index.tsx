import { FC } from "react";
import { Link } from "react-router-dom";
import styles from './styles.module.scss';

interface Props{
    title: string;
    link: string;
    icon: string;    
}

const SubModuleMenuItem: FC<Props> = ({ title, link, icon }) => {

  return (
    <li className={styles.p25}>
      <div className={styles.box}>
        <div className="shadow shadow-showcase text-center">
          <Link target="" to={`${link}`} replace >            
            <div className={styles.imageAlign}>
                <img
                  className={styles.image}
                  src={icon}
                  alt={title}
                  title={title}
                />
              </div>
              <div className={styles.title}>
                <h2
                  style={{
                    fontSize: "16px",
                    color: "black",
                    textTransform: "capitalize",
                  }}
                >
                  {title}
                </h2>
              </div>
          </Link>
        </div>
      </div>
    </li>
  );
};

export default SubModuleMenuItem;
