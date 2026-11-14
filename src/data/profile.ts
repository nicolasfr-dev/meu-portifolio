/**
 * ============================================================
 *  PLAYER DATA — edite este arquivo para personalizar o site.
 *  Todo texto visível que é "seu" mora aqui.
 *  Campos bilíngues usam { pt, en }.
 * ============================================================
 */

export type Lang = 'pt' | 'en';
export type L10n = { pt: string; en: string };

export const profile = {
	name: 'Nicolas Freire',
	fullName: 'Nicolas Freire Ribeiro',
	handle: 'NICOLAS',
	role: { pt: 'Desenvolvedor Full Stack', en: 'Full-Stack Developer' } as L10n,
	/** Ano em que começou a programar: vira o "LV" do personagem. */
	startedCodingYear: 2025,
	location: { pt: 'Fortaleza, Brasil', en: 'Fortaleza, Brazil' } as L10n,
	languages: { pt: 'Português nativo, inglês B2', en: 'Native Portuguese, B2 English' } as L10n,
	available: true,
	email: 'nicolasfr.dev@gmail.com',
	/** PDF em /public. Atenção: o arquivo inclui seu telefone. */
	cvUrl: '/curriculo-nicolas-freire.pdf',
	/**
	 * Foto recortada (fundo transparente) em /public, em WebP. Vazio mostra uma silhueta.
	 * `photoSize` são as dimensões reais do arquivo (evita o layout pular enquanto carrega).
	 */
	photo: '/nicolas.webp',
	photoSize: { width: 591, height: 1330 },
	/** Música do "Tocando agora" no hero. */
	nowPlaying: { song: '[Sua música favorita]', artist: '[Artista]' }, // TODO
	tagline: {
		pt: 'Produtos web e mobile para pagamentos B2B, da interface à API.',
		en: 'Web and mobile products for B2B payments, from the interface to the API.',
	} as L10n,
	bio: {
		pt: [
			'Sou desenvolvedor full stack júnior com experiência em produtos web e mobile no setor de pagamentos B2B. Trabalho com React, React Native, Node.js, TypeScript e MySQL, com foco em interfaces responsivas, integração de APIs REST e boas práticas de arquitetura.',
			'Hoje integro produtos de consulta de crédito, cadastral e antifraude numa plataforma B2B, e colaboro com os times de Produto e Gestão para transformar requisitos de negócio em soluções técnicas de qualidade.',
		],
		en: [
			'I’m a junior full-stack developer with experience building web and mobile products in the B2B payments space. I work with React, React Native, Node.js, TypeScript and MySQL, focusing on responsive interfaces, REST API integrations and sound architecture.',
			'Today I integrate credit, registry and anti-fraud lookup products into a B2B platform, and I work with Product and Management teams to turn business requirements into solid technical solutions.',
		],
	},
	/**
	 * Atributos do personagem (0–100), mostrados como rank:
	 * até 16 Iniciante, 33 Aprendiz, 50 Competente, 66 Avançado, 83 Expert, 100 Lenda.
	 */
	stats: [
		{ key: 'FRONT', label: { pt: 'Front-end', en: 'Front-end' }, value: 60 },
		{ key: 'BACK', label: { pt: 'Back-end', en: 'Back-end' }, value: 60 },
		{ key: 'API', label: { pt: 'APIs e integrações', en: 'APIs & integrations' }, value: 65 },
		{ key: 'MOBILE', label: { pt: 'Mobile', en: 'Mobile' }, value: 45 },
		{ key: 'TEST', label: { pt: 'Testes', en: 'Testing' }, value: 40 },
		{ key: 'COFFEE', label: { pt: 'Café', en: 'Coffee' }, value: 100 },
	],
	socials: [
		{ id: 'github', label: 'GitHub', url: 'https://github.com/nicolasfr-dev' },
		{ id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/' }, // TODO: seu perfil (não está no currículo)
		{ id: 'email', label: 'E-mail', url: 'mailto:nicolasfr.dev@gmail.com' },
	],
};

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Equipamento = stack. `icon` é o slug do Simple Icons (simpleicons.org);
 * sem ícone, mostra `abbr` (ou as iniciais do nome). `level` vai de 1 a 5.
 */
export const inventory: {
	category: L10n;
	/** Slot do equipamento, como na tela de equipar do jogo. */
	slot: L10n;
	items: { name: string; icon: string; abbr?: string; level: number; rarity: Rarity }[];
}[] = [
	{
		category: { pt: 'Front-end', en: 'Front-end' },
		slot: { pt: 'Arma', en: 'Weapon' },
		items: [
			{ name: 'TypeScript', icon: 'typescript', level: 4, rarity: 'legendary' },
			{ name: 'JavaScript', icon: 'javascript', level: 4, rarity: 'legendary' },
			{ name: 'React', icon: 'react', level: 4, rarity: 'legendary' },
			{ name: 'React Native', icon: 'react', level: 3, rarity: 'epic' },
			{ name: 'TailwindCSS', icon: 'tailwindcss', level: 4, rarity: 'epic' },
			{ name: 'Vue.js', icon: 'vuedotjs', level: 2, rarity: 'rare' },
		],
	},
	{
		category: { pt: 'Back-end', en: 'Back-end' },
		slot: { pt: 'Armadura', en: 'Armor' },
		items: [
			{ name: 'Node.js', icon: 'nodedotjs', level: 4, rarity: 'legendary' },
			{ name: 'Express', icon: 'express', level: 4, rarity: 'epic' },
			{ name: 'APIs REST', icon: 'openapiinitiative', level: 4, rarity: 'epic' },
			{ name: 'MySQL', icon: 'mysql', level: 3, rarity: 'epic' },
			{ name: 'Redis', icon: 'redis', level: 3, rarity: 'rare' },
			{ name: 'BullMQ', icon: 'bullmq', abbr: 'BQ', level: 3, rarity: 'rare' },
		],
	},
	{
		category: { pt: 'Ferramentas', en: 'Tools' },
		slot: { pt: 'Acessório', en: 'Accessory' },
		items: [
			{ name: 'Git', icon: 'git', level: 4, rarity: 'epic' },
			{ name: 'GitHub', icon: 'github', level: 4, rarity: 'epic' },
			{ name: 'Vitest', icon: 'vitest', level: 3, rarity: 'rare' },
			{ name: 'Cypress', icon: 'cypress', level: 3, rarity: 'rare' },
			{ name: 'pnpm', icon: 'pnpm', level: 3, rarity: 'common' },
			{ name: 'Python', icon: 'python', level: 1, rarity: 'common' },
		],
	},
];

export type QuestStatus = 'done' | 'progress';

/** Um projeto: usado nos Requests (autoria própria) e dentro de cada cargo do Calendário. */
export type Project = {
	id: string;
	title: L10n;
	summary: L10n;
	type: 'web' | 'api' | 'tool' | 'game';
	status: QuestStatus;
	/** de 1 a 5 */
	difficulty: number;
	loot: string[];
	repo?: string;
	demo?: string;
	/** links extras com rótulo (ex.: um projeto com repositórios separados de front e back) */
	links?: { label: L10n; url: string }[];
	featured?: boolean;
};

/** Requests = projetos de autoria própria. Os feitos em empresas ficam no cargo, em `campaign`. */
export const quests: Project[] = [
	{
		id: 'portfolio',
		title: { pt: 'Este portfólio', en: 'This Portfolio' },
		summary: {
			pt: 'Um portfólio inspirado na UI de Persona 3 Reload, com conquistas, easter eggs e navegação por teclado. Você está jogando agora.',
			en: 'A portfolio inspired by Persona 3 Reload’s UI, with achievements, easter eggs and keyboard navigation. You’re playing it right now.',
		},
		type: 'web',
		status: 'progress',
		difficulty: 3,
		loot: ['Astro', 'TypeScript', 'Web Audio'],
		repo: 'https://github.com/nicolasfr-dev/meu-portifolio',
		featured: true,
	},
	{
		id: 'gtech-ecommerce',
		title: { pt: 'E-commerce full stack', en: 'Full-Stack E-commerce' },
		summary: {
			pt: 'Projeto final do Geração Tech 2.0. No front, uma loja em React com listagem e filtros, página de produto, carrinho, login, cadastro e pedidos. No back, uma API em Express com autenticação JWT, CRUD de usuários, categorias e produtos, documentação Swagger e testes.',
			en: 'Final project of the Geração Tech 2.0 program. On the front end, a React store with listing and filters, product page, cart, login, sign-up and orders. On the back end, an Express API with JWT auth, CRUD for users, categories and products, Swagger docs and tests.',
		},
		type: 'web',
		status: 'done',
		difficulty: 3,
		loot: ['React', 'TailwindCSS', 'React Router', 'Node.js', 'Express', 'Sequelize', 'MySQL', 'Jest'],
		links: [
			{ label: { pt: 'Código front-end', en: 'Front-end code' }, url: 'https://github.com/nicolasfr-dev/projetofrontend-gtech' },
			{ label: { pt: 'Código back-end', en: 'Back-end code' }, url: 'https://github.com/nicolasfr-dev/projetobackend-gtech' },
		],
	},
	{
		id: 'menu',
		title: { pt: 'Cardápio interativo', en: 'Interactive Menu' },
		summary: {
			pt: 'Cardápio de um restaurante indiano com entradas, pratos principais e sobremesas, em que cada prato abre um modal com os ingredientes. Feito com HTML, CSS e JavaScript puro.',
			en: 'Menu for an Indian restaurant with starters, main courses and desserts, where each dish opens a modal with its ingredients. Built with plain HTML, CSS and JavaScript.',
		},
		type: 'web',
		status: 'done',
		difficulty: 1,
		loot: ['HTML', 'CSS', 'JavaScript'],
		demo: 'https://nicolasfr-dev.github.io/Cardapio-interativo/',
		repo: 'https://github.com/nicolasfr-dev/Cardapio-interativo',
	},
];

/**
 * Calendário = experiência profissional (mais recente primeiro).
 * `projects` são os projetos feitos naquele cargo: abrem num modal ao clicar no card.
 */
export const campaign: {
	/** identificador curto, usado no id do modal */
	id: string;
	/** Nome próprio: não é traduzido. */
	company: string;
	role: L10n;
	period: L10n;
	description: L10n;
	current?: boolean;
	projects: Project[];
}[] = [
	{
		id: 'sollosit',
		company: 'Sollosit Tecnologia e Gestão de Pagamentos',
		role: { pt: 'Desenvolvedor de Software Full Stack', en: 'Full-Stack Software Developer' },
		period: { pt: 'mai. 2026 — atual', en: 'May 2026 — now' },
		description: {
			pt: 'Integração de 150+ produtos de consulta com Node.js e TypeScript, SDKs por provedor, fallback entre bureaus, filas com BullMQ e Redis, relatórios PDF em React e testes com Vitest.',
			en: 'Integrating 150+ lookup products with Node.js and TypeScript, per-provider SDKs, bureau fallback, BullMQ and Redis queues, React PDF reports and Vitest tests.',
		},
		current: true,
		projects: [
			{
				id: 'lookup-platform',
				title: { pt: 'Plataforma de consultas B2B', en: 'B2B Lookup Platform' },
				summary: {
					pt: 'Integração de mais de 150 produtos de consulta (crédito, cadastral, veicular, protesto e antifraude), conectando bureaus como Serasa, SPC, Quod, BigData e Assertiva via APIs REST, com fallback entre provedores e filas resilientes.',
					en: 'Integration of 150+ lookup products (credit, registry, vehicle, protest and anti-fraud), connecting bureaus such as Serasa, SPC, Quod, BigData and Assertiva through REST APIs, with provider fallback and resilient queues.',
				},
				type: 'api',
				status: 'progress',
				difficulty: 5,
				loot: ['Node.js', 'TypeScript', 'Express', 'BullMQ', 'Redis', 'MySQL'],
			},
			{
				id: 'sdk-generator',
				title: { pt: 'Gerador de SDK em terminal', en: 'Terminal SDK Generator' },
				summary: {
					pt: 'Ferramenta de linha de comando (TUI) com fila de produtos, templates por provedor e modo de importação, que padroniza e acelera a integração de novos produtos.',
					en: 'Command-line tool (TUI) with a product queue, per-provider templates and an import mode that standardizes and speeds up new product integrations.',
				},
				type: 'tool',
				status: 'done',
				difficulty: 4,
				loot: ['Node.js', 'TypeScript', 'CLI'],
			},
			{
				id: 'pdf-reports',
				title: { pt: 'Relatórios PDF em React', en: 'React PDF Reports' },
				summary: {
					pt: 'Relatórios de layout fixo com quadro de alertas, medidores de score e certidões da fonte embutidas no documento.',
					en: 'Fixed-layout reports with an alerts panel, score gauges and source certificates embedded in the document.',
				},
				type: 'web',
				status: 'done',
				difficulty: 3,
				loot: ['React', 'TypeScript', 'PDF'],
			},
		],
	},
	{
		id: 'b2bipy',
		company: 'B2B IPY Tecnologia e Gestão de Pagamentos',
		role: { pt: 'Desenvolvedor de Software Web e Mobile', en: 'Web & Mobile Software Developer' },
		period: { pt: 'set. 2025 — mai. 2026', en: 'Sep 2025 — May 2026' },
		description: {
			pt: 'Aplicações web e mobile com React, React Native, TypeScript e Node.js, APIs REST, modelagem MySQL, interfaces com TailwindCSS e testes com Cypress, junto aos times de Produto e Gestão.',
			en: 'Web and mobile apps with React, React Native, TypeScript and Node.js, REST APIs, MySQL modeling, TailwindCSS interfaces and Cypress tests, alongside Product and Management teams.',
		},
		projects: [
			{
				id: 'payments-apps',
				title: { pt: 'Apps web e mobile de pagamentos', en: 'Payments Web & Mobile Apps' },
				summary: {
					pt: 'Evolução de aplicações web e mobile de pagamentos B2B, com interfaces responsivas, APIs REST, banco MySQL e testes automatizados nos fluxos críticos.',
					en: 'Evolving B2B payments web and mobile apps, with responsive interfaces, REST APIs, a MySQL database and automated tests on critical flows.',
				},
				type: 'web',
				status: 'done',
				difficulty: 4,
				loot: ['React', 'React Native', 'TailwindCSS', 'MySQL', 'Cypress'],
			},
		],
	},
];

/** Educação: formação acadêmica e certificados (mais recente primeiro). */
export const education: {
	degrees: {
		course: L10n;
		/** Nome próprio: não é traduzido. */
		institution: string;
		level: L10n;
		period: L10n;
		/** Datas ISO (AAAA-MM) para calcular o progresso do curso. */
		start: string;
		end: string;
	}[];
	certificates: {
		title: L10n;
		issuer: string;
		period: L10n;
		highlights: { pt: string[]; en: string[] };
	}[];
} = {
	degrees: [
		{
			course: { pt: 'Análise e Desenvolvimento de Sistemas', en: 'Systems Analysis and Development' },
			institution: 'Universidade de Fortaleza (UNIFOR)',
			level: { pt: 'Tecnólogo', en: 'Associate degree (Technologist)' },
			period: { pt: 'fev. 2026 — ago. 2028', en: 'Feb 2026 — Aug 2028' },
			start: '2026-02',
			end: '2028-08',
		},
	],
	certificates: [
		{
			title: { pt: 'Desenvolvimento Full Stack', en: 'Full-Stack Development' },
			issuer: 'Geração Tech 2.0',
			period: { pt: 'abr. 2025 — ago. 2025', en: 'Apr 2025 — Aug 2025' },
			highlights: {
				pt: [
					'Aplicações web completas com JavaScript no front-end e no back-end',
					'Interfaces com HTML, CSS e React.js',
					'Consumo de APIs REST e integração com bancos relacionais',
					'Boas práticas, organização de código e Git/GitHub',
				],
				en: [
					'Full web applications with JavaScript on the front end and back end',
					'Interfaces with HTML, CSS and React.js',
					'Consuming REST APIs and integrating relational databases',
					'Best practices, code organization and Git/GitHub',
				],
			},
		},
		{
			title: { pt: 'Curso de Inglês (B2)', en: 'English Course (B2)' },
			issuer: 'CNA Idiomas',
			period: { pt: 'ago. 2018 — jun. 2023', en: 'Aug 2018 — Jun 2023' },
			highlights: {
				pt: [
					'Leitura, escrita, escuta e conversação',
					'Comunicação em contextos profissionais, técnicos e multiculturais',
				],
				en: [
					'Reading, writing, listening and speaking',
					'Communication in professional, technical and multicultural settings',
				],
			},
		},
	],
};
