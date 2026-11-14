/** Prefixa caminhos absolutos ("/foo") com o `base` do astro.config (ex.: /meu-portifolio). */
export const withBase = (path: string) =>
	path.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + path : path;
