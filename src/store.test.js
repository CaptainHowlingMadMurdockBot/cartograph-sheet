import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from './store.js';

describe('createStore', () => {
  let store;

  beforeEach(() => {
    localStorage.clear();
    store = createStore('cartograph_', 'solo');
  });

  describe('storageKey', () => {
    it('returns prefixed key with current character', () => {
      expect(store.storageKey('name')).toBe('cartograph_solo_name');
    });

    it('uses the character passed at creation', () => {
      const s = createStore('cartograph_', 'autumn');
      expect(s.storageKey('name')).toBe('cartograph_autumn_name');
    });
  });

  describe('saveField / loadField', () => {
    it('saves and loads a string value', () => {
      store.saveField('name', 'Eman');
      expect(store.loadField('name')).toBe('Eman');
    });

    it('returns null for missing keys', () => {
      expect(store.loadField('nonexistent')).toBeNull();
    });

    it('overwrites existing values', () => {
      store.saveField('name', 'Eman');
      store.saveField('name', 'Autumn');
      expect(store.loadField('name')).toBe('Autumn');
    });
  });

  describe('removeField', () => {
    it('removes a saved field', () => {
      store.saveField('name', 'Eman');
      store.removeField('name');
      expect(store.loadField('name')).toBeNull();
    });

    it('does nothing for missing keys', () => {
      expect(() => store.removeField('nonexistent')).not.toThrow();
    });
  });

  describe('discoverCharacters', () => {
    it('returns empty array when no data saved', () => {
      expect(store.discoverCharacters()).toEqual([]);
    });

    it('finds characters from saved keys', () => {
      store.saveField('name', 'Eman');
      const s2 = createStore('cartograph_', 'autumn');
      s2.saveField('name', 'Autumn');
      expect(store.discoverCharacters()).toEqual(['autumn', 'solo']);
    });

    it('returns sorted results', () => {
      const s2 = createStore('cartograph_', 'zebra');
      s2.saveField('name', 'Z');
      const s3 = createStore('cartograph_', 'alpha');
      s3.saveField('name', 'A');
      expect(store.discoverCharacters()).toEqual(['alpha', 'zebra']);
    });
  });

  describe('setCharacter / getCharacter', () => {
    it('switches the active character', () => {
      store.saveField('name', 'Eman');
      store.setCharacter('autumn');
      expect(store.loadField('name')).toBeNull();
      expect(store.getCharacter()).toBe('autumn');
    });

    it('keys are scoped per character', () => {
      store.saveField('name', 'Eman');
      store.setCharacter('autumn');
      store.saveField('name', 'Autumn');
      store.setCharacter('solo');
      expect(store.loadField('name')).toBe('Eman');
    });
  });
});
