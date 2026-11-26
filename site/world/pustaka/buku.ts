// The books Andi serves on the library desk (Pustaka P4): standing, cover to the front like the shelf books on
// the page (category colour, darker spine, cream cover page with the RackArt picture, category and title), with
// cream page edges between the boards. They fly from the wall bookcase to the desk and back; layout, flight, tags
// and the summary card are the desk objects shared with the Solutions shop (world/meja/kotak.ts).
import * as THREE from "three";
import { buildDeskObjects } from "../meja/kotak";

export type DeskBookInput = { key: string; color: string; category: string; title: string };

// the shelf book's proportions (216 x 305 px), 8 cm thick
export const BOOK = { w: 0.43, h: 0.607, d: 0.08 };
const BOARD = 0.012;
const TEX_W = 432,
  TEX_H = 610;

/** Where on the wall bookcase book `index` comes from (and goes back to): the middle and top shelves. */
export function shelfSpot(index: number) {
  const row = index % 2,
    col = Math.floor(index / 2);
  return new THREE.Vector3(3.5 - 0.55 + col * 0.4 + row * 0.2, (row ? 2.75 : 2.05) + 0.28, -3.95);
}

/** The cover drawn on a canvas: colour, spine, cream page with the article's picture, category and title. */
function drawCover(g: CanvasRenderingContext2D, input: DeskBookInput, art: HTMLImageElement | null, font: string) {
  const s = TEX_W / 216;
  g.clearRect(0, 0, TEX_W, TEX_H);
  g.fillStyle = input.color;
  g.fillRect(0, 0, TEX_W, TEX_H);
  // spine with its two binding lines
  g.fillStyle = "rgba(5,7,31,0.24)";
  g.fillRect(0, 0, 13 * s, TEX_H);
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.fillRect(0, TEX_H * 0.12, 13 * s, 3);
  g.fillRect(0, TEX_H * 0.868, 13 * s, 3);
  // category pill
  g.font = `700 ${11 * s}px ${font}`;
  const label = input.category;
  const pw = g.measureText(label).width + 18 * s;
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.roundRect(22 * s, 13 * s, pw, 20 * s, 10 * s);
  g.fill();
  g.fillStyle = "#131951";
  g.textBaseline = "middle";
  g.fillText(label, 31 * s, 23.5 * s);
  // cream cover page
  const x0 = 22 * s,
    y0 = 42 * s,
    w = (216 - 22 - 10) * s,
    h = (305 - 42 - 30) * s;
  g.fillStyle = "#fffdf6";
  g.beginPath();
  g.roundRect(x0, y0, w, h, 6 * s);
  g.fill();
  if (art) g.drawImage(art, x0 + 8 * s, y0 + 8 * s, 70 * s, 58 * s);
  // title, up to five lines
  g.fillStyle = "#131951";
  g.textBaseline = "alphabetic";
  g.font = `700 ${15 * s}px ${font}`;
  const words = input.title.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width > w - 20 * s && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  lines.slice(0, 6).forEach((text, k) => g.fillText(text, x0 + 10 * s, y0 + 92 * s + k * 18 * s));
}

/** The page's own RackArt picture for this article (the shelf's SVG), as an image to draw on the cover. */
function artImage(key: string, done: (img: HTMLImageElement) => void) {
  const svg = document.querySelector<SVGSVGElement>(`.rak-buku [data-key="${key}"] .sampul-art svg`);
  if (!svg) return;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "240");
  clone.setAttribute("height", "200");
  const img = new Image();
  img.onload = () => done(img);
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
}

export function buildDeskBooks(scene: THREE.Scene, font: string) {
  const front = new THREE.BoxGeometry(BOOK.w, BOOK.h, BOARD);
  front.translate(0, 0, BOOK.d / 2 - BOARD / 2);
  const back = new THREE.BoxGeometry(BOOK.w, BOOK.h, BOARD);
  back.translate(0, 0, -BOOK.d / 2 + BOARD / 2);
  const pagesGeometry = new THREE.BoxGeometry(BOOK.w - 0.012, BOOK.h - 0.016, BOOK.d - 2 * BOARD);
  pagesGeometry.translate(-0.006, 0, 0);
  const coverGeometry = new THREE.PlaneGeometry(BOOK.w, BOOK.h);
  coverGeometry.translate(0, 0, BOOK.d / 2 + 0.0005);
  const pagesMaterial = new THREE.MeshStandardMaterial({ color: "#f4ecd6", roughness: 0.85 });
  const owned: { dispose: () => void }[] = [front, back, pagesGeometry, coverGeometry, pagesMaterial];

  return buildDeskObjects<DeskBookInput>(scene, {
    size: BOOK,
    make() {
      const group = new THREE.Group();
      const board = new THREE.MeshStandardMaterial({ color: "#8a5cc8", roughness: 0.62 });
      const canvas = document.createElement("canvas");
      canvas.width = TEX_W;
      canvas.height = TEX_H;
      const g = canvas.getContext("2d");
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      const cover = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6 });
      owned.push(board, texture, cover);
      const body = new THREE.Mesh(front, board);
      group.add(body, new THREE.Mesh(back, board), new THREE.Mesh(pagesGeometry, pagesMaterial));
      group.add(new THREE.Mesh(coverGeometry, cover));
      let shown = "";
      return {
        group,
        body,
        set(input) {
          board.color.set(input.color);
          if (shown === input.key || !g) return;
          shown = input.key;
          drawCover(g, input, null, font);
          texture.needsUpdate = true;
          artImage(input.key, (img) => {
            if (shown !== input.key) return;
            drawCover(g, input, img, font);
            texture.needsUpdate = true;
          });
        },
      };
    },
    from: shelfSpot,
    back: shelfSpot,
    delay: (index) => 0.55 + index * 0.2,
    duration: 0.75,
    arc: 0.6,
    backDuration: 0.6,
    backArc: 0.45,
    tag: "[data-book-tag]",
    summary: "[data-book-summary]",
    dispose() {
      for (const item of owned) item.dispose();
    },
  });
}
