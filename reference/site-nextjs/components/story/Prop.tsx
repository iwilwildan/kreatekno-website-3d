import type { CSSProperties, ElementType, ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Position of a prop in % of the footage frame: top-left corner (or distance from the bottom) and width.
 * `h` fixes the height, for copy printed on a surface of the footage; without it the copy sets the height.
 */
type Pos = { x: number; w: number; h?: number } & ({ y: number; b?: never } | { b: number; y?: never });

type Props = {
  as?: ElementType;
  /** Key into REST in beats.ts: how the prop sits in its keyframe and how it moves with the camera. */
  kind: string;
  /** Name shown in the zones tool. */
  label: string;
  /**
   * 16:9 desktop and 9:16 phone positions (STORY-STAGE.md section 3). On phones most copy is a card in the
   * empty band at the bottom of the frame: bottom-anchored props of one beat stack upwards in DOM order.
   */
  desk: Pos;
  phone: Pos;
  className?: string;
  /** Parallax depth for truck and arc moves (nearer props move faster). */
  depth?: number;
  /** Large props with lots of text skip the motion blur. */
  noBlur?: boolean;
  /** Spans the full frame width on phones; never narrowed or shifted by the fit pass. */
  fullX?: boolean;
  /**
   * Surface of the footage the prop is printed on (a track in footage.ts): during the next camera move
   * it rides on that surface instead of the generic move. A string applies to both orientations.
   */
  track?: string | { desk?: string; phone?: string };
  children: ReactNode;
  [attr: `data-${string}`]: string | undefined;
};

/** One piece of copy placed in the scene (a `.pc`), as in the prototype. */
export function Prop({
  as: Tag = "div",
  kind,
  label,
  desk,
  phone,
  className = "",
  depth,
  noBlur,
  fullX,
  track,
  children,
  ...data
}: Props) {
  const tracks = typeof track === "string" ? { desk: track, phone: track } : (track ?? {});
  // each orientation is anchored to the top (y) or the bottom (b) on its own; the unset side stays auto
  const style = {
    "--dx": desk.x,
    "--dw": desk.w,
    "--mx": phone.x,
    "--mw": phone.w,
    ...(desk.b !== undefined ? { "--db": desk.b } : { "--dy": desk.y }),
    ...(phone.b !== undefined ? { "--mb": phone.b } : { "--my": phone.y }),
    ...(desk.h !== undefined && { "--dh": desk.h }),
    ...(phone.h !== undefined && { "--mh": phone.h }),
  } as unknown as CSSProperties;

  return (
    <Tag
      className={cx("pc", kind, className)}
      style={style}
      data-kind={kind}
      data-prop={label}
      data-depth={depth}
      data-blur={noBlur ? "0" : undefined}
      data-full-x={fullX ? "" : undefined}
      data-track-desk={tracks.desk}
      data-track-phone={tracks.phone}
      {...data}
    >
      {children}
    </Tag>
  );
}

/** Soft-light layer that gives a surface its keyframe's light. */
export function Lit() {
  return <i className="lit" aria-hidden="true" />;
}
