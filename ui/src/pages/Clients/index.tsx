import { memo, useContext, useEffect, useState } from 'react';
import { Button, Icon, Grid, InputAdornment, OutlinedInput, Paper, Typography } from '@mui/material';
import { StateContext } from '../../store/DataProvider';
import Page from '../../components/Page';
import ClientTable from './ClientTable';
import { getClients, createClient } from '../../services/api';
import { Search } from '@mui/icons-material';
import CreateModal from '../../components/Client/Modal';

function Clients() {
	const { state, dispatch } = useContext(StateContext);
	const { clients } = state;
	const [open, setOpen] = useState(false);
	const [filteredClients, setFilteredClients] = useState(clients);
	const [searchString, setSearchString] = useState('');

	const searchClient = (keyword: string) => {
		const newClients = clients.filter(
			(c) =>
				c.firstName.toLowerCase().startsWith(keyword.toLowerCase()) ||
				c.lastName.toLowerCase().startsWith(keyword.toLowerCase())
		);
		setFilteredClients(newClients);
	};

	useEffect(() => {
		getClients().then((clients) => dispatch({ type: 'FETCH_ALL_CLIENTS', data: clients }));
	}, [dispatch]);

	useEffect(() => {
		searchClient(searchString);
	}, [searchString, clients]);

	const closeModal = () => {
		setOpen(false);
	};

	const openModal = () => {
		setOpen(true);
	};

	const handleCreateClient = (client: IClient) => {
		createClient(client).then((c) => dispatch({ type: 'CREATE_CLIENT', data: c }));
	};

	return (
		<Page>
			<Typography variant='h4' sx={{ textAlign: 'start' }} style={{ fontWeight: 'bold' }}>
				Clients
			</Typography>
			<Grid container sx={{ justifyContent: 'space-between', marginTop: '16px' }}>
				<Grid item>
					<OutlinedInput
						placeholder='Search clients...'
						style={{ background: 'white', color: 'black' }}
						endAdornment={
							<InputAdornment position='end'>
								<Icon>
									<Search />
								</Icon>
							</InputAdornment>
						}
						value={searchString}
						onChange={(e) => setSearchString(e.target.value)}
					/>
				</Grid>
				<Grid>
					<Button variant='contained' onClick={openModal}>
						Create new client
					</Button>
				</Grid>
			</Grid>
			<Paper sx={{ margin: 'auto', marginTop: 3 }}>
				<ClientTable clients={filteredClients} />
			</Paper>
			<CreateModal open={open} onClose={closeModal} onComplete={handleCreateClient} />
		</Page>
	);
}

export default memo(Clients);
