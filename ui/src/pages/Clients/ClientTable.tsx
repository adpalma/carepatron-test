import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClientRow from './ClientRow';

const styles = {
	bold: {
		fontWeight: 'bold',
	},
};

export interface IProps {
	clients: IClient[];
	onUpdate?: (client: IClient) => void 
}

export default function BasicTable({ clients, onUpdate }: IProps) {
	const handleUpdate = (client: IClient) => {
		if (onUpdate) {
			onUpdate(client)
		}
	}
	return (
		<TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
			<Table sx={{ minWidth: 400 }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell sx={styles.bold}>Name</TableCell>
						<TableCell sx={styles.bold}>Phone</TableCell>
						<TableCell sx={styles.bold}>Email</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{clients.map((client) => (
						<ClientRow key={client.id} client={client} onUpdate={() => handleUpdate(client)}/>
					))}
					{!clients ||
						(!clients.length && (
							<TableRow sx={{ padding: 3 }}>
								<TableCell component='th' scope='row'>
									No clients
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
