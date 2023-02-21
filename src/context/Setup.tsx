import React, { FunctionComponent, useReducer } from 'react';
import { StateContext, DispatchContext } from './index';
import { AppContextReducer } from './Reducer';
// import { ThemeProvider } from "@material-ui/core/styles";
// import { theme } from "../theme";
import App from '../App';
import WithAxios from '../network/WithAxios';
import ResponsiveDialog from '../components/ResponsiveDialog';
import { GlobalErrorSnackbar } from '../components';
import { CookiesProvider } from 'react-cookie';

const Setup: FunctionComponent = (): JSX.Element => {
	const [appContextState, appContectDispatch] = useReducer(AppContextReducer, {
		isUserLoggedIn: false,
		info: {},
		loginLoding: false,
		openDialog: false,
		globalSnackbar: {},
	});

	return (
		<CookiesProvider>
			<DispatchContext.Provider value={appContectDispatch}>
				<StateContext.Provider value={appContextState}>
					{/* <ThemeProvider theme={theme}> */}
					{/* <WithAxios> */}
					<>
						<App />
						<ResponsiveDialog />
						{/* <GlobalErrorSnackbar /> */}
					</>
					{/* </WithAxios> */}
					{/* </ThemeProvider> */}
				</StateContext.Provider>
			</DispatchContext.Provider>
		</CookiesProvider>
	);
};

export default Setup;
