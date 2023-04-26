import React from "react";
import { Divider, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	divider: {
		background: "linear-gradient(90.08deg, #bc9448 17.21%, #bc9448 129.73%);",
		marginBottom: "15px",
	},
}));

/**
 * @prop {Component}  Hr
 * @materialuiProps
 *  - Divider
 */

const Hr = (props: any) => {
	const { divider } = useStyles();
	return (
		<Divider
			classes={{ root: divider }}
			{...props}
		/>
	);
};

export default Hr;
