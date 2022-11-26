import { memo, useContext, useEffect, useState } from 'react';
import { Button, Icon, Grid, InputAdornment, OutlinedInput, Paper, Typography, useTheme, useMediaQuery, Hidden, IconButton } from '@mui/material';
import { StateContext } from '../../store/DataProvider';
import Page from '../../components/Page';
import ClientTable from './ClientTable';
import { getClients, createClient, updateClient } from '../../services/api';
import { Add, Search } from '@mui/icons-material';
import ClientModal from '../../components/Client/Modal';

function Clients() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const { state, dispatch } = useContext(StateContext);
	const { clients } = state;
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [filteredClients, setFilteredClients] = useState(clients);
	const [selectedClient, setSelectedClient] = useState(clients[0]);
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

	const handleCloseCreateModal = () => {
		setOpenCreateModal(false);
	};

	const handleOpenCreateModal = () => {
		setOpenCreateModal(true);
	};

	const handleCloseUpdateModal = () => {
		setOpenUpdateModal(false);
	};

	const handleOpenUpdateModal = (client: IClient) => {
		setSelectedClient(client);
		setOpenUpdateModal(true);
	};

	const handleCreateClient = (client: IClient) => {
		createClient(client).then((c) => dispatch({ type: 'CREATE_CLIENT', data: c }));
	};

	const handleUpdateClient = (client: IClient) => {
		updateClient(client).then(() => {
			getClients().then((clients) => dispatch({ type: 'FETCH_ALL_CLIENTS', data: clients }));
			return dispatch({ type: 'UPDATE_CLIENT', data: null })
		});
	};

	return (
		<Page styles={{padding: isMobile ? '0 16px ' : 0, marginTop: isMobile ? 24 : 48}}>
			<Typography variant='h4' sx={{ textAlign: 'start' }} style={{ fontWeight: 'bold' }}>
				Clients
			</Typography>
			<Grid container sx={{ justifyContent: 'space-between', marginTop: '16px' }}>
				<Grid item>
					<OutlinedInput
						placeholder='Search clients...'
						style={{ background: 'white', color: 'black', width: isMobile ? 200 : 'auto' }}
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
				<Grid item>
					<Hidden only={['xs']}>
						<Button variant='contained' onClick={handleOpenCreateModal}>
							Create new client
						</Button>
					</Hidden>
					<Hidden smUp>
						<IconButton onClick={handleOpenCreateModal} style={{padding: 0}}>
							<Add color="primary" fontSize="large"/>
						</IconButton>
					</Hidden>
				</Grid>
			</Grid>
			<Paper sx={{ margin: 'auto', marginTop: 3 }}>
				<ClientTable clients={filteredClients} onUpdate={handleOpenUpdateModal}/>
			</Paper>
			<ClientModal open={openCreateModal} onClose={handleCloseCreateModal} onComplete={handleCreateClient} type="create" />
			<ClientModal open={openUpdateModal} onClose={handleCloseUpdateModal} onComplete={handleUpdateClient} type="update" client={selectedClient}/>
		</Page>
	);
}

export default memo(Clients);
