# Kreatekno Home: Story Stage (web and video)

_Last updated: 2026-10-29. Source: the team's document "Kreatekno · Cerita & Copy Home (one take) · Revisi" (@Kreatekno, 2026-10-25), which follows the locked location masters in "Kreatekno · Prompt Master Lokasi". The stage lives in the Next.js app (`site/components/story/`); the older prototype in `prototype/` still shows the 16-beat version of 14 Oct._

This file is the handoff between the website and the video team: how the Home stage works, where every piece of copy sits in the frame, what the HTML draws and what the footage has to provide. The story, the keyframe descriptions and the copy live in the team's document.

---

## 1. How the stage works

- **One take, 18 beats, 21 keyframes:** K0 to K16, plus K2.1, K2.2, K5a and K9a. K2.1 and K2.2 came with the footage of 29 Oct and are not in the team's document yet. The whole Home page is one sticky stage, and scrolling scrubs through the footage.
- **Each step = a camera move + a hold.**
  - During the move, the footage plays from the previous keyframe to the next one.
  - During the hold, the keyframe stays still while the copy is read.
- **The page opens on K0.** The hero copy is already on the billboard in the first frame and is held there. Beat 1 (crane down to the door, K1) only starts when the visitor scrolls. Nothing plays by itself.
- **Beats without copy** (empty scroll): 2, 5a, 9a, 10, 11, 12 and 15. Only the footage moves.
- **Two versions of the footage, same flow.**
  - 16:9 for landscape screens.
  - 9:16 for portrait screens. Since 26 Oct each beat has its own 9:16 keyframe and clip, recomposed from the locked 16:9 keyframe, not cropped from it.
- **The footage covers the screen,** so its edges get cropped on screens with a different shape (see section 5).
- **Desktop:** copy sits on surfaces in the scene.
- **Phone:** the frame becomes the background, and most copy is an HTML card in the empty band at the bottom of the frame (35 to 45% of the height). Two exceptions:
  - the hero's kicker and headline stay on the billboard (decision of 26 Oct). Its body and buttons are a card in the bottom band, because the billboard in the 9:16 footage is only 72% of the width and 19% of the height (27 Oct);
  - the journey steps stay on the shop panels, one panel per screen.
- **Smooth scrolling:** Lenis smooth wheel plus a scrubbed GSAP ScrollTrigger timeline. Touch keeps the native feel.
- **Video style:** stylised 3D animation in the look of GTA 5.

## 2. Placeholder scene vs the real footage

The sky, ground and vignette on the stage are **placeholders**. They get replaced by the video frames, and every prop stays above the footage in the same place.

**Footage in the stage so far** (29 Oct): beats 1 and 2, K0 → K2.2, both versions. Source files are in `Assets/footage/desktop/` and `Assets/footage/mobile/`, one per camera move, named after its keyframes (`k1 - k2.mp4`).

- Each clip plays as a WebP image sequence on a `<canvas>` under the props, scrubbed by the same timeline. The clips and their data are in `site/components/story/footage.ts`; the frames are in `site/public/footage/`.
- The still frames at the start and end of a clip are left out, because the web holds the keyframe itself. Beat 1 uses frames 22–104 (16:9) and 19–94 (9:16); beat 2 uses frames 14–94 (16:9) and 17–106 (9:16), then 3–72 and 19–58 for K2 → K2.1, and 18–59 and 16–57 for K2.1 → K2.2.
- 16:9 frames go on the web at 1280×720, so consecutive clips match in sharpness. Beat 2 arrived in 1920×1080 and was scaled down.
- Frame 0 shows from the moment the camera reaches the clip's first keyframe; the last frame shows until the end of its hold. One clip hands over to the next directly. Where the next move has no clip yet, the footage fades into the placeholder over a quarter of a screen.
- Copy printed on a surface that moves in the clip follows that surface, measured frame by frame (the `tracks` in `footage.ts`). The billboard is the first one.

Until the footage exists, the placeholder fixes two things.

**Surface line per keyframe.** This is where the floor, counter, roof or road starts. Values are % of the frame height, measured from the top. They are estimates: either the keyframes follow them, or the props get moved to match the real frames (each position is a number in `HomeStory.tsx`, see section 3).

| Keyframe | Surface | Line | Light |
|---|---|---|---|
| K0 | Roof parapet of COMPANY under the billboard | 96% (measured) | Morning, low warm sun from the left (measured) |
| K3 | Till counter, over Bu Dewi's shoulder | 58% | Warm morning inside |
| K4 | Till counter, binder held up | 62% | Warm morning inside |
| K5a, K5 | Pavement in front of the shophouses | 76% | Late morning, same sun as K1 |
| K6 | Lobby floor | 88% | Bright inside, from the glass front |
| K7 | Waiting corner floor | 90% | Same as K6 |
| K8 | Meeting-room floor behind the glass | 92% | Lobby same as K7; golden only through the meeting-room window |
| K9 | Pavement outside the office | 84% | Golden hour |
| K13 | Till counter | 62% | Dusk, lamps on |
| K14 | Till counter, standing in front of it | 60% | Dusk, lamps on |
| K16 | Dark road | 66% | Night |

**Light per keyframe.** Every prop has a soft light layer in the colour and direction of its keyframe's light. The values are in `KEYFRAMES` in `beats.ts`. Once the footage exists, they need to be retuned to match it.

## 3. Beat by beat

Positions are the left edge (x), the top (y) or bottom (b) and the width (w) of each prop, in % of the frame. They are the `desk` and `phone` numbers on each `<Prop>` in `HomeStory.tsx` and `Binder.tsx`. Phone props anchored at the bottom are cards: the props of one beat stack upwards from b, in reading order.

Scroll is measured in screens: move + hold.

| Beat | Section | Camera | Scroll | Copy on (desktop) | Desktop 16:9 | Phone 9:16 |
|---|---|---|---|---|---|---|
| 1 | Hero | Hold on K0, then Crane Down → Eye Level | 0.9 hold + 1.0 | Billboard on the roof of COMPANY | face of the billboard in the footage: x 12, y 29.6, w 43.2, h 36.2 (body and buttons on its lower half) | headline on the face x 13.2, y 43.9, w 72.4, h 18.8; body and buttons card x 4, b 3, w 92 |
| 2 | Transisi masalah | Follow Heru through the door (K2), Dolly In + Pan Left to Sinta and Bayu (K2.1), Whip Pan Right past the counter to Nadia and Fajar (K2.2) | 1.2 + 0.8 + 0.7 | none | | |
| 3 | Layanan | Arc ±120° → Over-the-Shoulder | 0.8 + 1.2 | Flat landscape leaflet standing in an acrylic stand | x 35, y 15, w 54 | card x 4, b 3, w 92; the four services swipe sideways |
| 4 | Use case | Dolly In | 0.5 + 1.5 | Ring binder held up by Heru; its tabs are the industry tabs | x 40, y 12, w 46 | card x 4, b 3, w 92; the four examples swipe sideways |
| 5a | Customer journey, keluar | Follow out of the door → Truck Right | 0.9 | none (the first shop panel arrives at the end) | | |
| 5b | Customer journey | Truck Right along the pavement | 3.0 + 0.8 | White second-floor panels of the shophouses | panels at y 14, each 26% wide, one shop every 38% | panels at y 14, each 84% of the visible width, one per screen |
| 6 | Testimoni | Through Object In (office glass door) | 0.8 + 1.2 | Paper strip; polaroids on the corkboard | strip x 31, y 11, w 38; board x 15, y 27, w 70 | strip card above the polaroids; polaroids full width, b 3, swiped |
| 7 | Artikel | Truck Left | 0.6 + 1.1 | Small wooden sign; 3 magazines on the rack; "Lihat semua artikel" | sign x 37, y 12, w 26; rack x 22, y 25, w 56; button x 38, y 74, w 24 | sign, 3 stacked article cards and the button, from b 3 |
| 8 | FAQ | Truck Left + Pan Left | 0.6 + 1.7 | Title on the glass; 8 sticky notes; help line + CTA | title x 9, y 27, w 25; notes x 37, y 19, w 54 | title x 6, y 9, w 88; notes as an accordion card x 5, b 3, w 90 |
| 9a | Tentang kami, menuju pintu | Arc 180° → forward to the door | 0.9 | none | | |
| 9b | Tentang kami | Through Object Out → Arc | 0.9 + 1.2 | Wooden plaque left of the office door | x 10, y 21, w 36 | card x 4, b 3, w 92 |
| 10 | Langit, naik | Crane Up + Hyperlapse, moving left | 1.0 | none | | |
| 11 | Langit, turun | Crane Down moving left → forward to the door | 0.9 | none | | |
| 12 | Pelatihan | Through Object In (glass door, then the wooden door) | 1.1 | none | | |
| 13 | Praktik naik kelas | Dolly Out of the classroom → along the desks + time-lapse | 1.1 + 0.7 | Small chalkboard at the left end of the till counter | x 28, y 33, w 21 | small card x 11, b 4, w 78 |
| 14 | CTA | Dolly In → POV | 0.7 + 1.3 | Open purple folder in a document stand on the counter | x 29, b 6, w 42 | card x 4, b 3, w 92 |
| 15 | Footer, keluar | Dolly Out → Through Object Out (window) + Hyperlapse | 0.9 | none | | |
| 16 | Footer | Crane Up while backing away | 0.9 + 0.5 | Footer on the dark road | x 7, b 3, w 86 | x 5, b 2, w 90 |

The whole stage is about 30 screens of scroll.

**Beat 5b, panel by panel.** From left to right along the street:

| Shop | Panel |
|---|---|
| Buah (fruit) | Kicker "Cara kerja" + H2 |
| Laundry | Step 1 |
| Sepatu (shoes) | Step 2 |
| Warteg | Step 3 |
| Kosmetik | Step 4 |
| Warnet, Warung | Blank |
| Elektronik, next to Kreatekno | CTA "Konsultasi gratis" with an arrow to the office door |

### How props move with the camera

Each prop reaches its place exactly when the footage reaches its keyframe. It starts to leave as soon as the next camera move starts.

| Camera move | Prop coming in | Prop going out |
|---|---|---|
| Crane Down | Rises into place, seen from above first | Rises out of the frame. The billboard copy in beat 1 follows the billboard in the footage instead |
| Crane Up | Rises from the ground | Sinks out of the frame |
| Through Object In / Follow in | Grows from far away, seen through the opening | Grows, blurs and passes the camera on its side |
| Through Object Out | Comes from behind the camera, large and blurred | Shrinks towards the opening |
| Dolly In | Grows into place | Grows and is pushed off the edge |
| Dolly Out | Comes from behind the camera and settles smaller | Shrinks |
| Truck Right / Left | Slides in from the side; farther props move slower | Slides out on the other side |
| Arc | Turns round to face the camera | Turns away |

### Small actions inside a shot

- **Beat 4:** the binder page swings open from the rings.
- **Beat 5b:** the row of shop panels slides past with the truck right and slows down at every panel with copy.
  - Desktop: the fruit shop's panel starts on the right, as in K5a. Steps 1 to 4 each stop in the middle. The electronics shop's panel ends on the left, as in K5.
  - Phone: each panel with copy stops in the middle of the screen.
- **Beat 3** has no in-shot action any more: the leaflet is flat, not folded.

## 4. What the HTML draws and what the footage draws

To confirm with Heru, so nothing appears twice.

**Always HTML** (anything with text or anything you can click):

- the billboard face (beat 1)
- the leaflet face
- the binder page and its tabs
- the faces of the shop panels with copy
- the paper strip and the polaroids
- the magazine covers and the "Lihat semua artikel" button
- the title on the glass, the sticky notes and the help line
- the plaque face
- the small chalkboard face (beat 13)
- the paper in the folder (beat 14)
- the footer

**Can come from the footage** (supporting parts with no copy):

- the billboard's steel frame, crossed truss and lamps. The beat 1 footage has the frame and the truss, without lamps; the HTML draws them only until the first frame has loaded
- the acrylic stand
- the blank shop panels (warnet, warung) and all the facades
- the corkboard
- the wooden shelf
- the folder's document stand
- the chalkboard legs
- the shadows

When the footage has these parts, the HTML versions get switched off.

**What the keyframes need to show:**

- The surfaces where the HTML sits are blank, in the positions of section 3.
- The phone keyframes keep the bottom band free (no faces) where the cards sit.
- Sticky notes and polaroids open and swipe, so they stay HTML. K8 shows the glass without notes, and K6 shows the corkboard without cards.

## 5. Readability rules

- **Safe zone for faces, hands and surfaces:**
  - desktop: 9 to 91% of the width, 8 to 92% of the height
  - phone: 10 to 90% of the width, 5 to 95% of the height
- **Screens that crop more.** These are short laptops and tablets held upright.
  - The props of a beat move together until the copy is inside the visible area.
  - A prop wider than the screen gets narrowed.
  - The "Area video" view marks shifted props in red.
- **Phone cards are as tall as their copy needs.** Measured on a 375×812 phone, as a share of the screen height:
  - fit the 35 to 45% band: Layanan 37%, CTA 42%, Testimoni 45%, Praktik 15%
  - run taller and grow upwards: Use case 51%, Artikel 55%, FAQ 65%, Tentang kami 65%
- **Copy is never semi-transparent.** The light layer uses soft-light, so text keeps its contrast.
- **Reduced motion** (or GSAP not loading): nothing is pinned, and the same elements stack as ordinary sections.

## 6. The "Area video" tool

Open Home with `?zones=1` in the URL. A switch appears at the bottom right. It shows:

- the safe zone
- each prop's box with its % coordinates
- the current beat, its camera move and keyframes (K2.1, K2.2, K5a and K9a included)
- move or hold progress
- what the keyframe should show
- the frame size and how much of it is cropped

## 7. Open points for the video team

1. Confirm the split in section 4.
2. **Beat 5b rhythm.** The web slows down at each panel with copy. Choose one of two:
   - the footage is time-remapped so the truck slows at the same panels;
   - or the web moves at a steady speed like the footage.
   The panel spacing (one shop every 38% of the frame width on desktop) is an estimate until K5a and K5 exist.
3. **Beat 13 chalkboard.** The K13 description puts it at the left end of the till counter; the summary table says bottom right. The web follows K13.
4. **Phone bands.** Use case, Artikel, FAQ and Tentang kami need more than 45% of the height on common phones. Choose one of two:
   - their 9:16 keyframes keep faces in the top third;
   - or the copy shown on phones gets shorter.
5. **Surface lines and light:** decide whether the keyframes follow section 2, or the props get moved to the real frames. Retune the light values once the first footage exists.
6. **Testimonial cards** stay "CONTOH" placeholders until real client quotes with permission come in.
7. **Beat 1 footage** (received 27 Oct, now in the stage):
   - The 9:16 billboard is too small for the whole hero (72 × 19% of the frame). The web puts the headline on it and the rest in a card. If the hero should stay whole on the billboard, the 9:16 billboard needs a face of about 85% of the width and 45% of the height.
   - In the 16:9 first frame the birds fly under the header bar at the top right. Keep them below 12% of the height from the top.
   - Both clips are 1280 px on the long side. Check on a large screen whether that is sharp enough, or send 1920.
   - The light is a low warm sun from the left, not from the right as section 2 first assumed. Later keyframes that follow on from K1 should keep it.
8. **Beat 2 footage** (received 28 Oct, now in the stage):
   - It joins beat 1 without a jump and ends on K2 as described.
   - The 16:9 clip came in 1920×1080, beat 1 in 1280×720. Please send every clip in one size, preferably 1920×1080 (the web scales them down), so beat 1 can be re-exported if large screens need more sharpness.
   - 9:16 K2: on phones taller than 9:16 (most of them, e.g. 375×812) about 9% of the width is cropped on each side, which cuts off the staff at the far left and right desks. Keep faces between 10% and 90% of the width (section 5).
9. **K2.1 and K2.2** (footage received 29 Oct, now in the stage):
   - They are new: the team's document goes from K2 straight to beat 3. The web treats them as two more steps of beat 2, without copy. Please add them to the document, so beat 3 is planned from K2.2 (`k2.2 - k3.mp4`) and not from K2.
   - In the whip pan to K2.2 the till counter is empty: Bu Dewi is missing, although she stands behind it in K2 and again in K3. Please put her back.
   - Each clip ends on a still of about one second, and the next starts from a still. The web cuts those out. Per the document's rule, junctions without copy should keep moving.
