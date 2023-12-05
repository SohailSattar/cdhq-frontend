import { useCallback, useEffect, useState } from "react";
import QRCard from "../Cards/QR";
import { getAllQRCodes } from "../../api/qr-codes/get/getAllQRCodes";
import { APIQRCodeItem } from "../../api/qr-codes/types";

import styles from "./styles.module.scss";

const FootQRTable = () => {
	const [codes, setCodes] = useState<APIQRCodeItem[]>([]);

	const fetchDetails = useCallback(async () => {
		const { data } = await getAllQRCodes();

		if (data) {
			setCodes(data);
		}
	}, []);

	useEffect(() => {
		fetchDetails();
	}, [fetchDetails]);

	return (
		<div className={styles.qrCodes}>
			{codes.map((code, index) => (
				<QRCard
					imageName={code.imageName}
					name={code.name}
					iconName={code.iconName}
					key={index}
				/>
			))}
			{/* <QRCard />
			<QRCard />
			<QRCard />
			<QRCard /> */}
			{/* <table class="bottom" id="qrTable" width="100%" style="text-align: center; " dir="rtl"  >
			 <tr>
			 	<td>
			 		<img src="image/QR_CDHQ.png">
			 	</td>
			 	<td>
			 		<img src="image/youtubeCD.png">
			 	</td>

			 	<td>
			 		<img src="image/instagramCD.png">
			 	</td>

			  	<td>
			 		<img src="image/twitterCD.png">

			 	</td>
			 </tr>
			 <tr style="vertical-align:top ; font-size: 18px; ">
			 	<td>
			 		
			 		<table class="middel" dir="ltr"  style="vertical-align: middle ; margin: auto  " align="center" >
			 			<tr>
			 				<td ><img  src="image/MOI_SIcon.png" style="height: 50px; width: 50px "  ></td>
			 				<td>Civil Defense H.Q</td>
			 			</tr>
			 		</table>

			 	</td>

			 	<td>
			 		
			 		<table class="middel"  dir="ltr"  style="vertical-align: middle ; margin: auto  " align="center" >
			 			<tr>
			 				<td ><img  src="image/youtube.png" style="height: 50px; width: 50px "  ></td>
			 				<td>Youtube</td>
			 			</tr>
			 		</table>
			 		
			 		
			 		
			 	</td>
			 	<td>
			 		<table class="middel" dir="ltr"  style="vertical-align: middle ; margin: auto  " align="center" >
			 			<tr>
			 				<td ><img   src="image/instagram.png" style="height: 50px; width: 50px "  /></td>
			 				<td>Instagram</td>
			 			</tr>
			 		</table>
			 	</td>
			 	<td>
			 		<table class="middel" dir="ltr"  style={"vertical-align: middle ; margin: auto  "} align="center" >
			 			<tr>
			 				<td ><img  src="image/twitter.png" style="height: 50px; width: 50px "  /></td>
			 				<td>Twitter</td>
			 			</tr>
			 		</table>

			 		
			 	</td>
			 </tr>
		</table> */}
		</div>
	);
};

export default FootQRTable;
