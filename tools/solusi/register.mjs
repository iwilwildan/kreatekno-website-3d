// Node 24 strips TS; mirror bundler-style extensionless relative imports for local tests.
import { registerHooks } from "node:module";
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (
        error.code === "ERR_MODULE_NOT_FOUND" &&
        /^\.\.?\//.test(specifier) &&
        !/\.[cm]?[jt]s$/.test(specifier)
      ) {
        return next(specifier + ".ts", context);
      }
      throw error;
    }
  },
  load(url, context, next) {
    if (url.endsWith(".ts") && !url.includes("/node_modules/"))
      return next(url, { ...context, format: "module-typescript" });
    return next(url, context);
  },
});
