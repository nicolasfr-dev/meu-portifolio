import { achievements, totalPoints, type AchievementId } from '../data/achievements';
import { load, save } from './store';
import { sfx } from './sound';
import { lang, tr } from './lang';

const byId = new Map(achievements.map((a) => [a.id, a]));

export const isUnlocked = (id: AchievementId) => Boolean(load().unlocked[id]);

export function points() {
	const { unlocked } = load();
	return achievements.reduce((sum, a) => sum + (unlocked[a.id] ? a.points : 0), 0);
}

export function unlock(id: AchievementId) {
	if (isUnlocked(id)) return;
	const a = byId.get(id);
	if (!a) return;
	save({ unlocked: { ...load().unlocked, [id]: Date.now() } });
	sfx('achievement');
	toast({
		kicker: tr('achievements.unlocked'),
		title: a.name[lang()],
		meta: `+${a.points}`,
		variant: 'achievement',
	});
	refresh(id);

	const others = achievements.filter((x) => x.id !== 'platinum');
	if (id !== 'platinum' && others.every((x) => isUnlocked(x.id))) {
		setTimeout(() => unlock('platinum'), 1200);
	}
}

/** Sincroniza HUD e painel com o save atual. */
export function refresh(justUnlocked?: AchievementId) {
	const { unlocked } = load();
	const count = achievements.filter((a) => unlocked[a.id]).length;
	const pts = points();

	document.querySelectorAll<HTMLElement>('[data-score]').forEach((el) => {
		el.textContent = String(pts).padStart(4, '0');
	});
	document.querySelectorAll<HTMLElement>('[data-ach-count]').forEach((el) => {
		el.textContent = `${count}/${achievements.length}`;
	});
	document.querySelectorAll<HTMLElement>('[data-ach-progress]').forEach((el) => {
		el.style.setProperty('--value', String(Math.round((pts / totalPoints) * 100)));
	});
	// Rank do Social Link: 1 a 10 conforme as conquistas; com a platina vira MAX
	const rank = unlocked.platinum ? 10 : Math.max(1, Math.min(9, Math.ceil((count / achievements.length) * 10)));
	document.querySelectorAll<HTMLElement>('[data-rank]').forEach((el) => {
		el.textContent = unlocked.platinum ? 'MAX' : String(rank);
		el.toggleAttribute('data-max', Boolean(unlocked.platinum));
	});
	document.querySelectorAll<HTMLElement>('[data-rank-pips]').forEach((el) => {
		el.querySelectorAll('[data-pip]').forEach((pip, i) => pip.classList.toggle('on', i < rank));
	});
	document.querySelectorAll<HTMLElement>('[data-ach]').forEach((el) => {
		const id = el.dataset.ach as AchievementId;
		el.toggleAttribute('data-locked', !unlocked[id]);
		if (id === justUnlocked) el.classList.add('is-new');
	});
	if (justUnlocked) {
		document.querySelectorAll<HTMLElement>('[data-trophy]').forEach((el) => {
			el.classList.remove('bump');
			void el.offsetWidth;
			el.classList.add('bump');
		});
	}
}

type ToastOptions = {
	kicker: string;
	title: string;
	meta?: string;
	variant?: 'achievement' | 'info' | 'levelup';
	duration?: number;
};

const queue: ToastOptions[] = [];
let showing = 0;
const MAX_VISIBLE = 2;

export function toast(opts: ToastOptions) {
	queue.push(opts);
	pump();
}

function pump() {
	const root = document.querySelector('.toasts');
	if (!root) return;
	while (showing < MAX_VISIBLE && queue.length) {
		const opts = queue.shift()!;
		showing++;
		const el = document.createElement('div');
		el.className = `toast toast--${opts.variant ?? 'info'}`;
		el.setAttribute('role', 'status');
		// o "UP!" gigante das notificações do jogo ("!" nos avisos comuns)
		const up = document.createElement('span');
		up.className = 'toast-up';
		up.setAttribute('aria-hidden', 'true');
		up.textContent = opts.variant === 'info' ? '!' : 'UP!';
		el.append(up);
		const text = document.createElement('div');
		text.className = 'toast-text';
		const kicker = document.createElement('span');
		kicker.className = 'toast-kicker';
		kicker.textContent = opts.kicker;
		const title = document.createElement('strong');
		title.className = 'toast-title';
		title.textContent = opts.title;
		text.append(kicker, title);
		el.append(text);
		if (opts.meta) {
			const meta = document.createElement('span');
			meta.className = 'toast-meta';
			meta.textContent = opts.meta;
			el.append(meta);
		}
		root.append(el);

		const dismiss = () => {
			if (el.classList.contains('out')) return;
			el.classList.add('out');
			setTimeout(() => {
				el.remove();
				showing--;
				pump();
			}, 300);
		};
		el.addEventListener('click', dismiss);
		setTimeout(dismiss, opts.duration ?? 3800);
	}
}
