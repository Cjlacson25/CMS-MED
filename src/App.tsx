import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import Routes from './routes';
import theme from './theme';
import 'react-quill/dist/quill.snow.css';

function App() {
	return (
		<ThemeProvider theme={theme({})}>
			<Routes />
		</ThemeProvider>
	);
}

export default App;
