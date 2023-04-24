import { FC } from "react";

import styles from "./styles.module.scss";

import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';

import Carousel from 'react-bootstrap/Carousel';

import React, { useState } from 'react';
import { Id } from "../../../utils";





export interface Props {
    id: Id;
	title: string;
    body :string;
    src:string; 
}


const NewsModal: FC<Props> = ({id, title, body ,src  }) => {

     const infoClickHandler = (id: Id) =>{
console.log(id);
     }
    
	return (

        <>
        <br/>

    <Card dir="rtl" style={{border:'1px solid #B58934 ' ,backgroundImage:"url('modalBg.png')"}}>
                <Card.Header >{title}</Card.Header>
                <Card.Body>
                    <Card.Img style={{ border:'2px solid #B58934 ' ,borderRadius:'5px' , width:'200px'}} src={src} />
                    <Card.Text>
                        {body}
                    </Card.Text>
                    <a  href="#" style={{textDecoration:'none'  , color:'#B58934'}} >المزيد</a>
                    <Button onClick={() => infoClickHandler(id)}>المزيد</Button>
                    
                </Card.Body>

                
    </Card>
    <div style={{height:'40px'}}>

    </div>
   
        </>
	);

};

export default NewsModal;