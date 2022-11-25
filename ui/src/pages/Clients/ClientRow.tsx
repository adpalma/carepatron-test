import { TableCell, TableRow } from '@mui/material';


const styles = {
	name: {
		fontWeight: 'bold',
		color: '#2f5fff',
	},
};

export interface IProps {
	client: IClient;
	onUpdate?: (client: IClient) => void 
}

export default function ClientListItem({ client, onUpdate }: IProps) {
	const { id, firstName, lastName, email, phoneNumber } = client;

	const handleUpdate = () => {
		if (onUpdate) {
			onUpdate(client)
		}
	}
	
	return (
		<TableRow
			key={id}
			sx={{
				'&:last-child td, &:last-child th': { border: 0 },
				cursor: 'pointer',
				'&:hover': {
					backgroundColor: '#f5f5f5',
				},
			}}
		>
			<TableCell component='th' scope='row' sx={styles.name} onClick={handleUpdate}>
				{firstName} {lastName}
			</TableCell>
			<TableCell>{phoneNumber}</TableCell>
			<TableCell>{email}</TableCell>
		</TableRow>
	);
}
