
const cache: Map<string, string> = new Map();

function cleanseAssertionOperators(parsedName: string): string {
  return parsedName.replace(/[?!]/g, "");
}

function process(fnStr: string): string {
  // ES6 class name:
  // "class ClassName { ..."
  if (
    fnStr.startsWith("class ")
    // Theoretically could, for some ill-advised reason, be "class => class.prop".
    && !fnStr.startsWith("class =>")
  ) {
    return cleanseAssertionOperators(
      fnStr.substring(
        "class ".length,
        fnStr.indexOf(" {")
      )
    );
  }

  // ES6 prop selector:
  // "x => x.prop"
  if (fnStr.includes("=>")) {
    return cleanseAssertionOperators(
      fnStr.substring(
        fnStr.indexOf(".") + 1
      )
    );
  }

  // ES5 prop selector:
  // "function (x) { return x.prop; }"
  // webpack production build excludes the spaces and optional trailing semicolon:
  //   "function(x){return x.prop}"
  // FYI - during local dev testing i observed carriage returns after the curly brackets as well
  // Note by maintainer: See https://github.com/IRCraziestTaxi/ts-simple-nameof/pull/13#issuecomment-567171802 for explanation of this regex.
  const matchRegex = /function\s*\(\w+\)\s*\{[\r\n\s]*return\s+\w+\.((\w+\.)*(\w+))/i;

  const es5Match = fnStr.match(matchRegex);

  if (es5Match) {
    return es5Match[1];
  }

  // ES5 class name:
  // "function ClassName() { ..."
  if (fnStr.startsWith("function ")) {
    return cleanseAssertionOperators(
      fnStr.substring(
        "function ".length,
        fnStr.indexOf("(")
      )
    );
  }

  // Invalid function.
  throw new Error("ts-simple-nameof: Invalid function.");
}

/**
 * Based on https://github.com/IRCraziestTaxi/ts-simple-nameof/blob/master/src/nameof.ts
 *
 * Added caching and support for string parameter
 */
export function nameof<T extends Object>(nameFunction: ((obj: T) => any) | { new(...params: any[]): T } | string): string {
  const fnStr: string = nameFunction.toString();
  if (cache.has(fnStr)) {
    return cache.get(fnStr);
  }
  const result: string = (typeof nameFunction === "string") ? fnStr : process(fnStr);
  cache.set(fnStr, result);
  return result;
}
