import { makeAutoObservable } from 'mobx';
import CompanyModel from 'types/company.model';

class CompanyStore {
	company: CompanyModel = {} as CompanyModel;

	constructor() {
		makeAutoObservable(this);
	}

	update(payload: CompanyModel) {
		this.company = payload;
	}
}

export default new CompanyStore();
