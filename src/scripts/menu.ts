import { sfx } from './sound';

/**
 * Menus de comando no estilo do jogo: o item sob o mouse/foco fica selecionado,
 * ↑↓ andam entre os itens e a caixa de ajuda mostra a descrição do item.
 */
export function initMenus() {
	document.querySelectorAll<HTMLElement>('[data-cmd]').forEach((list) => {
		const scope = list.closest('section, dialog') ?? document;
		const help = scope.querySelector<HTMLElement>('[data-cmd-help]');
		const items = [...list.querySelectorAll<HTMLElement>('a, button')];

		// no hero, o comando selecionado também aparece gigante ao fundo
		const bigword = list.hasAttribute('data-bigword-source') ? scope.querySelector<HTMLElement>('[data-bigword]') : null;

		const select = (a: HTMLElement, withSound = true) => {
			if (a.classList.contains('is-selected')) return;
			items.forEach((x) => x.classList.toggle('is-selected', x === a));
			if (help) help.textContent = a.dataset.help ?? '';
			if (bigword && a.dataset.label) {
				bigword.textContent = a.dataset.label;
				bigword.classList.remove('swap');
				void bigword.offsetWidth; // reinicia a animação de troca
				bigword.classList.add('swap');
			}
			if (withSound) sfx('blip');
		};

		items.forEach((a) => {
			a.addEventListener('mouseenter', () => select(a));
			a.addEventListener('focus', () => select(a));
		});

		list.addEventListener('keydown', (e) => {
			if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
			e.preventDefault();
			const i = items.indexOf(document.activeElement as HTMLElement);
			const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
			items[next].focus();
		});

		// ao abrir um menu dentro de diálogo, o primeiro item volta a ser o selecionado
		const dialog = list.closest('dialog');
		if (dialog) {
			new MutationObserver(() => dialog.open && items[0] && select(items[0], false)).observe(dialog, {
				attributes: true,
				attributeFilter: ['open'],
			});
		}
	});

	// No hero, a primeira seta com nada focado entra no menu em vez de rolar a página
	const heroMenu = document.querySelector<HTMLElement>('.hero [data-cmd]');
	const hero = document.querySelector('.hero');
	let heroVisible = true;
	if (hero) new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting), { threshold: 0.5 }).observe(hero);
	addEventListener('keydown', (e) => {
		if (document.querySelector('dialog[open]')) return;
		const idle = document.activeElement === document.body || document.activeElement === null;
		if (heroMenu && heroVisible && idle && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
			e.preventDefault();
			heroMenu.querySelector<HTMLAnchorElement>('a.is-selected, a')?.focus();
		}
		const typing = (e.target as HTMLElement | null)?.closest?.('input, textarea, [contenteditable]');
		if (e.key === 'Escape' && !typing) {
			// no próximo tick: senão a ação padrão deste mesmo Esc fecha o diálogo recém-aberto
			setTimeout(() => document.querySelector<HTMLButtonElement>('.hud [data-open="pause"]')?.click());
		}
	});
}
