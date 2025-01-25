import React from 'react';
import { useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { HGridFormDatePicker } from '@hybrain/mui.ui.formik.grid.h-grid-form-date-picker';

import BasePagination from 'components/navigation/BasePagination';
import BaseForm from 'components/form/BaseForm';
import { dateTimeFormat } from 'helpers/utils/date';
import CompanyNewsUpdateModel from 'types/company-news-update.model';
import BaseButton from 'components/inputs/BaseButton';
import useApi from 'hooks/useApi';

interface NewsAndUpdatesPageProps {}

const NewsAndUpdatesPage: React.FC<NewsAndUpdatesPageProps> = () => {
	const navigate = useNavigate();

	const { data: news, callApi } = useApi<CompanyNewsUpdateModel[]>({
		url: 'company-news-updates/client',
	});

	const handleSubmit = (values: any) => {
		callApi({ params: values });
	};

	return (
		<div className="container mx-auto py-10 px-5">
			<Typography fontSize={35} fontWeight="bold">
				News and Updates
			</Typography>

			<BaseForm initialValues={{ startDate: '', endDate: '' }} onSubmit={handleSubmit} noSubmitButton className="mt-3">
				<Grid container spacing={3}>
					<HGridFormDatePicker name="startDate" label="Start Date" md={3} size="small" />
					<HGridFormDatePicker name="endDate" label="End Date" md={3} size="small" />
					<Grid item xs={12} md={2}>
						<BaseButton type="submit" height="39px" width="120px">
							Filter
						</BaseButton>
					</Grid>
				</Grid>
			</BaseForm>

			<BasePagination
				variant="outlined"
				items={news}
				render={(items) => (
					<div className="mt-5 flex flex-col gap-y-4">
						{items.map((item, index) => (
							<Paper
								elevation={3}
								className="p-3 cursor-pointer"
								key={index}
								sx={{
									transition: '.3s',
									':hover': { boxShadow: 5 },
								}}
								onClick={() => navigate('/news-and-updates/' + item.Slug)}
							>
								<div className="flex gap-x-4">
									<img className="w-40 h-40 object-cover object-center" src={item.ImagePath} alt="" />

									<div>
										<div className="text-neutral-500">
											{dateTimeFormat(item.PublicationDate)} | {item.CreatedBy}
										</div>
										<div className="text-lg font-bold mt-1">{item.Title}</div>
										<div className="mt-1.5" dangerouslySetInnerHTML={{ __html: item.PreContent }} />
									</div>
								</div>
							</Paper>
						))}
					</div>
				)}
			/>
		</div>
	);
};

export default NewsAndUpdatesPage;
