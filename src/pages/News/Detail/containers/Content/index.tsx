import { FC } from "react";

import styles from "../../styles.module.scss"

interface Props{
    data:string;
}

const NewsContent: FC<Props> = ({data}) =>{
    return <div className={styles.fullNews}>{data?.split(/\r?\n/).map((para,  index)=> <p key={index}>{para}</p>)}</div>
}

export default NewsContent;