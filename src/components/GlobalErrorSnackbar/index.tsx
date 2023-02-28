import React, { useContext } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { StateContext, DispatchContext } from "../../context";
import * as Actions from "../../context/Actions";

export default function GlobalErrorSnackbar() {
	const appstate = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	const { globalSnackbar } = appstate;
	const { message = "Oops!! Somthing went wrong", show = false } =
		globalSnackbar;

	const handleClose = () => {
		appDispatch(
			Actions.setGlobalSnackbar({
				message: null,
				show: false,
			})
		);
	};

	return (
		<div>
			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				open={show}
				autoHideDuration={5 * 1000}
				onClose={() => handleClose()}
				message="Note archived"
			>
				{/* {message} */}
				<Alert variant="filled" onClose={() => handleClose()} severity="error">
					{message}
				</Alert>
			</Snackbar>
		</div>
	);
}
