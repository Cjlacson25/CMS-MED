interface ResponseModel<T> {
	message: string;
	response: T;
	result_status: string;
}

export default ResponseModel;
