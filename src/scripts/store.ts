import type { AchievementId } from '../data/achievements';

const KEY = 'dh:v1';

export type SaveData = {
	unlocked: Partial<Record<AchievementId, number>>;
	sound: boolean;
	cheat: boolean;
	pokes: number;
};

const empty = (): SaveData => ({ unlocked: {}, sound: false, cheat: false, pokes: 0 });

let cache: SaveData | null = null;

/** localStorage pode falhar (aba anônima, bloqueio); o site segue funcionando em memória. */
export function load(): SaveData {
	if (cache) return cache;
	try {
		cache = { ...empty(), ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
	} catch {
		cache = empty();
	}
	return cache!;
}

export function save(patch: Partial<SaveData>) {
	cache = { ...load(), ...patch };
	try {
		localStorage.setItem(KEY, JSON.stringify(cache));
	} catch {
		/* sem persistência, tudo bem */
	}
	return cache;
}

export function reset() {
	cache = empty();
	try {
		localStorage.removeItem(KEY);
		sessionStorage.removeItem('dh:booted');
	} catch {
		/* ignore */
	}
}

export function session(key: string, value?: string) {
	try {
		if (value === undefined) return sessionStorage.getItem(key);
		sessionStorage.setItem(key, value);
	} catch {
		/* ignore */
	}
	return null;
}
