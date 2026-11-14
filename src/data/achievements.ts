import type { L10n } from './profile';

export type AchievementId =
	| 'player1'
	| 'press_start'
	| 'explorer'
	| 'completionist'
	| 'speedrunner'
	| 'quest_log'
	| 'polyglot'
	| 'audiophile'
	| 'konami'
	| 'poke'
	| 'networker'
	| 'night_owl'
	| 'platinum';

export type Achievement = {
	id: AchievementId;
	points: number;
	/** Conquistas secretas mostram "???" até serem desbloqueadas. */
	secret?: boolean;
	name: L10n;
	desc: L10n;
};

export const achievements: Achievement[] = [
	{ id: 'player1', points: 5, name: { pt: 'Primeiro dia', en: 'First Day' }, desc: { pt: 'Visitou o portfólio pela primeira vez.', en: 'Visited the portfolio for the first time.' } },
	{ id: 'press_start', points: 5, name: { pt: 'Primeiro comando', en: 'First Command' }, desc: { pt: 'Escolheu uma opção no menu principal.', en: 'Picked an option from the main menu.' } },
	{ id: 'explorer', points: 15, name: { pt: 'Explorador', en: 'Explorer' }, desc: { pt: 'Passou por todas as seções.', en: 'Went through every section.' } },
	{ id: 'completionist', points: 10, name: { pt: 'Fim do dia', en: 'End of the Day' }, desc: { pt: 'Chegou ao final da página.', en: 'Reached the end of the page.' } },
	{ id: 'speedrunner', points: 20, secret: true, name: { pt: 'Speedrunner', en: 'Speedrunner' }, desc: { pt: 'Chegou ao fim da página em menos de 12 segundos.', en: 'Reached the end of the page in under 12 seconds.' } },
	{ id: 'quest_log', points: 10, name: { pt: 'Request aceito', en: 'Request Accepted' }, desc: { pt: 'Abriu um projeto.', en: 'Opened a project.' } },
	{ id: 'polyglot', points: 10, name: { pt: 'Poliglota', en: 'Polyglot' }, desc: { pt: 'Trocou o idioma.', en: 'Switched the language.' } },
	{ id: 'audiophile', points: 5, name: { pt: 'Fones no ouvido', en: 'Headphones On' }, desc: { pt: 'Ligou os efeitos sonoros.', en: 'Turned on sound effects.' } },
	{ id: 'konami', points: 30, secret: true, name: { pt: 'Old School', en: 'Old School' }, desc: { pt: 'Digitou o código secreto mais famoso dos games.', en: 'Entered the most famous cheat code in gaming.' } },
	{ id: 'poke', points: 10, secret: true, name: { pt: 'Olhando pra lua', en: 'Moonstruck' }, desc: { pt: 'Clicou 10 vezes na lua do calendário.', en: 'Clicked the calendar moon 10 times.' } },
	{ id: 'networker', points: 15, name: { pt: 'Social Link', en: 'Social Link' }, desc: { pt: 'Copiou o e-mail ou abriu um contato.', en: 'Copied the e-mail or opened a contact.' } },
	{ id: 'night_owl', points: 10, secret: true, name: { pt: 'Hora Sombria', en: 'Dark Hour' }, desc: { pt: 'Visitou entre meia-noite e 5h.', en: 'Visited between midnight and 5am.' } },
	{ id: 'platinum', points: 50, name: { pt: 'Max Social Link', en: 'Max Social Link' }, desc: { pt: 'Desbloqueou todas as outras conquistas.', en: 'Unlocked every other achievement.' } },
];

export const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
