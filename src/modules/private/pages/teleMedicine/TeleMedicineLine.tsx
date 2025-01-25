import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { Button, Grid, Tooltip } from '@mui/material';
import api from 'api/api';
import BaseButton from 'components/inputs/BaseButton';
import Page from 'components/layout/Page';
import React, { useCallback, useEffect, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import noImage from '../../../../assets/images/no-image.png';
import BaseActions from 'components/layout/BaseActions';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';

interface TeleMedicineLineProps {}

const TeleMedicineLine: React.FC<TeleMedicineLineProps> = () => {
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [loadingDialog, setLoadingDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [telemedLine, setTeleMedLine] = useState<any[]>(() => []);
	const [selectedTeleMedLine, setSelectedTeleMedLine] = useState<any>(() => ({} as any));
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('tele-medicine-lines')
			.then(({ data }) => {
				setTeleMedLine(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	useEffect(() => {
		initialize();
	}, [initialize]);

	const handleSubmit = async (values: any) => {
		setLoadingDialog(true);
		try {
			const formData = new FormData();
			Object.keys(values).forEach((property) => {
				if (property === 'ImagePath') {
					formData.append('ImagePath', values.ImagePath);
				} else {
					formData.append(property, values[property]);
				}
			});
			formData.append('TeleMedicineID', '1');
			Object.keys(selectedTeleMedLine).length > 0
				? await api().patch<any[]>('tele-medicine-lines/' + selectedTeleMedLine.TeleMedicineLineID, formData)
				: await api().post<any[]>('tele-medicine-lines', formData);
			setOpenFormDialog(false);
			initialize();
		} finally {
			setLoadingDialog(false);
		}
	};

	return (
		<Page title="TeleMedicine Services">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'TeleMedicine Services'}</div>
				</Grid>
			</Grid>
			<HTable
				rowsPerPage={10}
				withSearch
				headerAlign="left"
				loading={loading}
				headerActions={
					<BaseButton
						onClick={() => {
							setOpenFormDialog(true);
							setSelectedTeleMedLine({} as any);
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: '', value: 'ImagePath', render: (item) => <img src={item.ImagePath ?? noImage} alt="" className="w-20" /> },
					{
						label: 'Content',
						value: 'Content',
						render: (item) => (
							<Tooltip title={item.Content}>
								<div className="truncate w-80">{item.Content}</div>
							</Tooltip>
						),
					},
					{
						label: 'Published',
						value: 'isPublished',
						render: (item) => <div>{<HCheckbox label="" checked={item.isPublished}></HCheckbox>}</div>,
					},
				]}
				items={telemedLine}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedTeleMedLine(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								setOpenFormDialog(true);
								setSelectedTeleMedLine(item);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>

			<HDialog
				maxWidth="md"
				title={Object.keys(selectedTeleMedLine).length > 0 ? 'Edit TeleMedicine Services' : 'Add TeleMedicine Services'}
				open={openFormDialog}
				onClose={() => setOpenFormDialog(false)}
			>
				<HForm
					dialog
					loading={loadingDialog}
					enableReinitialize
					initialValues={{
						ImagePath: Object.keys(selectedTeleMedLine).length > 0 ? selectedTeleMedLine.ImagePath : '',
						Content: Object.keys(selectedTeleMedLine).length > 0 ? selectedTeleMedLine.Content : '',
						isPublished: Object.keys(selectedTeleMedLine).length > 0 ? !!selectedTeleMedLine.isPublished : false,
						isActive: Object.keys(selectedTeleMedLine).length > 0 ? !!selectedTeleMedLine.isActive : true,
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<Grid item xs={12} className="flex flex-col flex-grow">
							<div>
								<HFormFileInput
									button
									name="ImagePath"
									label="File"
									inputProps={{ accept: 'image/*' }}
									validateBeforeUpload={(value) => {
										let file = value;
										let reader = new FileReader();
										reader.readAsDataURL(value);
										let fileType = file.type.split('/')[0];
										if (fileType !== 'image') {
											return 'Please select a valid image file.';
										} else {
											return undefined;
										}
									}}
								/>
							</div>
						</Grid>
						<HGridFormTextField size="small" name="Content" label="Content" xs={12} multiline rows={7} />
						<Grid item xs={12} md={4}>
							<HFormCheckbox name="isActive" label="Active" />
						</Grid>
						<Grid item xs={12} md={4}>
							<HFormCheckbox name="isPublished" label="Published" />
						</Grid>
					</Grid>
				</HForm>
			</HDialog>

			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="Telemedicine Line"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('tele-medicine-lines/' + selectedTeleMedLine.TeleMedicineLineID);
							setOpenDeleteDialog(false);
							initialize();
						} catch {}
					} catch {
						setOpenDeleteDialog(true);
					}
				}}
			>
				Are you sure you want to remove this item?
			</HConfirmationDialog>
		</Page>
	);
};

export default TeleMedicineLine;
