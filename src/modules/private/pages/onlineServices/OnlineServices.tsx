import React, { useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { Grid } from '@mui/material';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import BaseActions from '../../../../components/layout/BaseActions';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button } from '@mui/material';
import noImage from '../../../../assets/images/no-image.png';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';

interface OnlineServicesProps {}

const OnlineServices: React.FC<OnlineServicesProps> = () => {
	const [openFormDialog, setOpenFormDialog] = useState(false);
	return (
		<Page title="Online Services">
			<HForm
				dialog
				enableReinitialize
				initialValues={{
					ImagePath: '',
					isPublished: false,
				}}
				onSubmit={(values) => {}}
			>
				<Grid container spacing={1} className="flex flex-col flex-grow  mb-6">
					<div className="font-bold text-2xl mx-2 my-3">{'Online Services'}</div>
					<Grid item xs={12} className="flex flex-col flex-grow">
						<div>
							{/* <HImageContainer className={classes.Image} name="ImagePath" /> */}
							{/* <label className="flex justify-center" htmlFor="upload-file"> */}
							<HFormFileInput className="hidden" id="upload-file" name="ImagePath" label="File" />
							{/* <UploadButton onClick={() => document.getElementById('upload-file')?.click()} /> */}
							{/* </label> */}
						</div>
					</Grid>
					<Grid item xs={12} md={12} spacing={6}>
						<HFormCheckbox checked name="isPublished" label="is Published" />
					</Grid>
				</Grid>
			</HForm>
			<HTable
				rowsPerPage={10}
				withSearch
				headerActions={
					<BaseButton
						onClick={() => {
							setOpenFormDialog(true);
						}}
					>
						<AddBoxIcon />
						Subcontent
					</BaseButton>
				}
				headers={[
					{
						label: '',
						value: 'IMGPath',
						render: (item) => (
							<img src={item.IMGPath ? process.env.REACT_APP_IMAGE_URL + item.IMGPath : noImage} alt="" className="w-20" />
						),
					},
					{ label: 'Name', value: 'name' },
					{ label: 'Company', value: 'company' },
					{
						label: 'Published',
						value: 'isPublished',
						render: (item) => (
							<div>
								<HCheckbox label="" checked={item.isPublished}></HCheckbox>
							</div>
						),
					},
				]}
				items={[
					{
						name: 'Welnness',
						company: 'Company 1',
						isPublished: true,
						IMGPath: null,
					},
					{
						name: 'Corporate Health',
						company: 'Company 1',
						isPublished: true,
						IMGPath: null,
					},
					{
						name: 'Appointment',
						company: 'Company 1',
						isPublished: true,
						IMGPath: null,
					},
					{
						name: 'Step 1',
						company: 'Company 2',
						isPublished: true,
						IMGPath: null,
					},
					{
						name: 'Step 2',
						company: 'Company 2',
						isPublished: true,
						IMGPath: null,
					},
					{
						name: 'Step 3',
						company: 'Company 2',
						isPublished: true,
						IMGPath: null,
					},
				]}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						<Button variant="outlined">Remove</Button>
						<Button
							variant="outlined"
							onClick={() => {
								setOpenFormDialog(true);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>
			<HDialog
				maxWidth="lg"
				title="Online Services SubContent Create/Edit"
				open={openFormDialog}
				onClose={() => {
					setOpenFormDialog(false);
				}}
			>
				<HForm
					dialog
					// loading={loadingDialog}
					initialValues={{
						ImagePathDialog: '',
						Content: '',
						isPublished: false,
					}}
					onSubmit={async (values) => {
						console.log(values);
						setOpenFormDialog(false);
					}}
				>
					<Grid container rowSpacing={2} columnSpacing={5}>
						<Grid item xs={12} md={4}>
							<div>
								{/* <HImageContainer className={classes.Imagedialog} name="ImagePathDialog" /> */}
								{/* <label className="flex justify-center" htmlFor="upload-fileDialog"> */}
								<HFormFileInput className="hidden" id="upload-fileDialog" name="ImagePathDialog" label="File" />
								{/* <UploadButton onClick={() => document.getElementById('upload-fileDialog')?.click()} /> */}
								{/* </label> */}
							</div>
						</Grid>
						<Grid item xs={12} md={8}>
							<HGridFormTextField size="medium" name="Content" label="content" multiline rows={13} xs={12} />
							<Grid item xs={12} md={12} spacing={6}>
								<HFormCheckbox checked name="isPublished" label="is Published" />
							</Grid>
						</Grid>
					</Grid>
				</HForm>
			</HDialog>
		</Page>
	);
};

export default OnlineServices;
