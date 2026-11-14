import { unlock } from './achievements';
import { sfx } from './sound';
import { lang, tr } from './lang';

/** Fase da lua de 0 (nova) a 1, pelo ciclo sinódico a partir de uma lua nova conhecida. */
function moonAge(date: Date) {
	const SYNODIC = 29.530588853;
	const knownNew = Date.UTC(2000, 0, 6, 18, 14);
	const days = (date.getTime() - knownNew) / 86_400_000;
	return (((days % SYNODIC) + SYNODIC) % SYNODIC) / SYNODIC;
}

/** Caminho SVG da parte iluminada da lua num círculo de raio 15 centrado em (17, 17). */
function moonPath(f: number) {
	const r = 15;
	const rx = Math.abs(Math.cos(f * 2 * Math.PI)) * r;
	const waxing = f < 0.5;
	const crescent = f < 0.25 || f > 0.75;
	// metade iluminada (direita ao crescer, esquerda ao minguar) + o terminador elíptico
	const half = waxing ? 1 : 0;
	const term = waxing ? (crescent ? 0 : 1) : crescent ? 1 : 0;
	return `M17 2 A${r} ${r} 0 0 ${half} 17 32 A${rx.toFixed(2)} ${r} 0 0 ${term} 17 2 Z`;
}

function timeOfDay(h: number) {
	if (h === 0) return tr('tod.dark');
	if (h < 6) return tr('tod.lateNight');
	if (h < 12) return tr('tod.morning');
	if (h < 18) return tr('tod.afternoon');
	return tr('tod.evening');
}

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher). */
function easter(year: number) {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31);
	const day = ((h + l - 7 * m + 114) % 31) + 1;
	return new Date(year, month - 1, day);
}

/** Feriados nacionais do Brasil, mais Carnaval e Corpus Christi (que quase todo mundo folga). */
function isHoliday(date: Date) {
	const md = `${date.getMonth() + 1}-${date.getDate()}`;
	const fixed = ['1-1', '4-21', '5-1', '9-7', '10-12', '11-2', '11-15', '11-20', '12-25'];
	if (fixed.includes(md)) return true;
	const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	const e = easter(date.getFullYear());
	// Carnaval (seg e ter), Sexta-feira Santa e Corpus Christi, em dias a partir da Páscoa
	return [-48, -47, -2, 60].some((offset) => new Date(e.getFullYear(), e.getMonth(), e.getDate() + offset).getTime() === today);
}

/** A barra do navegador no celular acompanha o tema: carmesim (cheat) > Hora Sombria > normal. */
export function syncThemeColor() {
	const root = document.documentElement;
	const color = root.dataset.cheat ? '#1c0611' : root.dataset.hour === 'dark' ? '#03130d' : '#061334';
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}

/** Calendário da HUD: data, dia da semana, período do dia e fase da lua reais. */
export function initCalendar() {
	const now = new Date();
	const dd = String(now.getDate()).padStart(2, '0');
	const mm = String(now.getMonth() + 1).padStart(2, '0');
	const date = lang() === 'en' ? `${mm}/${dd}` : `${dd}/${mm}`;
	const day = new Intl.DateTimeFormat(lang() === 'en' ? 'en-US' : 'pt-BR', { weekday: 'short' })
		.format(now)
		.replace('.', '');
	const tod = timeOfDay(now.getHours());
	const age = moonAge(now);
	const phase = Math.round(age * 8) % 8;
	const moonName = tr(`moon.${phase}` as 'moon.0');

	document.querySelectorAll('[data-cal-date]').forEach((el) => (el.textContent = date));
	document.querySelectorAll('[data-cal-day]').forEach((el) => (el.textContent = day));
	document.querySelectorAll('[data-cal-tod]').forEach((el) => (el.textContent = tod));

	// Hora Sombria (0h–1h): a palavra de fundo muda e o site inteiro fica verde, como no jogo
	const darkHour = now.getHours() === 0;
	const weekend = now.getDay() === 0 || now.getDay() === 6;
	const word = darkHour
		? tr('tod.dark')
		: tr(isHoliday(now) ? 'cal.holiday' : weekend ? 'cal.weekend' : 'cal.weekday');
	document.querySelectorAll('[data-cal-word]').forEach((el) => (el.textContent = word));
	if (darkHour) document.documentElement.dataset.hour = 'dark';
	else delete document.documentElement.dataset.hour;
	syncThemeColor();

	document.querySelectorAll('[data-cal-moon]').forEach((el) => el.setAttribute('d', moonPath(age)));
	document.querySelectorAll('[data-cal-moon-label]').forEach((el) => el.setAttribute('aria-label', moonName));
	document.querySelectorAll('[data-calendar]').forEach((el) => el.setAttribute('aria-label', `${date}, ${day}, ${tod}`));
}

/** Barra de XP (progresso de rolagem), level por fase descoberta e revelação de seções. */
export function initHud() {
	initCalendar();
	// atualiza a cada virada de minuto: a Hora Sombria começa e termina com a página aberta
	setTimeout(() => {
		initCalendar();
		setInterval(initCalendar, 60_000);
	}, 60_000 - (Date.now() % 60_000));
	const xpBars = document.querySelectorAll<HTMLElement>('[data-xp]');
	const xpTexts = document.querySelectorAll<HTMLElement>('[data-xp-text]');
	const lvEls = document.querySelectorAll<HTMLElement>('[data-lv]');
	const levelUp = document.querySelector<HTMLElement>('[data-levelup]');
	const stages = [...document.querySelectorAll<HTMLElement>('[data-stage]')];
	const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav]')];

	// --- XP ---
	let ticking = false;
	const updateXp = () => {
		ticking = false;
		const max = document.documentElement.scrollHeight - innerHeight;
		const pct = max > 0 ? Math.min(100, Math.max(0, (scrollY / max) * 100)) : 100;
		xpBars.forEach((el) => el.style.setProperty('--value', pct.toFixed(1)));
		xpTexts.forEach((el) => (el.textContent = `${Math.round(pct)}%`));
	};
	addEventListener(
		'scroll',
		() => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(updateXp);
			}
		},
		{ passive: true },
	);
	addEventListener('resize', updateXp, { passive: true });
	updateXp();

	// --- Fases / level ---
	const seen = new Set<string>();
	const setLevel = () => lvEls.forEach((el) => (el.textContent = String(Math.max(1, seen.size)).padStart(2, '0')));
	setLevel();

	const stageObserver = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const id = (entry.target as HTMLElement).id;
				navLinks.forEach((a) => {
					if (a.hash === `#${id}`) a.setAttribute('aria-current', 'true');
					else a.removeAttribute('aria-current');
				});
				if (seen.has(id)) continue;
				seen.add(id);
				setLevel();
				if (seen.size > 1) {
					sfx('levelup');
					if (levelUp) {
						levelUp.classList.remove('show');
						void levelUp.offsetWidth;
						levelUp.classList.add('show');
					}
				}
				if (seen.size === stages.length) unlock('explorer');
			}
		},
		{ rootMargin: '-45% 0px -50% 0px' },
	);
	stages.forEach((s) => stageObserver.observe(s));

	// --- Revelação ---
	const revealObserver = new IntersectionObserver(
		(entries, obs) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					obs.unobserve(entry.target);
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px' },
	);
	document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

	// --- Fim da página + speedrun ---
	const startedAtTop = scrollY < 100;
	const t0 = performance.now();
	const end = document.querySelector('[data-end]');
	if (end) {
		new IntersectionObserver((entries, obs) => {
			if (entries.some((e) => e.isIntersecting) && document.documentElement.scrollHeight > innerHeight * 1.5) {
				unlock('completionist');
				if (startedAtTop && performance.now() - t0 < 12_000) unlock('speedrunner');
				obs.disconnect();
			}
		}).observe(end);
	}
}
