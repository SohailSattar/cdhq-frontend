import { FC } from "react";

import styles from "./styles.module.scss";

import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';




export interface Props {
	title: string;
}

const NewsCard: FC<Props> = ({ title }) => {
	return (

        <>

        <div dir="rtl" className={styles.NewsCard}>
            <Card style={{  width: '100%' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title> العنوان</Card.Title>
                        <Card.Text>
                        دعت الإدارة العامة للدفاع المدني بعجمان مستخدمي السيارات الكهربائية اتخاذ الاجراءات الوقائية للحد من وقوع حوادث الحرائق أثناء شحن السيارات في المنازل
                        </Card.Text>
                        <Button variant="warning">قراءة المزيد</Button>
                </Card.Body>
            </Card>
        
            
                
            </div>
            
            
        </>
	);
};

export default NewsCard;