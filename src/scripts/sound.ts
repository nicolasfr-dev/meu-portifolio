import { load, save } from './store';

/**
 * Efeitos sonoros no clima da UI de Persona 3 Reload: suaves, cristalinos e "aquáticos".
 * Tudo sintetizado em tempo real (FM para timbre de sino/vidro + um eco curto), sem arquivos de áudio.
 */

type Tone = {
	/** Frequência em Hz (e, opcionalmente, para onde ela desliza). */
	freq: number;
	to?: number;
	/** Início relativo ao disparo, duração e volume. */
	at?: number;
	dur: number;
	gain: number;
	/** Timbre: 'bell' (FM, vidro), 'soft' (seno puro) ou 'air' (ruído filtrado). */
	kind?: 'bell' | 'soft' | 'air';
};

const NOTE = { C6: 1047, D6: 1175, E6: 1319, G6: 1568, A6: 1760, B6: 1976, C7: 2093, E7: 2637, A5: 880, E5: 659, B5: 988 };

const sounds = {
	/** cursor andando no menu: um tique quase imperceptível */
	blip: [{ freq: 2400, to: 2000, dur: 0.05, gain: 0.05, kind: 'soft' }],
	/** abrir um menu / confirmar */
	select: [
		{ freq: NOTE.E6, dur: 0.35, gain: 0.07, kind: 'bell' },
		{ freq: NOTE.B6, at: 0.05, dur: 0.4, gain: 0.05, kind: 'bell' },
	],
	/** confirmação "positiva" (copiar e-mail, começar, ligar o som) */
	confirm: [
		{ freq: NOTE.A6, dur: 0.3, gain: 0.06, kind: 'bell' },
		{ freq: NOTE.E7, at: 0.07, dur: 0.5, gain: 0.05, kind: 'bell' },
	],
	/** nova seção: arpejo ascendente de vidro */
	levelup: [
		{ freq: NOTE.C6, dur: 0.3, gain: 0.035, kind: 'bell' },
		{ freq: NOTE.E6, at: 0.07, dur: 0.3, gain: 0.035, kind: 'bell' },
		{ freq: NOTE.G6, at: 0.14, dur: 0.45, gain: 0.035, kind: 'bell' },
	],
	/** conquista: um "rank up" com acorde suave por baixo e brilho por cima */
	achievement: [
		{ freq: NOTE.A5 / 2, dur: 1.1, gain: 0.05, kind: 'soft' },
		{ freq: NOTE.E5, dur: 1.1, gain: 0.03, kind: 'soft' },
		{ freq: NOTE.A6, at: 0.05, dur: 0.6, gain: 0.05, kind: 'bell' },
		{ freq: NOTE.C7, at: 0.13, dur: 0.6, gain: 0.04, kind: 'bell' },
		{ freq: NOTE.E7, at: 0.21, dur: 0.9, gain: 0.04, kind: 'bell' },
		{ freq: 6000, at: 0.05, dur: 0.5, gain: 0.015, kind: 'air' },
	],
	powerup: [
		{ freq: NOTE.E6, dur: 0.25, gain: 0.04, kind: 'bell' },
		{ freq: NOTE.A6, at: 0.06, dur: 0.25, gain: 0.04, kind: 'bell' },
		{ freq: NOTE.C7, at: 0.12, dur: 0.25, gain: 0.04, kind: 'bell' },
		{ freq: NOTE.E7, at: 0.18, dur: 0.5, gain: 0.04, kind: 'bell' },
	],
} satisfies Record<string, Tone[]>;

export type Sfx = keyof typeof sounds;

let ctx: AudioContext | null = null;
let out: AudioNode | null = null;
let noise: AudioBuffer | null = null;

export function soundOn() {
	return load().sound;
}

export function setSound(on: boolean) {
	save({ sound: on });
	if (on) ensureCtx();
	document.dispatchEvent(new CustomEvent('dh:sound', { detail: on }));
}

/** Cria o contexto e a cadeia de saída: passa-baixa (tira a aspereza) + eco curto (o "aquático"). */
function ensureCtx() {
	if (!ctx) {
		const AC = window.AudioContext ?? (window as any).webkitAudioContext;
		if (!AC) return null;
		ctx = new AC() as AudioContext;
		const master = ctx.createGain();
		master.gain.value = 0.9;
		const lowpass = ctx.createBiquadFilter();
		lowpass.type = 'lowpass';
		lowpass.frequency.value = 7000;
		const delay = ctx.createDelay();
		delay.delayTime.value = 0.11;
		const feedback = ctx.createGain();
		feedback.gain.value = 0.28;
		const wet = ctx.createGain();
		wet.gain.value = 0.35;
		lowpass.connect(master);
		lowpass.connect(delay);
		delay.connect(feedback).connect(delay);
		delay.connect(wet).connect(master);
		master.connect(ctx.destination);
		out = lowpass;

		noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
		const data = noise.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
	}
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

/** Envelope com ataque curto e queda exponencial: nada de cliques. */
function envelope(ac: AudioContext, start: number, dur: number, gain: number) {
	const g = ac.createGain();
	g.gain.setValueAtTime(0.0001, start);
	g.gain.exponentialRampToValueAtTime(gain, start + Math.min(0.008, dur / 4));
	g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
	g.connect(out!);
	return g;
}

function play(ac: AudioContext, t: Tone, scale: number) {
	const start = ac.currentTime + (t.at ?? 0);
	const env = envelope(ac, start, t.dur, t.gain * scale);
	const end = start + t.dur + 0.05;

	if (t.kind === 'air') {
		const src = ac.createBufferSource();
		src.buffer = noise;
		const band = ac.createBiquadFilter();
		band.type = 'bandpass';
		band.frequency.value = t.freq;
		band.Q.value = 2;
		src.connect(band).connect(env);
		src.start(start);
		src.stop(end);
		return;
	}

	const osc = ac.createOscillator();
	osc.type = 'sine';
	osc.frequency.setValueAtTime(t.freq, start);
	if (t.to) osc.frequency.exponentialRampToValueAtTime(t.to, start + t.dur);
	osc.connect(env);

	if (t.kind === 'bell') {
		// FM: um modulador em razão não inteira dá o brilho de vidro, que some rápido
		const mod = ac.createOscillator();
		mod.frequency.value = t.freq * 3.5;
		const depth = ac.createGain();
		depth.gain.setValueAtTime(t.freq * 1.2, start);
		depth.gain.exponentialRampToValueAtTime(1, start + t.dur * 0.6);
		mod.connect(depth).connect(osc.frequency);
		mod.start(start);
		mod.stop(end);
	}

	osc.start(start);
	osc.stop(end);
}

/** Toca um efeito. `scale` ajusta o volume relativo (1 = padrão). */
export function sfx(name: Sfx, scale = 1) {
	if (!soundOn()) return;
	const ac = ensureCtx();
	if (!ac || !out) return;
	for (const tone of sounds[name] as Tone[]) play(ac, tone, scale);
}
