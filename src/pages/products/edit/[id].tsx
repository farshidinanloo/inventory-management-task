import Link from 'next/link';
import { useRouter } from 'next/router';
import {
	Container,
	Typography,
	TextField,
	Button,
	Box,
	Paper,
	Alert,
} from '@mui/material';
import { useProductEdit } from '@/hooks';
import { LoadingSkeleton, ErrorDisplay } from '@/components';

export default function EditProduct() {
	const router = useRouter();
	const { id } = router.query;
	
	const { 
		formData, 
		handleChange, 
		handleSubmit, 
		isLoading, 
		isError, 
		fetchError, 
		isUpdating, 
		updateError 
	} = useProductEdit(id as string);

	if (isLoading) {
		return (
			<>
				<Container sx={{ mt: 4, mb: 4 }}>
					<LoadingSkeleton />
				</Container>
			</>
		);
	}

	if (isError) {
		return (
			<>
				<Container sx={{ mt: 4, mb: 4 }}>
					<ErrorDisplay error={fetchError?.message || 'An error occurred'} />
				</Container>
			</>
		);
	}

	return (
		<>
			<Container maxWidth='sm' sx={{mt: 4, mb: 4}}>
				<Paper elevation={3} sx={{p: 4}}>
					<Typography variant='h4' component='h1' gutterBottom>
						Edit Product
					</Typography>
					
					{updateError && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{updateError?.message || 'An error occurred while updating the product'}
						</Alert>
					)}
					
					<Box component='form' onSubmit={handleSubmit} noValidate sx={{mt: 2}}>
						<TextField
							margin='normal'
							required
							fullWidth
							label='SKU'
							name='sku'
							value={formData.sku}
							onChange={handleChange}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							label='Product Name'
							name='name'
							value={formData.name}
							onChange={handleChange}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							label='Category'
							name='category'
							value={formData.category}
							onChange={handleChange}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							label='Unit Cost'
							name='unitCost'
							type='number'
							inputProps={{step: '0.01', min: '0'}}
							value={formData.unitCost}
							onChange={handleChange}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							label='Reorder Point'
							name='reorderPoint'
							type='number'
							inputProps={{min: '0'}}
							value={formData.reorderPoint}
							onChange={handleChange}
						/>
						<Box sx={{mt: 3, display: 'flex', gap: 2}}>
							<Button
								type='submit'
								fullWidth
								variant='contained'
								color='primary'
								disabled={isUpdating}
							>
								{isUpdating ? 'Updating...' : 'Update Product'}
							</Button>
							<Button
								fullWidth
								variant='outlined'
								component={Link}
								href='/products'
							>
								Cancel
							</Button>
						</Box>
					</Box>
				</Paper>
			</Container>
		</>
	);
}
