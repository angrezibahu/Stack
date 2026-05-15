// All progress state lives in localStorage under a single key.
// Keys for completed lessons are the lesson `id` from the content collection
// (which is the path relative to the collection base, without extension),
// e.g. "01-what-is-an-llm/01-the-shape-of-the-thing".

const STORAGE_KEY = 'stack:progress:v1';

type ProgressShape = {
  completed: string[];
};

function read(): ProgressShape {
  if (typeof localStorage === 'undefined') return { completed: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.completed)) return { completed: [] };
    return { completed: parsed.completed.filter((x: unknown) => typeof x === 'string') };
  } catch {
    return { completed: [] };
  }
}

function write(state: ProgressShape) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  document.dispatchEvent(new CustomEvent('stack:progress-changed'));
}

export function getCompleted(): Set<string> {
  return new Set(read().completed);
}

export function isComplete(id: string): boolean {
  return getCompleted().has(id);
}

export function setComplete(id: string, complete: boolean) {
  const state = read();
  const set = new Set(state.completed);
  if (complete) set.add(id);
  else set.delete(id);
  write({ completed: [...set] });
}

export function resetProgress() {
  write({ completed: [] });
}

export function onChange(handler: () => void) {
  document.addEventListener('stack:progress-changed', handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) handler();
  });
}
