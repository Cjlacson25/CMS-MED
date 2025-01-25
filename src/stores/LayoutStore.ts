import { makeAutoObservable } from 'mobx';

class LayoutStore {
	sidebarOpen: boolean = true;
	scroll_style_element: any = null;
	navbarHeight: number = 0;

	constructor() {
		makeAutoObservable(this);
	}

	toggleSidebar(value: boolean) {
		this.sidebarOpen = value;
	}

	scrollToContent(elementId: string, offset?: number) {
		var div = document.getElementById(elementId);
		window.scrollTo({ behavior: 'smooth', top: (div?.offsetTop ?? 0) - (offset ?? 35) });
	}

	setNavbarHeight(height?: number) {
		this.navbarHeight = height ?? 0;
	}
}

export default new LayoutStore();
