import { makeAutoObservable } from 'mobx';
export interface User {
	UserID: number;
	CompanyID: number;
	UserType: string;
	Name: string;
	EmailAddress: string;
	ImagePath: string;
	Username: string;
	Password: string;
	isActive: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	isPublished: boolean;
	accessToken: string;
	Keycode: string;
}

class AuthStore {
	user: User = {} as User;
	constructor() {
		makeAutoObservable(this);
	}
	setUser(payload: User) {
		this.user = payload;
	}

	setName(payload: string) {
		this.user.Name = payload;
	}
	setEmailAddress(payload: string) {
		this.user.EmailAddress = payload;
	}
	setImagePath(payload: string) {
		this.user.ImagePath = payload;
	}
	setaccessToken(payload: string) {
		this.user.accessToken = payload;
	}
}

export default new AuthStore();
