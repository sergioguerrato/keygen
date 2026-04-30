'use client';

import { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CHAR_SETS = {
  alphabetical: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numerical:    '0123456789',
  symbols:      '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

const WORD_LISTS = {
  pt: [
    // 3–4 letras
    'lua','sol','rio','mar','paz','rei','luz','mel','asa','voz',
    'lobo','urso','gato','leao','pato','jade','ouro','neve','fogo','gelo',
    // 5–7 letras
    'tigre','aguia','cobra','cisne','veado','manga','caju','pedra','chama','prata',
    'futebol','tenis','boxe','surfe','volei','coral','safira','rubi','floresta',
    'oceano','trovao','cristal','tucano','gaviao','goiaba','geleira','montanha',
    // 8 letras
    'esmeralda','capivara','maracuja','relampago','basquete','diamante','abacaxi', 'mariposa',
    // 9 letras
    'borboleta','crocodilo','horizonte','jacaranda','labirinto','submarino',
    'pavimento','chocolate','carinhoso','vitorioso','queimados',
  ],
  en: [
    // 3–4 letras
    'oak','fox','gem','axe','arc',
    'wolf','bear','jade','rose','iron','gold','blue','reef','dusk','dawn',
    // 5–7 letras
    'crane','tiger','eagle','frost','storm','blade','flame','amber','coral','onyx',
    'apple','mango','lemon','maple','cedar','piano','arrow','delta','scout','raven',
    'falcon','violet','tennis','soccer','boxing','silver','golden','shadow','cobalt',
    'crystal','thunder','surfing','bamboo','cricket','diamond','emerald','sapphire',
    // 9 letras
    'adventure','avalanche','butterfly','cathedral','challenge','crocodile',
    'discovery','evolution','fireplace','goldfinch','hurricane','jellyfish',
    'landscape','lightning','limestone','moonlight','nightfall','porcupine',
    'quicksand','rainstorm','sandstone','snowflake','spotlight','starlight',
    'submarine','sunflower','telescope','toadstool','waterfall','whirlpool','wolverine',
  ],
} as const;

type Lang = keyof typeof WORD_LISTS;

const FLAGS = [
  { key: 'memorable',    label: 'Memorable',    description: 'real words'      },
  { key: 'alphabetical', label: 'Alphabetical', description: 'A-Z a-z'         },
  { key: 'numerical',    label: 'Numerical',    description: '0-9'              },
  { key: 'symbols',      label: 'Symbols',      description: '!@#$%^&*...'     },
] as const;

type FlagKey = typeof FLAGS[number]['key'];
type Flags = Record<FlagKey, boolean>;

// Flags locked when Memorable is active — all forced ON, but disabled
const MEMORABLE_LOCKED: FlagKey[] = ['numerical', 'symbols', 'alphabetical'];

const DEFAULT_FLAGS: Flags = {
  memorable:    true,
  alphabetical: true,
  numerical:    true,
  symbols:      true,
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

function pickRandom<T>(arr: T[]): T {
  return arr[secureRandomInt(arr.length)];
}

function generateMemorablePortion(maxLen: number, words: readonly string[]): { text: string; entropy: number } {
  let result = '';
  let entropy = 0;
  let safety = 0;

  while (result.length < maxLen && safety < 200) {
    const remaining = maxLen - result.length;
    const fitting   = words.filter((w) => w.length <= remaining);
    if (fitting.length === 0) break;
    const word = pickRandom([...fitting]);
    entropy += Math.log2(fitting.length);
    result += word.charAt(0).toUpperCase() + word.slice(1);
    safety++;
  }

  return { text: result, entropy };
}

const MEMORABLE_SYMBOLS = ['.', '!', '@'] as const;

type GenResult = { key: string; entropy: number };

function generateKey(flags: Flags, size: number, lang: Lang): GenResult {
  if (flags.memorable) {
    // Pattern: word(size - 1 - numCount) + 1 symbol + 1–3 numbers
    const numCount   = secureRandomInt(3) + 1; // 1, 2 or 3
    const wordSize   = Math.max(1, size - 1 - numCount);
    const { text: wordPortion, entropy: wordEntropy } = generateMemorablePortion(wordSize, WORD_LISTS[lang]);
    const symbol     = pickRandom([...MEMORABLE_SYMBOLS]);
    const numbers    = Array.from({ length: numCount }, () =>
      pickRandom([...CHAR_SETS.numerical])
    ).join('');
    const entropy = wordEntropy
      + Math.log2(3)                            // numCount choice
      + Math.log2(MEMORABLE_SYMBOLS.length)     // symbol choice
      + Math.log2(10) * numCount;               // digits
    return { key: wordPortion + symbol + numbers, entropy };
  }

  // Standard mode
  let pool = '';
  if (flags.alphabetical) pool += CHAR_SETS.alphabetical;
  if (flags.numerical)    pool += CHAR_SETS.numerical;
  if (flags.symbols)      pool += CHAR_SETS.symbols;
  if (!pool)              pool  = CHAR_SETS.alphabetical;

  const key = Array.from({ length: size }, () => pickRandom([...pool])).join('');
  return { key, entropy: size * Math.log2(pool.length) };
}

// 100 bits ≈ "very strong" benchmark; the bar fills proportionally up to that
const STRENGTH_FULL_BITS = 100;

function strengthInfo(bits: number) {
  const pct = Math.max(0, Math.min(100, (bits / STRENGTH_FULL_BITS) * 100));
  if (bits < 40) return { label: 'weak',        bar: 'bg-red-500',    text: 'text-red-600',    pct };
  if (bits < 60) return { label: 'fair',        bar: 'bg-orange-500', text: 'text-orange-600', pct };
  if (bits < 80) return { label: 'strong',      bar: 'bg-lime-500',   text: 'text-lime-600',   pct };
  return            { label: 'very strong', bar: 'bg-green-500',  text: 'text-green-600',  pct };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function KeygenPage() {
  const [flags, setFlags]   = useState<Flags>(DEFAULT_FLAGS);
  const [size, setSize]     = useState(12);
  const [lang, setLang]     = useState<Lang>('en');
  const [key, setKey]       = useState('');
  const [entropy, setEntropy] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = generateKey(flags, size, lang);
      setKey(result.key);
      setEntropy(result.entropy);
      setCopied(false);
    }, 120);
    return () => clearTimeout(timer);
  }, [flags, size, lang]);

  const toggleFlag = (flagKey: FlagKey) => {
    // Numerical and Symbols are locked while Memorable is on
    if (flags.memorable && MEMORABLE_LOCKED.includes(flagKey)) return;

    setFlags((prev) => {
      const next = { ...prev, [flagKey]: !prev[flagKey] };
      // Turning Memorable ON forces all locked flags to true (active but blocked)
      if (flagKey === 'memorable' && next.memorable) {
        next.numerical    = true;
        next.symbols      = true;
        next.alphabetical = true;
      }
      return next;
    });
  };

  const handleGenerate = () => {
    const result = generateKey(flags, size, lang);
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
      <div className="flex-1 max-w-6xl w-full mx-auto px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* Left column */}
        <div className="space-y-10">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            KEYGEN
          </h1>
          <p className="text-slate-600 text-lg">
            Secure password generator with configurable parameters.
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
                      ? 'border-red-400/40 bg-red-600/5 cursor-not-allowed opacity-30'
                      : isOn
                        ? 'border-red-500 bg-red-600/10 shadow-[0_0_12px_1px_rgba(239,68,68,0.3)]'
                        : 'border-slate-300 bg-white/50 hover:border-red-400'
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      isOn ? 'bg-red-500' : 'bg-slate-400'
                    }`} />
                    {locked && (
                      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${
                    isOn ? 'text-red-700' : 'text-slate-700'
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

        {/* Language */}
        <div className={`space-y-3 transition-opacity duration-200 ${flags.memorable ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
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
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  lang === l
                    ? 'bg-gradient-to-r from-red-600 to-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-red-600'
                }`}
              >
                {l === 'pt' ? 'PT-BR' : 'EN-US'}
              </button>
            ))}
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
            max={16}
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
            <span>16</span>
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
        <div className="space-y-4 animate-fade-in">

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
                return (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${s.bar}`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono font-semibold ${s.text}`}>
                      {Math.round(entropy)} bits · {s.label}
                    </span>
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
                  Pattern: word + . ! @ + 1–3 numbers (total {size})
                </p>
              )}
              {!flags.memorable && activeLabels.length > 0 && (
                <p className="pt-1 text-xs text-slate-400">
                  Pool: {activeLabels.join(' + ')}
                </p>
              )}
            </div>

        </div>

        </div>
        {/* End right column */}

      </div>

      {/* Footer */}
      <footer className="w-full pb-2">
        <p className="text-xs text-app-muted text-center">
          Built by{' '}
          <a
            href="https://www.linkedin.com/in/sergio-guerrato"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-app-primary transition-colors"
          >
            Sérgio Guerrato
          </a>
        </p>
      </footer>
    </div>
  );
}
