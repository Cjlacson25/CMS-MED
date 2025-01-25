import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
	interface Palette {
		yellow?: {
			dark?: string;
			main?: string;
			light?: string;
		};
	}
	interface PaletteOptions {
		yellow?: {
			dark?: string;
			main?: string;
			light?: string;
		};
	}
}

const theme = ({ palette, typography, ...props }: Partial<Theme>) => {
	return createTheme({
		palette: {
			primary: {
				dark: '#fdb8099b',
				main: palette?.primary?.main ?? '#8cb93d',
				light: '#fac849',
			},
			secondary: {
				dark: '#4fc6cc94',
				main: palette?.secondary?.main ?? '#4fc6cc',
				light: '#5be3eb',
			},
			yellow: {
				dark: '#ff9500',
				main: '#ffa92d',
				light: '#ffb54d',
			},
		},

		typography: {
			fontFamily: 'Noto Sans',
			...(typography as any),
		},

		components: {
			MuiTypography: {
				defaultProps: {
					variantMapping: {
						body2: 'span',
					},
				},
			},
		},
		...props,
	});
};

export default theme;
