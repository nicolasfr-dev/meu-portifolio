import { toast, unlock } from './achievements';
import { load, save } from './store';
import { sfx } from './sound';
import { tr } from './lang';
import { syncThemeColor } from './hud';

type Input = 'up' | 'down' | 'left' | 'right' | 'b' | 'a';

const CODE: Input[] = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
const SYMBOL: Record<Input, string> = { up: '↑', down: '↓', left: '←', right: '→', b: 'B', a: 'A' };
const KEYMAP: Record<string, Input> = { arrowup: 'up', arrowdown: 'down', arrowleft: 'left', arrowright: 'right', b: 'b', a: 'a' };

/**
 * Konami code via teclado, gestos (swipe ↑↑↓↓←→←→ + toque, toque) ou gamepad virtual do rodapé.
 */
export function initKonami() {
	let progress = 0;
	const display = document.querySelector<HTMLElement>('[data-pad-display]');

	const render = () => {
		if (!display) return;
		display.textContent = CODE.map((c, i) => (i < progress ? SYMBOL[c] : '·')).join(' ');
		display.classList.toggle('has-progress', progress > 0);
	};

	const feed = (input: Input, fromPad = false) => {
		if (input === CODE[progress]) progress++;
		else progress = input === CODE[0] ? 1 : 0;
		if (fromPad) sfx('blip');
		render();
		if (progress === CODE.length) {
			progress = 0;
			render();
			activate();
		}
	};

	addEventListener('keydown', (e) => {
		const target = e.target as HTMLElement;
		if (target.closest('input, textarea, [contenteditable]')) return;
		const input = KEYMAP[e.key.toLowerCase()];
		if (input) feed(input);
	});

	// Gestos de toque: swipes viram setas, toques curtos viram B e A
	let sx = 0;
	let sy = 0;
	let st = 0;
	addEventListener(
		'touchstart',
		(e) => {
			const t = e.touches[0];
			sx = t.clientX;
			sy = t.clientY;
			st = performance.now();
		},
		{ passive: true },
	);
	addEventListener(
		'touchend',
		(e) => {
			if ((e.target as HTMLElement).closest('[data-pad], a, button')) return;
			const t = e.changedTouches[0];
			const dx = t.clientX - sx;
			const dy = t.clientY - sy;
			const dist = Math.hypot(dx, dy);
			if (dist < 10 && performance.now() - st < 300) {
				// depois das setas, dois toques completam o código
				if (progress >= 8) feed(CODE[progress]);
				return;
			}
			if (dist < 40) return;
			// swipe para cima = dedo sobe = seta para cima
			if (Math.abs(dx) > Math.abs(dy)) feed(dx > 0 ? 'right' : 'left');
			else feed(dy < 0 ? 'up' : 'down');
		},
		{ passive: true },
	);

	document.querySelectorAll<HTMLButtonElement>('[data-pad]').forEach((btn) => {
		btn.addEventListener('click', () => feed(btn.dataset.pad as Input, true));
	});

	render();
}

function activate() {
	const on = !load().cheat;
	save({ cheat: on });
	if (on) document.documentElement.dataset.cheat = 'crimson';
	else delete document.documentElement.dataset.cheat;
	syncThemeColor();
	sfx('powerup');
	toast({ kicker: 'Cheat', title: tr(on ? 'cheat.on' : 'cheat.off'), variant: 'info' });
	unlock('konami');
}
