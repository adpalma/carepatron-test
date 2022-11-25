import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
	Box,
	Button,
	Grid,
	IconButton,
	InputLabel,
	Modal,
	OutlinedInput,
	Stack,
	Step,
	Stepper,
	StepButton,
	Typography,
	StepLabel,
} from '@mui/material';
import { ArrowBack, Close } from '@mui/icons-material';
import { toCamelCase } from '../../utils';

const styles = {
	modal: {
		position: 'absolute' as 'absolute',
		top: '45%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		bgcolor: 'background.paper',
		boxShadow: 24,
		p: 4,
		borderRadius: 2,
	},
	header: {
		justifyContent: 'space-between',
	},
	actions: {
		justifyContent: 'space-between',
		marginTop: '48px',
	},
	label: {
		fontSize: '0.75rem',
	},
	stepper: {
		margin: '16px -8px',
	},
};

const steps = ['Personal details', 'Contact details'];

type CloseHandler = () => void;
type CompleteHandler = (client: IClient) => void;

type CommonProps = {
	open: boolean;
	onClose: CloseHandler;
	onComplete: CompleteHandler;
};

type ConditionalProps =
	| {
			type: 'create';
			client?: never;
		}
	| {
			type: 'update';
			client: IClient;
		};

type ModalProps = CommonProps & ConditionalProps;

const ClientModal: React.FC<ModalProps> = ({ open, onClose, onComplete, type, client }: ModalProps) => {
	const [activeStep, setActiveStep] = React.useState(0);
	const [completed, setCompleted] = React.useState<{
		[k: number]: boolean;
	}>({});
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [errors, setErrors] = useState({
		firstName: false,
		lastName: false,
		email: false,
		phoneNumber: false,
	});
	const totalSteps = steps.length;

	useEffect(() => {
		if (client) {
			setFirstName(client.firstName);
			setLastName(client.lastName);
			setEmail(client.email);
			setPhoneNumber(client.phoneNumber);
		}
	}, [client])

	const handleStep = (step: number) => () => {
		setActiveStep(step);
	};

	const isLastStep = () => {
		return activeStep === totalSteps - 1;
	};

	const validateFields = () => {
		const newErrors = {
			firstName: false,
			lastName: false,
			email: false,
			phoneNumber: false,
		};

		if (activeStep === 0) {
			if (firstName.trim() === '') {
				newErrors.firstName = true;
			}
			if (lastName.trim() === '') {
				newErrors.lastName = true;
			}
		}

		if (activeStep === 1) {
			if (email.trim() === '') {
				newErrors.email = true;
			}
			if (phoneNumber.trim() === '') {
				newErrors.phoneNumber = true;
			}
		}

		setErrors(newErrors);
		return Object.values(newErrors).some((i) => i);
	};

	const resetFields = () => {
		setFirstName('');
		setLastName('');
		setEmail('');
		setPhoneNumber('');
		setActiveStep(0);
	};

	const handleNext = () => {
		const hasErrors = validateFields();
		if (hasErrors) {
			return;
		}
		if (!isLastStep()) {
			setActiveStep(activeStep + 1);
		} else if (isLastStep()) {
			if (type === 'create') {
				const id = uuidv4();
				const newClient: IClient = {
					id,
					firstName,
					lastName,
					email,
					phoneNumber,
				};
				onComplete(newClient);
			} else {
				const newClient: IClient = {
					id: client.id,
					firstName,
					lastName,
					email,
					phoneNumber,
				};
				onComplete(newClient!);
			}
			resetFields();
			onClose();
		}
	};

	const handleBack = () => {
		if (activeStep > 0) {
			setActiveStep(activeStep - 1);
		}
	};

	const handleClose = (event: object, reason: string) => {
		if (reason === 'backdropClick') {
			return;
		}
		resetFields();
		onClose();
	};

	const renderStepper = () => (
		<Stepper activeStep={activeStep} sx={styles.stepper}>
			{steps.map((label, index) => (
				<Step key={label} completed={completed[index]} disabled onClick={() => null}>
					<StepButton>
						<StepLabel onClick={handleStep(index)}>{label}</StepLabel>
					</StepButton>
				</Step>
			))}
		</Stepper>
	);

	const renderPersonalDetails = () => (
		<Stack spacing={2}>
			<Stack>
				<InputLabel sx={styles.label}>First name</InputLabel>
				<OutlinedInput
					required
					aria-required
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					error={errors.firstName}
				/>
			</Stack>
			<Stack>
				<InputLabel sx={styles.label}>Last name</InputLabel>
				<OutlinedInput
					required
					aria-required
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					error={errors.lastName}
				/>
			</Stack>
		</Stack>
	);

	const renderContactDetails = () => (
		<Stack spacing={2}>
			<Stack>
				<InputLabel sx={styles.label}>Email</InputLabel>
				<OutlinedInput
					required
					aria-required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					error={errors.email}
				/>
			</Stack>
			<Stack>
				<InputLabel sx={styles.label}>Phone number</InputLabel>
				<OutlinedInput
					required
					aria-required
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					error={errors.phoneNumber}
				/>
			</Stack>
		</Stack>
	);

	return (
		<Modal open={open} onClose={handleClose} hideBackdrop>
			<Box sx={styles.modal}>
				<Grid container style={styles.header}>
					<Grid item>
						<Typography id='modal-modal-title' variant='h6' component='h2'>
							{type === 'create' ? 'Create new client' : 'Update client'}
						</Typography>
					</Grid>
					<Grid item>
						<IconButton onClick={onClose}>
							<Close />
						</IconButton>
					</Grid>
				</Grid>
				{renderStepper()}
				{activeStep === 0 ? renderPersonalDetails() : renderContactDetails()}
				<Grid container sx={styles.actions}>
					<Grid item alignContent='center'>
						{activeStep > 0 && (
							<Button
								variant='text'
								onClick={handleBack}
								sx={{ padding: '8px 0', backgroundColor: 'transparent' }}
								disableFocusRipple
								disableRipple
							>
								<ArrowBack sx={{ marginRight: '4px' }} /> Back
							</Button>
						)}
					</Grid>
					<Grid item>
						<Button variant='contained' onClick={handleNext}>
							{isLastStep() ? `${toCamelCase(type)} client` : 'Continue'}
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Modal>
	);
};

export default ClientModal;
