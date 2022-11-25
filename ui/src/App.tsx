import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import DataProvider from './store/DataProvider';
import Clients from './pages/Clients';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { stepIconClasses } from '@mui/material/StepIcon';

export default function App() {
	const theme = createTheme({
		palette: {
			primary: {
				main: '#2f5fff',
			},
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: 'none',
						padding: '8px 16px',
						borderRadius: 8,
						fontSize: '0.825em',
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					input: {
						padding: '8px 12px',
					},
					root: {
						borderRadius: 8,
					},
				},
			},
			MuiStepIcon: {
				styleOverrides: {
					root: {
						[`&.${stepIconClasses.completed}`]: {
							color: 'green',
						},
					},
				},
			},
		},
	});
	return (
		<div className='App'>
			<ThemeProvider theme={theme}>
				<DataProvider>
					<Routes>
						<Route path='/' element={<Clients />} />
						<Route path='/Clients' element={<Clients />} />
					</Routes>
				</DataProvider>
			</ThemeProvider>
		</div>
	);
}
