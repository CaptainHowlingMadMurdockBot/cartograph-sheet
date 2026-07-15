/**
 * @param {string} prefix - localStorage key prefix (e.g. 'cartograph_')
 * @param {string} initialChar - default character slug
 */
export function createStore(prefix, initialChar) {
  let currentChar = initialChar;

  function storageKey(suffix) {
    return prefix + currentChar + '_' + suffix;
  }

  function loadField(key) {
    try { return localStorage.getItem(storageKey(key)); } catch { return null; }
  }

  function saveField(key, val) {
    try { localStorage.setItem(storageKey(key), val); } catch {}
  }

  function removeField(key) {
    try { localStorage.removeItem(storageKey(key)); } catch {}
  }

  function discoverCharacters() {
    const chars = new Set();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        const char = key.slice(prefix.length).split('_')[0];
        chars.add(char);
      }
    }
    return Array.from(chars).sort();
  }

  function setCharacter(char) {
    currentChar = char;
  }

  function getCharacter() {
    return currentChar;
  }

  return {
    storageKey,
    saveField,
    loadField,
    removeField,
    discoverCharacters,
    setCharacter,
    getCharacter,
  };
}
