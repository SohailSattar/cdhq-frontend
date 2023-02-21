import { FC } from "react";

interface Props{
    postedDate: string;
}

const NewsMeta: FC<Props> = ({postedDate}) =>{return <>Dated: {postedDate} </>}

export default NewsMeta;