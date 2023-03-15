import { FC } from "react";

import styles from "./styles.module.scss";

import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';

import Carousel from 'react-bootstrap/Carousel';

import React, { useState } from 'react';





export interface Props {
	title: string;
    body :string;
}

const NewsCard: FC<Props> = ({ title, body }) => {
	return (

        <>

        <div dir="rtl" className={styles.NewsCard}>
            <Card >
                <Card.Img style={{height:'250px' ,width : '200px'}} variant="top" src="https://images.unsplash.com/photo-1580162914316-f74f56160ea9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80" />
                <Card.Body>
                    <Card.Title> {title}</Card.Title>
                        <Card.Text>
                            {body}
                        </Card.Text>
                        <Button variant="warning">قراءة المزيد</Button>
                </Card.Body>
            </Card>
        
            
                
            </div>
            
            <div>
                
            </div>
        </>
	);
};

export default NewsCard;