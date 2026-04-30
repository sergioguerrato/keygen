'use client';

import { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CHAR_SETS = {
  alphabetical: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numerical: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

const WORD_LISTS = {
  general: {
    pt: [
      // 3 letras
      'pao', 'ipe', 'ano', 'dia', 'vez',
      // 4 letras
      'lua', 'sol', 'rio', 'mar', 'paz', 'rei', 'luz', 'mel', 'asa', 'voz',
      'lobo', 'urso', 'gato', 'leao', 'pato', 'jade', 'ouro', 'neve', 'fogo', 'gelo',
      'vela', 'cera', 'raio', 'agua', 'onda', 'arco', 'pena', 'toca', 'pulo', 'sino',
      'peao', 'alma', 'bala', 'sapo', 'riso', 'lula', 'anta', 'anjo', 'rosa', 'asno',
      'cano', 'foco', 'suco', 'fada', 'hino',
      // 5 letras
      'tigre', 'aguia', 'cobra', 'cisne', 'veado', 'manga', 'pedra', 'chama', 'prata',
      'areia', 'praia', 'chuva', 'vento', 'nuvem', 'panda', 'pomba', 'pluma', 'cervo',
      'ponte', 'balsa', 'terra', 'bicho', 'junco', 'faixa', 'polvo', 'urubu', 'fauna',
      'flora', 'jaula', 'aroma', 'poste', 'volei', 'tenis', 'surfe', 'coral',
      // 6 letras
      'safira', 'sereia', 'marfim', 'cristal', 'tucano', 'gaviao', 'goiaba', 'jardim',
      'planta', 'camelo', 'coelho', 'cavalo', 'jacare', 'jaguar', 'arvore', 'falcao',
      'abelha', 'viagem', 'salmao',
      // 7 letras
      'futebol', 'floresta', 'oceano', 'trovao', 'geleira', 'raposa', 'muralha',
      'batalha', 'planeta', 'deserto', 'simbolo', 'torneio', 'salmoura',
      // 8 letras
      'montanha', 'esmeralda', 'capivara', 'maracuja', 'relampago', 'basquete',
      'diamante', 'abacaxi', 'mariposa', 'panqueca', 'papagaio', 'camaleao',
      'toupeira', 'cordeiro', 'libelula',
      // 9 letras
      'escultura', 'cachorra', 'borboleta', 'crocodilo', 'horizonte', 'jacaranda',
      'labirinto', 'submarino', 'pavimento', 'chocolate', 'carinhoso', 'vitorioso',
      'queimados', 'andorinha', 'tartaruga', 'primavera',
      // 10 letras
      'paquiderme', 'passarinho', 'lavanderia',
    ],
    en: [
      // 3 letras
      'oak', 'fox', 'gem', 'axe', 'arc', 'ash', 'elm', 'ice', 'ivy', 'jay',
      'owl', 'cub', 'doe', 'fly', 'fin', 'fog', 'fur', 'sea', 'sky', 'tea',
      // 4 letras
      'wolf', 'bear', 'jade', 'rose', 'iron', 'gold', 'blue', 'reef', 'dusk', 'dawn',
      'bird', 'calf', 'deer', 'duck', 'fawn', 'fern', 'fish', 'flag', 'frog', 'gull',
      'hawk', 'kite', 'lake', 'leaf', 'lion', 'moon', 'palm', 'pear', 'pine', 'plum',
      // 5 letras
      'crane', 'tiger', 'eagle', 'frost', 'storm', 'blade', 'flame', 'amber', 'coral',
      'apple', 'mango', 'lemon', 'maple', 'cedar', 'piano', 'arrow', 'delta', 'scout',
      'raven', 'berry', 'beach', 'bison', 'bloom', 'cliff', 'cloud', 'comet', 'daisy',
      'giant', 'globe', 'goose', 'grape', 'grove', 'jewel', 'onyx',
      // 6 letras
      'falcon', 'violet', 'tennis', 'soccer', 'boxing', 'silver', 'golden', 'shadow',
      'cobalt', 'badger', 'beetle', 'canyon', 'canary', 'cherry', 'cougar', 'donkey',
      'dragon', 'forest', 'garden', 'marble', 'meadow', 'monkey', 'nature', 'planet',
      // 7 letras
      'crystal', 'thunder', 'surfing', 'bamboo', 'cricket', 'diamond', 'emerald',
      'blossom', 'buffalo', 'cheetah', 'cottage', 'dolphin', 'feather', 'leopard',
      'lobster', 'octopus', 'peacock', 'penguin', 'raccoon', 'tornado',
      // 8 letras
      'sapphire', 'capybara', 'cardinal', 'lavender', 'magnolia', 'mountain',
      'mushroom', 'paradise', 'pinecone', 'scorpion', 'sunshine', 'treasure',
      'twilight',
      // 9 letras
      'adventure', 'avalanche', 'butterfly', 'cathedral', 'challenge', 'crocodile',
      'discovery', 'evolution', 'fireplace', 'goldfinch', 'hurricane', 'jellyfish',
      'landscape', 'lightning', 'limestone', 'moonlight', 'nightfall', 'porcupine',
      'quicksand', 'rainstorm', 'sandstone', 'snowflake', 'spotlight', 'starlight',
      'submarine', 'sunflower', 'telescope', 'toadstool', 'waterfall', 'whirlpool',
      'wolverine', 'alligator', 'blackbird', 'partridge', 'succulent', 'swordfish',
      // 10 letras
      'chinchilla', 'helicopter', 'lighthouse', 'rainforest', 'wildflower',
    ],
  },
  office: {
    pt: [
      // 3 letras
      'ima',
      // 4 letras
      'capa', 'cabo', 'copo', 'fone', 'fita', 'foto', 'lupa', 'mapa', 'mesa', 'nota',
      'sala', 'tela', 'vaso', 'selo',
      // 5 letras
      'aviso', 'bloco', 'caixa', 'chave', 'cesto', 'cofre', 'ficha', 'folha', 'lapis',
      'lente', 'livro', 'mouse', 'papel', 'pasta', 'porta', 'regua', 'talao', 'tampa',
      'tinta', 'toner', 'senha', 'prego',
      // 6 letras
      'agenda', 'antena', 'balcao', 'bobina', 'camera', 'caneta', 'cartao', 'cordao',
      'cracha', 'diario', 'escada', 'gaveta', 'grampo', 'oficio', 'painel', 'parede',
      'piloto', 'quadro', 'recibo', 'tabela', 'tablet', 'tomada',
      // 7 letras
      'adesivo', 'armario', 'arquivo', 'cadeira', 'caderno', 'caixote', 'estante',
      'monitor', 'papelao', 'plotter', 'printer', 'relogio', 'scanner', 'sulfite',
      'teclado', 'tesoura',
      // 8 letras
      'apostila', 'carrinho', 'cubiculo', 'envelope', 'estilete', 'etiqueta',
      'fichario', 'marcador', 'notebook', 'panfleto', 'pendrive', 'planilha',
      'poltrona', 'roteador', 'telefone',
      // 9 letras
      'divisoria', 'gaveteiro', 'microfone', 'prancheta', 'relatorio',
      // 10 letras
      'calendario', 'formulario', 'grampeador', 'impressora', 'prateleira',
    ],
    en: [
      // 3 letras
      'bin', 'cup', 'fax', 'jar', 'key', 'log', 'mat', 'mug', 'pad', 'pen',
      'pin', 'tab', 'tip',
      // 4 letras
      'book', 'card', 'clip', 'cord', 'desk', 'disk', 'file', 'font', 'lamp', 'page',
      'plug', 'post', 'ream', 'ring', 'seal', 'sign', 'tape', 'tray', 'vase', 'wire',
      // 5 letras
      'bench', 'board', 'brush', 'cable', 'chair', 'chart', 'chest', 'drive', 'easel',
      'frame', 'glass', 'label', 'light', 'mouse', 'paint', 'paper', 'phone', 'photo',
      'plate', 'ruler', 'scale', 'sheet', 'shelf', 'slate', 'stamp', 'stand', 'table',
      'token', 'towel', 'vault',
      // 6 letras
      'basket', 'binder', 'button', 'drawer', 'eraser', 'folder', 'hammer', 'hanger',
      'holder', 'ladder', 'ledger', 'locker', 'marker', 'pencil', 'pocket', 'poster',
      'ribbon', 'router', 'screen', 'server', 'socket', 'switch', 'tablet', 'ticket',
      // 7 letras
      'adapter', 'armrest', 'blotter', 'cabinet', 'charger', 'divider', 'journal',
      'monitor', 'notepad', 'package', 'planner', 'plotter', 'postage', 'printer',
      'scanner', 'spinner', 'stapler', 'sticker', 'stencil', 'tracker',
      // 8 letras
      'calendar', 'computer', 'document', 'envelope', 'hardware', 'keyboard',
      'notebook', 'scissors', 'software', 'terminal', 'textbook',
      // 9 letras
      'briefcase', 'cartridge', 'container', 'dispenser', 'laminator', 'projector',
      'telephone', 'paperback',
      // 10 letras
      'calculator', 'microphone', 'smartphone', 'typewriter', 'whiteboard',
    ],
  },
} as const;

type Mode = keyof typeof WORD_LISTS;
type Lang = keyof typeof WORD_LISTS['general'];

const FLAGS = [
  { key: 'memorable', label: 'Memorable', description: 'real words' },
  { key: 'alphabetical', label: 'Alphabetical', description: 'A-Z a-z' },
  { key: 'numerical', label: 'Numerical', description: '0-9' },
  { key: 'symbols', label: 'Symbols', description: '!@#$%^&*...' },
] as const;

type FlagKey = typeof FLAGS[number]['key'];
type Flags = Record<FlagKey, boolean>;

// Flags locked when Memorable is active - all forced ON, but disabled
const MEMORABLE_LOCKED: FlagKey[] = ['numerical', 'symbols', 'alphabetical'];

const DEFAULT_FLAGS: Flags = {
  memorable: true,
  alphabetical: true,
  numerical: true,
  symbols: true,
};

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

function secureRandomInt(max: number): number {
  // Rejection sampling to avoid modulo bias
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  do {
    window.crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[secureRandomInt(arr.length)];
}

function pickRandomChar(s: string): string {
  return s.charAt(secureRandomInt(s.length));
}

function generateMemorablePortion(maxLen: number, words: readonly string[]): { text: string; entropy: number } {
  let result = '';
  let entropy = 0;
  let safety = 0;

  while (result.length < maxLen && safety < 200) {
    const remaining = maxLen - result.length;
    const fitting = words.filter((w) => w.length <= remaining);
    if (fitting.length === 0) break;
    const word = pickRandom(fitting);
    entropy += Math.log2(fitting.length);
    result += word.charAt(0).toUpperCase() + word.slice(1);
    safety++;
  }

  return { text: result, entropy };
}

const MEMORABLE_SYMBOLS = ['.', ',', '!', '@', '$', '%', '&', '*', '-', '_', '+', '=', '/'] as const;

type GenResult = { key: string; entropy: number };

function generateKey(flags: Flags, size: number, lang: Lang, mode: Mode): GenResult {
  if (flags.memorable) {
    // Pattern: word(size - 1 - numCount) + 1 symbol + 1–3 numbers
    //const numCount   = secureRandomInt(3) + 1; // 1, 2 or 3
    const numCount = 3; // always 3 numbers
    const wordSize = Math.max(1, size - 1 - numCount);
    const { text: wordPortion, entropy: wordEntropy } = generateMemorablePortion(wordSize, WORD_LISTS[mode][lang]);
    const symbol = pickRandom(MEMORABLE_SYMBOLS);
    const numbers = Array.from({ length: numCount }, () =>
      pickRandomChar(CHAR_SETS.numerical)
    ).join('');
    const entropy = wordEntropy
      //+ Math.log2(3)                            // if numCount choice
      + Math.log2(MEMORABLE_SYMBOLS.length)     // symbol choice
      + Math.log2(10) * numCount;               // digits
    return { key: wordPortion + symbol + numbers, entropy };
  }

  // Standard mode
  let pool = '';
  if (flags.alphabetical) pool += CHAR_SETS.alphabetical;
  if (flags.numerical) pool += CHAR_SETS.numerical;
  if (flags.symbols) pool += CHAR_SETS.symbols;
  if (!pool) pool = CHAR_SETS.alphabetical;

  const key = Array.from({ length: size }, () => pickRandomChar(pool)).join('');
  return { key, entropy: size * Math.log2(pool.length) };
}

// 30 bits ≈ "very strong" benchmark; bar fills proportionally up to that
const STRENGTH_FULL_BITS = 35;

function strengthInfo(bits: number) {
  const pct = Math.max(0, Math.min(100, (bits / STRENGTH_FULL_BITS) * 100));
  if (bits < 20) return { label: 'weak', bar: 'bg-red-500', text: 'text-red-600', pct };
  if (bits < 24) return { label: 'fair', bar: 'bg-amber-400', text: 'text-amber-600', pct };
  if (bits < 28) return { label: 'strong', bar: 'bg-lime-500', text: 'text-lime-600', pct };
  return { label: 'very strong', bar: 'bg-green-500', text: 'text-green-600', pct };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'kyru:prefs';

export default function KyruPage() {
  const [flags, setFlags] = useState<Flags>(DEFAULT_FLAGS);
  const [size, setSize] = useState(16);
  const [lang, setLang] = useState<Lang>('en');
  const [mode, setMode] = useState<Mode>('general');
  const [key, setKey] = useState('');
  const [entropy, setEntropy] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate preferences from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<{
          flags: Flags; size: number; lang: Lang; mode: Mode;
        }>;
        if (saved.flags) setFlags(saved.flags);
        if (typeof saved.size === 'number') setSize(saved.size);
        if (saved.lang === 'pt' || saved.lang === 'en') setLang(saved.lang);
        if (saved.mode === 'general' || saved.mode === 'office') setMode(saved.mode);
      }
    } catch {
      // Ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // Persist preferences after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ flags, size, lang, mode }),
      );
    } catch {
      // Storage may be unavailable (private mode, quota)
    }
  }, [flags, size, lang, mode, hydrated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = generateKey(flags, size, lang, mode);
      setKey(result.key);
      setEntropy(result.entropy);
      setCopied(false);
    }, 120);
    return () => clearTimeout(timer);
  }, [flags, size, lang, mode]);

  const toggleFlag = (flagKey: FlagKey) => {
    // Numerical and Symbols are locked while Memorable is on
    if (flags.memorable && MEMORABLE_LOCKED.includes(flagKey)) return;

    setFlags((prev) => {
      const next = { ...prev, [flagKey]: !prev[flagKey] };
      // Turning Memorable ON forces all locked flags to true (active but blocked)
      if (flagKey === 'memorable' && next.memorable) {
        next.numerical = true;
        next.symbols = true;
        next.alphabetical = true;
      }
      return next;
    });
  };

  const handleGenerate = () => {
    const result = generateKey(flags, size, lang, mode);
    setKey(result.key);
    setEntropy(result.entropy);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!key) return;
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeLabels = FLAGS.filter((f) => flags[f.key]).map((f) => f.label);
  const isLocked = (flagKey: FlagKey) =>
    flags.memorable && MEMORABLE_LOCKED.includes(flagKey);

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f1f5f9_30%,#cbd5e1_70%,#94a3b8_100%)]">
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 xl:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

        {/* Left column */}
        <div className="space-y-10">

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              <span style={{ fontFamily: 'var(--font-michroma)' }}>KYRU</span>
              <span className="block text-base md:text-lg font-medium text-slate-500 mt-2">
                Password Generator
              </span>
            </h1>
            <p className="text-slate-600 text-lg">
              Generate strong, random passwords instantly. Free and secure no signup required.
              Gere senhas fortes e aleatórias. Grátis e seguro, sem cadastro.
            </p>
          </div>

          {/* Flags */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Parameters
            </p>
            <div className="flex flex-wrap gap-3">
              {FLAGS.map((flag) => {
                const isOn = flags[flag.key];
                const locked = isLocked(flag.key);

                return (
                  <button
                    key={flag.key}
                    onClick={() => toggleFlag(flag.key)}
                    aria-pressed={isOn}
                    aria-disabled={locked}
                    title={locked ? 'uncheck memorable to unlock' : undefined}
                    className={`
                    flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left
                    transition-all duration-200 min-w-[110px]
                    ${locked
                        ? 'border-red-400/40 bg-gradient-to-r from-red-600/5 to-slate-900/5 cursor-not-allowed opacity-30'
                        : isOn
                          ? 'border-red-500 bg-gradient-to-r from-red-600/10 to-slate-900/10 shadow-[0_0_12px_1px_rgba(239,68,68,0.3)]'
                          : 'border-slate-300 bg-white/50 hover:border-red-400'
                      }
                  `}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className={`w-2 h-2 rounded-full transition-colors ${isOn ? 'bg-red-500' : 'bg-slate-400'
                        }`} />
                      {locked && (
                        <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${isOn ? 'text-red-700' : 'text-slate-700'
                      }`}>
                      {flag.label}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {flag.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language + Mode */}
          <div className={`flex flex-wrap gap-8 transition-opacity duration-200 ${flags.memorable ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>

            {/* Language */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Language
                </p>
                {!flags.memorable && (
                  <span className="text-xs text-slate-400 italic">
                    available with Memorable
                  </span>
                )}
              </div>
              <div role="radiogroup" aria-label="Word language" className="flex gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 w-fit">
                {(['en', 'pt'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    role="radio"
                    aria-checked={lang === l}
                    onClick={() => setLang(l)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${lang === l
                      ? 'bg-gradient-to-r from-red-600 to-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-red-600'
                      }`}
                  >
                    {l === 'pt' ? 'PT-BR' : 'EN-US'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Mode
              </p>
              <div role="radiogroup" aria-label="Word mode" className="flex gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 w-fit">
                {(['general', 'office'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    role="radio"
                    aria-checked={mode === m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === m
                      ? 'bg-gradient-to-r from-red-600 to-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-red-600'
                      }`}
                  >
                    {m === 'general' ? 'GENERAL' : 'OFFICE'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Size slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Size
              </p>
              <span className="text-2xl font-mono font-bold text-red-600 tabular-nums">
                {size}
              </span>
            </div>
            <input
              type="range"
              min={6}
              max={48}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              aria-label="Password size"
              aria-valuetext={`${size} characters`}
              className="w-full h-2 rounded-full appearance-none cursor-pointer
              bg-slate-200
              accent-red-500"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>6</span>
              <span>48</span>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl font-bold text-lg text-white
            bg-gradient-to-r from-red-600 to-slate-900
            hover:from-red-500 hover:to-slate-900
            hover:shadow-[0_0_20px_2px_rgba(239,68,68,0.5)]
            active:scale-95 transition-all duration-200"
          >
            Generate password
          </button>

        </div>
        {/* End left column */}

        {/* Right column */}
        <div className="space-y-10">

          {/* Output */}
          <div className="space-y-4">

            {/* Key display */}
            <div className="relative bg-white border-2 border-red-500/50 rounded-xl px-5 py-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-mono">
                PASSWORD
              </p>
              <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="font-mono text-lg md:text-xl text-red-700 break-all leading-relaxed pr-12"
              >
                {key}
              </p>
              {(() => {
                const s = strengthInfo(entropy);
                const roundedBits = Math.round(entropy);
                return (
                  <div className="mt-4 flex items-center gap-3">
                    <div
                      role="progressbar"
                      aria-label="Password strength"
                      aria-valuenow={roundedBits}
                      aria-valuemin={0}
                      aria-valuemax={STRENGTH_FULL_BITS}
                      aria-valuetext={`${roundedBits} bits, ${s.label}`}
                      className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden"
                    >
                      <div
                        className={`h-full transition-all duration-300 ${s.bar}`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                    <div className={`flex items-center text-xs font-mono font-semibold w-44 shrink-0 text-left ${s.text}`}>
                      <span className="w-[72px]">{roundedBits} bits</span>
                      <span>· {s.label}</span>
                    </div>
                  </div>
                );
              })()}
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-red-500
                  hover:bg-red-50 transition-all"
                aria-label="Copy password"
                title="Copy"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Params summary */}
            <div className="bg-slate-100 rounded-xl px-5 py-4 border border-slate-200 space-y-1 font-mono text-sm">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider"> PARAMETERS </p>
              {FLAGS.map((f) => (
                <p key={f.key}>
                  <span className="text-slate-500">{f.label}:</span>{' '}
                  <span className={flags[f.key] ? 'text-red-500' : 'text-slate-500'}>
                    {flags[f.key] ? 'true' : 'false'}
                  </span>
                  {isLocked(f.key) && (
                    <span className="text-red-400/60 text-xs ml-1">(locked)</span>
                  )}
                </p>
              ))}
              <p>
                <span className="text-slate-500">Size:</span>{' '}
                <span className="text-red-500">{size}</span>
              </p>
              {flags.memorable && (
                <p className="pt-1 text-xs text-slate-400">
                  Pattern: words + 1 symbol + 3 numbers (total {size})
                </p>
              )}
              {!flags.memorable && activeLabels.length > 0 && (
                <p className="pt-1 text-xs text-slate-400">
                  Pool: {activeLabels.join(' + ')}
                </p>
              )}
            </div>

            <div className="bg-slate-100 rounded-xl px-5 py-4 border border-slate-200 space-y-1 font-mono text-sm">
              <p className="pt-1 text-xs text-slate-400">
                NOTE: Strength ratings are calibrated for everyday use as email, social media, and general services. For offline attack resistance (e.g. leaked database hashes), disable Memorable mode and target 80+ bits.
              </p>
            </div>

          </div>

        </div>
        {/* End right column */}

      </div>

      {/* Footer */}
      <footer className="w-full pb-2">
        <p className="text-xs text-white text-center">
          Built by{' '}
          <a
            href="https://www.linkedin.com/in/sergio-guerrato"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors"
          >
            Sérgio Guerrato
          </a>
        </p>
      </footer>
    </div>
  );
}
