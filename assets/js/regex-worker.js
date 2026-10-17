// Runs user regexes off the main thread so catastrophic backtracking can be killed.
import { compile, findMatches } from './lib/regex.js';

self.onmessage = ({ data: { id, pattern, flags, input, replacement } }) => {
  const { re, error } = compile(pattern, flags);
  if (error) return self.postMessage({ id, error });
  const start = performance.now();
  const matches = findMatches(re, input);
  const ms = performance.now() - start;
  let replaced;
  try {
    replaced = input.replace(re, replacement);
  } catch (e) {
    replaced = e.message;
  }
  self.postMessage({ id, matches, replaced, ms });
};
