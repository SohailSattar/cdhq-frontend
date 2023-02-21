import { FC } from "react";

interface Props{
    text: string;
}

const Title : FC<Props> = ({text}) =>{
    return <h1>{text}</h1>
}

export default Title;