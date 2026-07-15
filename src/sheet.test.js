import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { createSheet } from './sheet.js';
import { createStore } from './store.js';

function setupDom(html) {
  const dom = new JSDOM(html, { url: 'http://localhost/' });
  global.document = dom.window.document;
  global.window = dom.window;
  global.localStorage = dom.window.localStorage;
  return dom;
}

describe('createSheet', () => {
  let store;
  let sheet;
  let foodValue;
  let tagList;

  beforeEach(() => {
    setupDom(`
      <div contenteditable data-key="name"></div>
      <div contenteditable data-key="items" data-rich="true"></div>
      <div contenteditable data-key="journal" data-rich="true"></div>
      <div contenteditable data-key="coin"></div>
      <div id="foodValue" contenteditable data-key="food">0</div>
      <div id="tagList"></div>
    `);
    localStorage.clear();
    store = createStore('cartograph_', 'solo');
    foodValue = document.getElementById('foodValue');
    tagList = document.getElementById('tagList');
    sheet = createSheet(store, {
      getFoodValue: () => parseInt(foodValue.textContent) || 0,
      setFoodValue: (n) => { foodValue.textContent = Math.max(0, n); },
      getTags: () => Array.from(tagList.querySelectorAll('.tag')).map(t => t.dataset.tag),
      setTags: (tags) => { tagList.innerHTML = ''; tags.forEach(t => { const el = document.createElement('span'); el.className = 'tag'; el.dataset.tag = t; tagList.appendChild(el); }); },
    });
  });

  describe('getFieldValue / setFieldValue', () => {
    it('returns textContent for plain fields', () => {
      const el = document.querySelector('[data-key="name"]');
      el.textContent = 'Eman';
      expect(sheet.getFieldValue(el)).toBe('Eman');
    });

    it('returns innerHTML for rich fields', () => {
      const el = document.querySelector('[data-key="items"]');
      el.innerHTML = 'Sword<br>Shield';
      expect(sheet.getFieldValue(el)).toBe('Sword<br>Shield');
    });

    it('sets textContent for plain fields', () => {
      const el = document.querySelector('[data-key="name"]');
      sheet.setFieldValue(el, 'Autumn');
      expect(el.textContent).toBe('Autumn');
      expect(el.innerHTML).not.toContain('<b>');
    });

    it('sets innerHTML for rich fields', () => {
      const el = document.querySelector('[data-key="journal"]');
      sheet.setFieldValue(el, 'Day <b>one</b>');
      expect(el.innerHTML).toBe('Day <b>one</b>');
    });
  });

  describe('saveAll / loadAll', () => {
    it('saves all contenteditable fields to store', () => {
      document.querySelector('[data-key="name"]').textContent = 'Eman';
      document.querySelector('[data-key="items"]').innerHTML = 'Rope<br>Torch';
      sheet.saveAll();
      expect(store.loadField('name')).toBe('Eman');
      expect(store.loadField('items')).toBe('Rope<br>Torch');
    });

    it('loads all fields from store into DOM', () => {
      store.saveField('name', 'Autumn');
      store.saveField('items', 'Map<br>Compass');
      sheet.loadAll();
      expect(document.querySelector('[data-key="name"]').textContent).toBe('Autumn');
      expect(document.querySelector('[data-key="items"]').innerHTML).toBe('Map<br>Compass');
    });

    it('loadAll clears fields when character has no saved data', () => {
      document.querySelector('[data-key="name"]').textContent = 'Old Name';
      document.querySelector('[data-key="items"]').innerHTML = 'Old Item';
      sheet.loadAll();
      expect(document.querySelector('[data-key="name"]').textContent).toBe('');
      expect(document.querySelector('[data-key="items"]').innerHTML).toBe('');
    });
  });

  describe('getSheetData / setSheetData', () => {
    it('collects all field values into an object', () => {
      document.querySelector('[data-key="name"]').textContent = 'Eman';
      document.querySelector('[data-key="items"]').innerHTML = 'Sword';
      const data = sheet.getSheetData();
      expect(data.name).toBe('Eman');
      expect(data.items).toBe('Sword');
    });

    it('restores field values from an object', () => {
      sheet.setSheetData({ name: 'Autumn', items: 'Shield' });
      expect(document.querySelector('[data-key="name"]').textContent).toBe('Autumn');
      expect(document.querySelector('[data-key="items"]').innerHTML).toBe('Shield');
    });

    it('ignores unknown keys in setSheetData', () => {
      expect(() => sheet.setSheetData({ nonexistent: 'x' })).not.toThrow();
    });
  });
});
