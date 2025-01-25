import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import { darken, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import clsx from 'clsx';

import LayoutStore from '../../../stores/LayoutStore';
import useSize from '../../../hooks/useSize';
import CompanyStore from '../stores/CompanyStore';
import { observer } from 'mobx-react-lite';
import useDebounce from 'hooks/useDebounce';
import api from 'api';
import SearchStore from '../stores/SearchStore';

export interface NavbarLinkPropsChildren {
	label: string;
	path: string;
	imagePath?: string;
}

export interface NavbarLinkProps {
	label: string;
	onClick?: () => void;
	href?: boolean;
	children?: NavbarLinkPropsChildren[];
}

export interface MainNavbarProps {
	buttons?: NavbarLinkProps[];
}

const Root = styled('div')({
	display: 'flex',
	justifyContent: 'space-between',
	flexDirection: 'column',
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	// right: `${(1 / 7) * 100}vw`,
	padding: '20px 30px 0px 30px',
	backgroundColor: '#fff',
	boxShadow: '1px 5px 10px rgba(0,0,0,0.2)',
	zIndex: 500,

	'@media screen and (min-width: 768px)': {
		flexDirection: 'row',
	},

	'@media screen and (min-width: 810px)': {
		paddingLeft: '80px',
	},
});

const Image = styled('img')({
	// width: '100%',
	cursor: 'pointer',
	maxHeight: '110px',
	objectFit: 'contain',
	objectPosition: 'center',
	// display: 'inline',

	// '@media screen and (max-width: 375px)': {
	// 	display: 'none',
	// },
});

const NavbarLink = styled('div')({
	fontSize: '18px',
	fontWeight: 600,
	padding: '5px',
	cursor: 'pointer',
});

const HamburgerContainer = styled('div')({
	display: 'flex',
	alignItems: 'center',
	marginLeft: 'auto',
	width: '20px',
	height: '15px',
	cursor: 'pointer',
});

const HamburgerMenu = styled(Paper)({
	position: 'absolute',
	top: 'calc(100% - 1px)',
	right: 0,
	boxShadow: '1px 5px 10px rgba(0,0,0,0.2)',
	transform: 'translateX(100%)',
	transition: '.3s',

	'&.active': {
		transform: 'translateX(0)',
	},
});

const Hamburger = styled('div')(({ theme }) => ({
	position: 'relative',
	width: '100%',
	height: '2px',
	backgroundColor: theme.palette.primary.main,

	'&:before, &:after': {
		content: '""',
		position: 'absolute',
		left: 0,
		right: 0,
		height: '2px',
		backgroundColor: theme.palette.primary.main,
	},

	'&:before': {
		top: '-6px',
	},

	'&:after': {
		top: '6px',
	},
}));

const MenuList = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	padding: '15px 0',
});

const MenuItem = styled('div')(({ theme }) => ({
	padding: '15px 30px',
	color: 'theme.palette.primary.main',
	fontWeight: 600,
}));

const SearchBar = styled('input')({
	width: '100%',
	height: '25px',
	border: '2px solid #D3D3D3',
	borderRadius: '3px',
	padding: '6px 10px',
	outline: 'none',
	marginBottom: '25px',
	transition: '.2s',
	maxWidth: '100%',

	'@media screen and (min-width: 1050px)': {
		width: '300px',
	},

	'&:focus': {
		borderColor: darken('#d3d3d3', 0.3),
	},
});

const StyledListItemButton = styled(ListItemButton)({
	'& span': {
		fontWeight: 'bold',
	},
});

const NavbarLinkWrapper = styled('div')({
	position: 'relative',
	paddingBottom: 5,

	'&:hover .menu': {
		display: 'flex',
	},
});

const NavbarLinkMenu = styled('div')({
	position: 'absolute',
	top: '100%',
	left: 0,
	display: 'none',
	flexDirection: 'column',
	zIndex: 50,
	paddingTop: 8,
	paddingBottom: 8,
	backgroundColor: 'white',
	borderRadius: 8,
	boxShadow: '3px 3px 7px rgba(0,0,0,0.2)',
	maxHeight: '500px',
	overflowY: 'auto',
});

const SubMenuItem = styled('div')<{ selected?: boolean }>(({ selected, theme }) => ({
	// color: selected ? '#a7a9ac' : theme.palette.secondary.main,
	fontWeight: 600,
	fontSize: 16,
	cursor: 'pointer',
	padding: '6px 20px',
	margin: '2px 0',
	whiteSpace: 'nowrap',
}));

const NavbarLinkComponent = ({
	label,
	onClick,
	children,
	setOpenMenu,
	href,
}: NavbarLinkProps & { setOpenMenu: (payload: boolean) => void }) => {
	const navigate = useNavigate();
	const anchorRef = React.useRef<HTMLDivElement>(null);
	const { pathname } = useLocation();

	const handleClickNavbarLink = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		setOpenMenu(false);
		onClick?.();
	};

	return (
		<NavbarLinkWrapper>
			<NavbarLink ref={anchorRef} onClick={children ? undefined : handleClickNavbarLink}>
				{label}
			</NavbarLink>
			{children && (
				<NavbarLinkMenu className="menu">
					{children.map(({ label, path }, index) => (
						<SubMenuItem
							onClick={() => {
								if (href) {
									window.location.href = path;
								} else {
									navigate(path);
								}
							}}
							key={index}
							sx={{ minWidth: 200 }}
							selected={pathname === path}
						>
							{label}
						</SubMenuItem>
					))}
				</NavbarLinkMenu>
			)}
		</NavbarLinkWrapper>
	);
};

const MobileNavbarLinkComponent = ({
	label,
	onClick,
	children,
	setOpenMenu,
	href,
}: NavbarLinkProps & { setOpenMenu: (payload: boolean) => void }) => {
	const navigate = useNavigate();
	const [openSubMenu, setOpenSubMenu] = useState(false);

	const handleClickMenuItem = () => {
		onClick?.();

		if (!children) {
			setOpenMenu(false);
		}

		if (children) {
			setOpenSubMenu(true);
		}

		if (children && openSubMenu) {
			setOpenSubMenu(false);
		}
	};

	return (
		<>
			<MenuItem onClick={handleClickMenuItem}>
				<div>{label}</div>
			</MenuItem>

			<Collapse in={openSubMenu} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{children?.map(({ label, path }, index) => (
						<StyledListItemButton
							sx={{ pl: 6 }}
							key={index}
							onClick={() => {
								if (href) {
									window.location.href = path;
								} else {
									navigate(path);
									setOpenMenu(false);
								}
							}}
						>
							<ListItemText className="font-bold">{label}</ListItemText>
						</StyledListItemButton>
					))}
				</List>
			</Collapse>
		</>
	);
};

const MainNavbar: React.FC<MainNavbarProps> = ({ buttons }) => {
	const navigate = useNavigate();
	const desktop = useMediaQuery('(min-width:1500px)');
	const [openMenu, setOpenMenu] = useState(false);
	const navbarRef = React.useRef<HTMLDivElement>(null);
	const size = useSize(navbarRef);
	const [search, setSearch] = useState('');

	useDebounce(
		() => {
			if (!search) return;

			SearchStore.setLoading(true);
			navigate('/search');

			api()
				.get('search-all', { params: { search } })
				.then(({ data }) => {
					SearchStore.setItems(data.response);
				})
				.finally(() => {
					SearchStore.setLoading(false);
				});
		},
		500,
		[search]
	);

	useEffect(() => {
		LayoutStore.setNavbarHeight(size.height + 20);
	}, [size]);

	return (
		<Root ref={navbarRef} className="gap-6">
			{desktop && (
				<>
					<Image
						src={CompanyStore.company?.ProductLogoPath}
						alt="logo"
						onClick={() => {
							navigate('/');
							LayoutStore.scrollToContent('banner');
						}}
					/>

					<div>
						<div className="flex justify-end">
							<SearchBar placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
						</div>
						<div className="flex gap-x-8 items-end">
							{buttons?.map((button, index) => (
								<NavbarLinkComponent key={index} {...button} setOpenMenu={setOpenMenu} />
							))}
						</div>
					</div>
				</>
			)}

			{!desktop && (
				<>
					<div className="flex flex-grow items-center">
						<Image
							className="w-16 m-2 p-2"
							src={CompanyStore.company?.ProductLogoPath}
							alt="logo"
							onClick={() => {
								navigate('/');
								LayoutStore.scrollToContent('banner');
							}}
						/>
						<div className="flex flex-grow justify-end mr-2 ml-1">
							<SearchBar
								placeholder="Search..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								sx={{ marginBottom: '0px !important' }}
							/>
						</div>
						<HamburgerContainer onClick={() => setOpenMenu(!openMenu)}>
							<Hamburger />
						</HamburgerContainer>
					</div>

					<HamburgerMenu elevation={0} className={clsx('rounded-none', { active: openMenu })}>
						<MenuList>
							{buttons?.map((button, index) => (
								<MobileNavbarLinkComponent {...button} setOpenMenu={setOpenMenu} key={index} />
							))}
						</MenuList>
					</HamburgerMenu>
				</>
			)}
		</Root>
	);
};

export default observer(MainNavbar);
