import type { Lang } from '../data/profile';
import { ui, type UIKey } from '../i18n/ui';

export const lang = (): Lang => (document.documentElement.dataset.lang === 'en' ? 'en' : 'pt');
export const tr = (key: UIKey) => ui[lang()][key];
