/**
 * Entrada do hero: dispara a sequência de animação (CSS, via "hero-in") e "digita" a fala.
 * Só anima se o script inline do <head> marcou "hero-pending" (sem movimento reduzido);
 * caso contrário, tudo já aparece pronto.
 */
export function startHeroIntro() {
	const root = document.documentElement;
	const animate = root.classList.contains('hero-pending');
	root.classList.remove('hero-pending');
	if (!animate) return;
	root.classList.add('hero-in');

	const el = document.querySelector<HTMLElement>('[data-typewriter]');
	if (!el) return;
	const full = el.textContent ?? '';

	// o trecho ainda não "digitado" fica no lugar, transparente: a caixa não muda de tamanho
	const shown = document.createElement('span');
	const ghost = document.createElement('span');
	ghost.style.color = 'transparent';
	ghost.textContent = full;
	el.replaceChildren(shown, ghost);

	let i = 0;
	let timer = 0;
	const finish = () => {
		clearInterval(timer);
		shown.textContent = full;
		ghost.textContent = '';
	};

	// começa quando a caixa de diálogo termina de entrar
	setTimeout(() => {
		timer = window.setInterval(() => {
			i += 2;
			shown.textContent = full.slice(0, i);
			ghost.textContent = full.slice(i);
			if (i >= full.length) finish();
		}, 22);
	}, 800);

	// como no jogo: clicar na fala completa o texto na hora
	el.closest('.talk')?.addEventListener('click', finish, { once: true });
}

/**
 * Marca o hero com "is-away" assim que ele deixa de ocupar a maior parte da tela:
 * a água do fundo para de se mexer, e a rolagem não paga pela animação.
 */
export function watchHero() {
	const hero = document.querySelector<HTMLElement>('.hero');
	if (!hero) return;
	new IntersectionObserver(([e]) => hero.classList.toggle('is-away', e.intersectionRatio < 0.6), {
		threshold: 0.6,
	}).observe(hero);
}
