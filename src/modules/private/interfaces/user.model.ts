interface User {
	CompanyID: number;
	UserID: number;
	CreatedBy: string;
	CreatedDateTime: string;
	EmailAddress: string;
	Name: string;
	Password: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	Username: string;
	isActive: boolean;
	UserType: string;
	RePassphrase: string;
}

export default User;
