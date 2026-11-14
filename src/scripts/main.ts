import { refresh, unlock } from './achievements';
import { load, save, reset, session } from './store';
import { setSound, sfx, soundOn } from './sound';
import { initHud } from './hud';
import { initKonami } from './konami';
import { initMenus } from './menu';
import { startHeroIntro, watchHero } from './hero';
import { tr } from './lang';
import type { AchievementId } from '../data/achievements';

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];

// ---------- Boot (a Hora Sombria começa) ----------
function initBoot(onDone: () => void) {
	const root = document.documentElement;
	if (!root.classList.contains('booting')) return onDone();
	const done = () => {
		if (!root.classList.contains('booting')) return;
		session('dh:booted', '1');
		root.classList.add('boot-out');
		setTimeout(() => {
			root.classList.remove('booting', 'boot-out');
			onDone();
		}, 450);
		removeEventListener('keydown', done);
		removeEventListener('pointerdown', done);
	};
	addEventListener('keydown', done);
	addEventListener('pointerdown', done);
	setTimeout(done, 2600);
}

// ---------- Diálogos ----------
function initDialogs() {
	$$('[data-open]').forEach((btn) =>
		btn.addEventListener('click', (e) => {
			const dialog = document.getElementById(`${btn.dataset.open}-dialog`) as HTMLDialogElement | null;
			if (!dialog) return;
			e.preventDefault();
			$$<HTMLDialogElement>('dialog[open]').forEach((d) => d !== dialog && d.close());
			sfx('select');
			dialog.showModal();
		}),
	);

	$$<HTMLDialogElement>('dialog.modal').forEach((dialog) => {
		dialog.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			// clique no backdrop (fora da caixa) ou em qualquer [data-close] fecha
			if (target === dialog || target.closest('[data-close]')) dialog.close();
		});
	});

	// links do menu de pausa fecham o menu antes de navegar
	$$('#pause-dialog a[href^="#"]').forEach((a) =>
		a.addEventListener('click', () => ($('#pause-dialog') as HTMLDialogElement | null)?.close()),
	);
}

// ---------- Som ----------
function initSound() {
	const sync = () =>
		$$('[data-sound-toggle]').forEach((btn) => {
			btn.setAttribute('aria-pressed', String(soundOn()));
			btn.classList.toggle('is-on', soundOn());
		});
	$$('[data-sound-toggle]').forEach((btn) =>
		btn.addEventListener('click', () => {
			setSound(!soundOn());
			sync();
			if (soundOn()) {
				sfx('confirm');
				unlock('audiophile');
			}
		}),
	);
	sync();
}

// ---------- Pequenos eventos que valem conquistas ----------
function welcome() {
	unlock('player1');
	const hour = new Date().getHours();
	if (hour >= 0 && hour < 5) unlock('night_owl');
}

function initTriggers() {
	$$('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => unlock('polyglot')));

	$$('[data-press-start]').forEach((a) =>
		a.addEventListener('click', () => {
			sfx('confirm');
			unlock('press_start');
		}),
	);

	$$('[data-quest-link]').forEach((a) => a.addEventListener('click', () => unlock('quest_log')));
	// qualquer elemento pode desbloquear uma conquista ao ser clicado: data-unlock="id"
	$$('[data-unlock]').forEach((el) => el.addEventListener('click', () => unlock(el.dataset.unlock as AchievementId)));
	$$('[data-contact]').forEach((a) => a.addEventListener('click', () => unlock('networker')));

	// clicar na lua do calendário
	let pokes = load().pokes;
	$$('[data-poke]').forEach((el) =>
		el.addEventListener('click', () => {
			pokes++;
			save({ pokes });
			sfx('blip');
			el.classList.remove('poked');
			void el.offsetWidth;
			el.classList.add('poked');
			if (pokes >= 10) unlock('poke');
		}),
	);

	// copiar e-mail
	$$<HTMLButtonElement>('[data-copy]').forEach((btn) =>
		btn.addEventListener('click', async () => {
			const value = btn.dataset.copy!;
			try {
				await navigator.clipboard.writeText(value);
			} catch {
				const ta = document.createElement('textarea');
				ta.value = value;
				ta.style.position = 'fixed';
				ta.style.opacity = '0';
				document.body.append(ta);
				ta.select();
				document.execCommand('copy');
				ta.remove();
			}
			const label = btn.querySelector('[data-copy-label]');
			if (label) {
				label.textContent = tr('contact.copied');
				setTimeout(() => (label.textContent = tr('contact.copy')), 1800);
			}
			sfx('confirm');
			unlock('networker');
		}),
	);

	$$('[data-reset]').forEach((btn) =>
		btn.addEventListener('click', () => {
			if (!confirm(tr('achievements.resetConfirm'))) return;
			reset();
			delete document.documentElement.dataset.cheat;
			location.reload();
		}),
	);
}

// ---------- Filtro de quests ----------
function initQuestFilter() {
	const buttons = $$<HTMLButtonElement>('[data-filter]');
	const cards = $$('[data-quest-type]');
	buttons.forEach((btn) =>
		btn.addEventListener('click', () => {
			const f = btn.dataset.filter!;
			buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
			cards.forEach((c) => (c.hidden = f !== 'all' && c.dataset.questType !== f));
			sfx('blip');
		}),
	);
}

function consoleGreeting() {
	console.log(
		'%c A HORA SOMBRIA COMEÇOU ',
		'background:#f4f7ff;color:#061334;font:italic 900 16px sans-serif;padding:6px 10px',
	);
	console.log('%cCurioso pelo código? Tente ↑ ↑ ↓ ↓ ← → ← → B A na página.', 'color:#63d4ff;font:12px sans-serif');
}

initDialogs();
initSound();
initHud();
initKonami();
initQuestFilter();
initMenus();
watchHero();
initTriggers();
refresh();
// conquistas iniciais só depois do boot, para o toast não ficar escondido atrás dele
initBoot(() => {
	startHeroIntro();
	welcome();
});
consoleGreeting();
