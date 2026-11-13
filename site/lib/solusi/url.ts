import type { Industri, Kartu } from "../../content/solusi/schema";
import { INDUSTRI } from "../../content/solusi/taksonomi";
import type { Answers } from "./kartu";

/** Untrusted URLs cannot amplify scores with duplicates or contradictory answers. */
export function parseAnswers(search: string, bank: readonly Kartu[]): Answers {
  const params = new URLSearchParams(search);
  const byId = new Map(bank.map((c) => [c.id, c]));
  const read = (key: string) =>
    new Set(
      params
        .getAll(key)
        .flatMap((v) => v.split(","))
        .filter((id) => byId.has(id)),
    );
  const yes = read("y"),
    no = read("n");
  const conflict = new Set([...yes].filter((id) => no.has(id)));
  const ids = [...yes, ...no].filter((id) => !conflict.has(id));
  // The flow permits at most nine answered cards. Invalid long payloads produce no recommendations.
  if (ids.length > 9) return { industri: "", yes: [], no: [] };
  const fields = params.getAll("b");
  const field = fields.length === 1 && INDUSTRI.some((i) => i.id === fields[0]) ? (fields[0] as Industri) : "";
  return {
    industri: field,
    yes: [...yes].filter((id) => !conflict.has(id)).map((id) => byId.get(id)!),
    no: [...no].filter((id) => !conflict.has(id)).map((id) => byId.get(id)!),
  };
}

export function answersQuery(state: Answers) {
  const params = new URLSearchParams();
  if (state.industri) params.set("b", state.industri);
  if (state.yes.length) params.set("y", state.yes.map((c) => c.id).join(","));
  if (state.no.length) params.set("n", state.no.map((c) => c.id).join(","));
  return params.toString();
}
