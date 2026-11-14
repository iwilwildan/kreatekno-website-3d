// Every cast member by name, for the world and the dev lab (/?lab=NAME).
import { BAYU } from "./bayu";
import { DEWI } from "./dewi";
import { FAJAR } from "./fajar";
import { HERU_SPEC } from "./heru";
import { NADIA } from "./nadia";
import { SINTA } from "./sinta";

export const CAST = { heru: HERU_SPEC, dewi: DEWI, sinta: SINTA, bayu: BAYU, nadia: NADIA, fajar: FAJAR };
export type CastName = keyof typeof CAST;

export { buildMember, buildMemberSliced } from "./member";
export { applyPose, CLASS_POSES, K2_POSES } from "./poses";
export { act, createPhone, createSweat, createThought, lookYaw } from "./acts";
export { buildCloseHands, type CloseHands } from "./closeHand";
