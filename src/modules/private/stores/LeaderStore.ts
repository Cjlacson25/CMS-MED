import { makeAutoObservable } from 'mobx';
export interface Leader {
	CompanyID: number;
	CreatedBy: string;
	CreatedDateTime: string;
	CompanyLeaderID: number;
	Content: string;
	ImagePath: string;
	Title: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	isActive: boolean;
	isPublished: boolean;
	ViewType: string;
}

class LeaderStore {
	leader: Leader = {} as Leader;
	constructor() {
		makeAutoObservable(this);
	}
	setLeader(payload: Leader) {
		this.leader = payload;
	}
	setViewType(payload: string) {
		this.leader.ViewType = payload;
	}
}

export default new LeaderStore();
