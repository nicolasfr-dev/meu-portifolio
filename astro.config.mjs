// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// TODO: troque pelo domínio final (usado em canonical, hreflang e Open Graph)
	site: 'https://nicolasfreire.dev',
	i18n: {
		defaultLocale: 'pt',
		locales: ['pt', 'en'],
		routing: { prefixDefaultLocale: false },
	},
	// Fontes baixadas no build e servidas pelo próprio site (sem bloquear no Google Fonts)
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Barlow Condensed',
			cssVariable: '--font-display',
			weights: [600, 800, 900],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['Arial Narrow', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Barlow',
			cssVariable: '--font-body',
			weights: [400, 500, 600],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			// serifada das falas e escolhas, como nas caixas de diálogo do jogo
			provider: fontProviders.google(),
			name: 'Spectral',
			cssVariable: '--font-talk',
			weights: [500, 600],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['Georgia', 'serif'],
		},
	],
});
