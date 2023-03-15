import { useEffect, useState } from "react";
import { getNews } from "../../api/news/get/getNews";
import { APINews, APINewsDetail } from "../../api/news/types";
import { Footer } from "../../components";
import NewsCard from "../../components/Cards/NewsCard";
import Menu from "../../components/Menu";
import Marquee from "react-fast-marquee";
import ListGroup from 'react-bootstrap/ListGroup';

import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';

import { getLatest20News } from "../../api/news/get/getLatest20News";
import NewsModal from "../../components/Cards/NewsModal";





const LandingPage = () => {

	const [news, setNews] = useState<APINews[]>();

	useEffect(()=>{
	
	
	const fetch = async() =>{

		const { data } = await getLatest20News();

				if (data) {

					setNews(data!);
					console.log(data);
				} else {
					// navigate(RoutePath.ROOT);
				}
	}
	

	fetch(); 


	


},[])

	return (
		<>
	

			
				<Menu title={"tess"} /> 
				
			
				<Marquee style={{ backgroundColor:'lightgray'}}>{ news?.map(x => <div style={{ color: 'black',  padding: 10 }}>* {x.title} </div> ) }</Marquee>
				<div style={{height : '30px'}}>

				</div>

					
				
				{/* { news?.map(n => <NewsModal title={n.title} body={n.shortSummary}/>)} */}

				<div style={{margin:'auto' , width:'95%'}} className="row">

					<div style={{textAlign:'center' , border: "1px solid black"}} className="col-2">
					
					
					
					
					</div>

					<div style={{border: "1px solid black"}} className="col-8">
						
					{ news?.map((n) => <NewsModal key={n.id} id={n.id} src={n.imageName} title={n.title} body={n.shortSummary} />)}

					</div>

					<div  style={{textAlign:'center', border: "1px solid black"}} className="col-2">
						<div  style={{borderRadius:'5px' , marginTop:'5px', height:'40px' , backgroundColor:'#B58934' ,  color:'white'}}>
								
						<h4> الموهوبين و المتميزين</h4>
					</div>
					<br/>
					
					<Carousel style={{color:'black'}}   >{ news?.map((p, index )=> 
							<Carousel.Item key={index}>					
								
								<Card style={{ width: '18rem' , textAlign:'center' }}>
									<Card.Img style={{ minHeight:'250px' , maxHeight: '200px' , width :'200px' }} variant="top" src={p.imageName} />
									<Card.Body>
										<Card.Title>{p.title}</Card.Title>
										<Card.Text>
										{p.shortSummary}
										</Card.Text>
									</Card.Body>
																	
									</Card>
						</Carousel.Item>
							
						)}
					</Carousel>
					</div>



				</div>

				

			<div style={{height : '30px'}}>

			</div>

			
			<Footer />

			
		
		</>
	);
};

export default LandingPage;
