// Read literal data only. Never evaluate scripts from the prototype.
import { readFileSync } from "node:fs";
import ts from "../../site/node_modules/typescript/lib/typescript.js";

export function readPrototype() {
  const html = readFileSync(
    new URL("../../prototype/solusi-etalase-v1.html", import.meta.url),
    "utf8",
  );
  const code = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
  const ast = ts.createSourceFile(
    "prototype.js",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  function literal(node) {
    if (ts.isStringLiteral(node) || ts.isNumericLiteral(node))
      return ts.isNumericLiteral(node) ? Number(node.text) : node.text;
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
    if (ts.isObjectLiteralExpression(node))
      return Object.fromEntries(
        node.properties.map((p) => {
          if (!ts.isPropertyAssignment(p))
            throw new Error("Non-literal property");
          return [p.name.text, literal(p.initializer)];
        }),
      );
    throw new Error(`Non-literal data: ${node.getText(ast)}`);
  }
  const wanted = new Set([
    "INDUSTRI",
    "TIM",
    "APPS",
    "SOLUSI",
    "RINGKAS",
    "KARTU",
    "STATUS",
    "TEAMCOL",
  ]);
  const data = {};
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const d of statement.declarationList.declarations) {
      if (wanted.has(d.name.text)) data[d.name.text] = literal(d.initializer);
    }
  }
  for (const key of wanted) if (!data[key]) throw new Error(`Missing ${key}`);
  return data;
}
