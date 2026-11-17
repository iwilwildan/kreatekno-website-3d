// Pictures on the rack's open books (K7, issue #33): one per article on the right-hand page, and the five as a fan
// of small cards over "Lihat semua artikel". Drawn from code as flat SVG in the lobby's palette (navy lines, each
// book's cover colour, the cream page, a yellow sparkle for the AI). Decorative: no text, hidden from screen readers.
import type { ReactNode } from "react";

const N = "#131951",
  PAGE = "#fffdf6",
  Y = "#f3dc78",
  RED = "#e5484d",
  SKIN = "#f2c9a0",
  PURPLE = "#8a5cc8",
  NAVY = "#2f4f8a",
  TEAL = "#23897e";
const TINT: Record<string, string> = { [PURPLE]: "#e7dcf7", [NAVY]: "#d9e2f2", [TEAL]: "#cfeee8" };

/** A four-pointed sparkle (the AI at work). */
const Star = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <path
    d={`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`}
    fill={Y}
    stroke={N}
    strokeWidth={1.4}
  />
);
const Shadow = ({ x, y, rx }: { x: number; y: number; rx: number }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={3.6} fill={N} opacity={0.12} />
);
/** A line of text on paper. */
const Ln = ({
  x1,
  y,
  x2,
  o = 0.22,
  w = 3,
  c = N,
}: {
  x1: number;
  y: number;
  x2: number;
  o?: number;
  w?: number;
  c?: string;
}) => <line x1={x1} y1={y} x2={x2} y2={y} stroke={c} strokeOpacity={o} strokeWidth={w} />;

/** Admin: a clipboard of five tasks, three already ticked. */
function Admin() {
  return (
    <>
      <Shadow x={60} y={94} rx={34} />
      <rect x={30} y={12} width={60} height={80} rx={8} fill={PURPLE} stroke={N} strokeWidth={2} />
      <rect x={36} y={20} width={48} height={66} rx={4} fill={PAGE} stroke={N} strokeWidth={1.4} />
      <rect x={47} y={7} width={26} height={11} rx={4} fill={Y} stroke={N} strokeWidth={1.8} />
      {[30, 41, 52, 63, 74].map((y, i) => (
        <g key={y}>
          {i < 3 ? (
            <>
              <circle cx={44} cy={y} r={4.2} fill={PURPLE} stroke={N} strokeWidth={1.2} />
              <path d={`M42 ${y}l1.5 1.6 2.8-3.2`} stroke="#fff" strokeWidth={1.6} />
            </>
          ) : (
            <circle cx={44} cy={y} r={4.2} fill={PAGE} stroke={N} strokeOpacity={0.35} strokeWidth={1.2} />
          )}
          <Ln x1={52} y={y} x2={[78, 72, 76, 70, 74][i]} o={i < 3 ? 0.18 : 0.3} />
        </g>
      ))}
      <Star x={97} y={20} r={9} />
      <Star x={106} y={36} r={4.5} />
    </>
  );
}

/** Melayani pembeli: a customer's question and the reply on its way. */
function Service() {
  return (
    <>
      <Shadow x={60} y={94} rx={40} />
      <path
        d="M22 14h46a10 10 0 0 1 10 10v12a10 10 0 0 1-10 10H32l-10 8 2-8a10 10 0 0 1-12-10V24a10 10 0 0 1 10-10Z"
        fill={PAGE}
        stroke={N}
        strokeWidth={2}
      />
      <Ln x1={24} y={26} x2={64} o={0.3} />
      <Ln x1={24} y={35} x2={52} o={0.3} />
      <path
        d="M52 48h46a10 10 0 0 1 10 10v12a10 10 0 0 1-10 10h-2l2 9-12-9H52a10 10 0 0 1-10-10V58a10 10 0 0 1 10-10Z"
        fill={NAVY}
        stroke={N}
        strokeWidth={2}
      />
      <circle cx={64} cy={64} r={3.4} fill="#fff" />
      <circle cx={75} cy={64} r={3.4} fill="#fff" opacity={0.75} />
      <circle cx={86} cy={64} r={3.4} fill="#fff" opacity={0.5} />
      <Star x={104} y={46} r={8} />
      <circle cx={14} cy={64} r={3} fill={TINT[NAVY]} stroke={N} strokeWidth={1.2} />
    </>
  );
}

/** Staf: a staff member at the laptop, the AI on its screen. */
function Team() {
  return (
    <>
      <Shadow x={60} y={94} rx={44} />
      <rect x={14} y={50} width={34} height={40} rx={15} fill={TEAL} stroke={N} strokeWidth={2} />
      <circle cx={31} cy={36} r={12} fill={SKIN} stroke={N} strokeWidth={2} />
      <path d="M19.5 34a11.5 11.5 0 0 1 23 0c-4-4-10-5.5-15-3-3 1.5-5.5 2-8 3Z" fill={N} />
      <circle cx={35} cy={38} r={1.3} fill={N} />
      <path d="M42 62l16 6" stroke={N} strokeWidth={6.5} />
      <path d="M42 62l16 6" stroke={TEAL} strokeWidth={3.6} />
      <rect x={58} y={30} width={48} height={34} rx={4} fill={PAGE} stroke={N} strokeWidth={2} />
      <rect x={63} y={35} width={38} height={24} rx={2} fill={TINT[TEAL]} />
      <path d="M52 66h60l-4 8H56Z" fill={TEAL} stroke={N} strokeWidth={2} />
      <Star x={82} y={47} r={8} />
      <Ln x1={66} y={41} x2={72} o={0.25} w={2.4} />
      <circle cx={50} cy={26} r={2.2} fill={N} opacity={0.35} />
      <circle cx={57} cy={22} r={2.2} fill={N} opacity={0.35} />
    </>
  );
}

/** Promosi: this week's post on a phone, next to a calendar with a post each week. */
function Promo() {
  return (
    <>
      <Shadow x={60} y={94} rx={42} />
      <rect x={12} y={24} width={46} height={50} rx={6} fill={PAGE} stroke={N} strokeWidth={2} />
      <path d="M12 30a6 6 0 0 1 6-6h34a6 6 0 0 1 6 6v4H12Z" fill={TEAL} stroke={N} strokeWidth={2} />
      <line x1={22} y1={19} x2={22} y2={27} stroke={N} strokeWidth={2.4} />
      <line x1={48} y1={19} x2={48} y2={27} stroke={N} strokeWidth={2.4} />
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2].map((c) =>
          r === 1 && c === 1 ? (
            <circle key={`${r}${c}`} cx={36} cy={54} r={3.6} fill={Y} stroke={N} strokeWidth={1.2} />
          ) : (
            <circle
              key={`${r}${c}`}
              cx={24 + c * 12}
              cy={44 + r * 10}
              r={2.4}
              fill={TEAL}
              opacity={r < 1 || (r === 1 && c < 1) ? 0.9 : 0.25}
            />
          ),
        ),
      )}
      <rect x={60} y={8} width={42} height={82} rx={9} fill={N} />
      <rect x={64} y={15} width={34} height={68} rx={4} fill={PAGE} />
      <rect x={67} y={19} width={28} height={24} rx={3} fill={TINT[TEAL]} />
      <circle cx={88} cy={26} r={3.6} fill={Y} />
      <path d="M67 40l8-9 6 6 4-3 10 9v-1a3 3 0 0 1-3 3H70a3 3 0 0 1-3-3Z" fill={TEAL} />
      <path d="M71 51.5c0-2 2.6-3 3.8-1 1.2-2 3.8-1 3.8 1 0 2.4-3.8 4.6-3.8 4.6s-3.8-2.2-3.8-4.6Z" fill={RED} />
      <Ln x1={82} y={51} x2={93} o={0.25} w={2.4} />
      <Ln x1={70} y={61} x2={93} o={0.25} w={2.4} />
      <Ln x1={70} y={68} x2={86} o={0.25} w={2.4} />
      <Star x={106} y={14} r={7} />
    </>
  );
}

/** Keuangan: the day's sales receipt and the bars going up. */
function Money() {
  const zig = "l-3.5 4l-3.5-4".repeat(6);
  const up = "M64 56l14-12 10 6 18-20";
  return (
    <>
      <Shadow x={60} y={94} rx={44} />
      <path d={`M14 10h42v76${zig}Z`} fill={PAGE} stroke={N} strokeWidth={2} />
      <Ln x1={21} y={22} x2={49} o={0.3} />
      <Ln x1={21} y={32} x2={42} />
      <Ln x1={21} y={41} x2={46} />
      <Ln x1={21} y={50} x2={38} />
      <line x1={21} y1={60} x2={49} y2={60} stroke={N} strokeOpacity={0.3} strokeWidth={1.2} strokeDasharray="2 3" />
      <Ln x1={21} y={70} x2={49} o={1} w={3.4} c={PURPLE} />
      <line x1={62} y1={86} x2={112} y2={86} stroke={N} strokeWidth={2} />
      <rect x={66} y={66} width={11} height={20} rx={3} fill={TINT[PURPLE]} stroke={N} strokeWidth={1.6} />
      <rect x={81} y={52} width={11} height={34} rx={3} fill="#c4abeb" stroke={N} strokeWidth={1.6} />
      <rect x={96} y={36} width={11} height={50} rx={3} fill={PURPLE} stroke={N} strokeWidth={1.6} />
      <path d={up} stroke={N} strokeWidth={5.4} />
      <path d={up} stroke={Y} strokeWidth={2.8} />
      <path d="M98 28l9-2-1 9Z" fill={Y} stroke={N} strokeWidth={1.6} />
      <circle cx={52} cy={80} r={8} fill={Y} stroke={N} strokeWidth={2} />
      <circle cx={52} cy={80} r={4} stroke={N} strokeOpacity={0.4} strokeWidth={1.4} />
    </>
  );
}

/** The articles' pictures, in the order of MagazineRack's ARTICLES, with each book's cover colour. */
export const BOOK_ART = {
  admin: { draw: Admin, cover: PURPLE },
  service: { draw: Service, cover: NAVY },
  team: { draw: Team, cover: TEAL },
  promo: { draw: Promo, cover: TEAL },
  money: { draw: Money, cover: PURPLE },
} as const;
export type BookArtKey = keyof typeof BOOK_ART;

const Svg = ({ viewBox, className, children }: { viewBox: string; className: string; children: ReactNode }) => (
  <svg
    viewBox={viewBox}
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    focusable="false"
  >
    {children}
  </svg>
);

/** One article's picture, for the right-hand page of its book. */
export function BookArt({ k }: { k: BookArtKey }) {
  const Draw = BOOK_ART[k].draw;
  return (
    <Svg viewBox="0 0 120 100" className="book-art">
      <Draw />
    </Svg>
  );
}

/** The five pictures as small cards fanned out, over "Lihat semua artikel". */
export function RackAllArt({ keys }: { keys: readonly BookArtKey[] }) {
  const mid = (keys.length - 1) / 2;
  return (
    <Svg viewBox="-6 2 172 68" className="rack-art">
      <ellipse cx={80} cy={64} rx={64} ry={4} fill={N} opacity={0.1} />
      {keys.map((k, i) => {
        const x = 18 + i * 25,
          { draw: Draw, cover } = BOOK_ART[k];
        return (
          <g key={k} transform={`rotate(${(i - mid) * 8} ${x + 16} 70)`}>
            <rect x={x} y={14} width={32} height={42} rx={4} fill={cover} stroke={N} strokeWidth={1.6} />
            <rect x={x + 3} y={17} width={26} height={36} rx={2} fill={PAGE} />
            <svg x={x + 3} y={22} width={26} height={26} viewBox="0 0 120 100">
              <Draw />
            </svg>
          </g>
        );
      })}
    </Svg>
  );
}
