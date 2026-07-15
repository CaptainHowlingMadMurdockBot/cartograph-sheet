/**
 * @param {import('./store.js').Store} store
 * @param {object} opts
 * @param {() => number} opts.getFoodValue
 * @param {(n: number) => void} opts.setFoodValue
 * @param {() => string[]} opts.getTags
 * @param {(tags: string[]) => void} opts.setTags
 */
export function createSheet(store, opts) {
  function getFieldValue(el) {
    return el.dataset.rich !== undefined ? el.innerHTML : el.textContent;
  }

  function setFieldValue(el, val) {
    if (el.dataset.rich !== undefined) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  }

  function saveAll() {
    document.querySelectorAll('[contenteditable][data-key]').forEach(el => {
      store.saveField(el.dataset.key, getFieldValue(el));
    });
    if (opts) {
      store.saveField('food', String(opts.getFoodValue()));
      store.saveField('tags', JSON.stringify(opts.getTags()));
    }
  }

  function loadAll() {
    document.querySelectorAll('[contenteditable][data-key]').forEach(el => {
      const val = store.loadField(el.dataset.key);
      setFieldValue(el, val !== null ? val : '');
    });
    if (opts) {
      const food = store.loadField('food');
      opts.setFoodValue(food !== null ? parseInt(food) || 0 : 0);
      const tags = store.loadField('tags');
      if (tags !== null) {
        try { opts.setTags(JSON.parse(tags)); } catch { opts.setTags([]); }
      } else {
        opts.setTags([]);
      }
    }
  }

  function getSheetData() {
    const data = {};
    document.querySelectorAll('[contenteditable][data-key]').forEach(el => {
      data[el.dataset.key] = getFieldValue(el);
    });
    if (opts) {
      data.food = opts.getFoodValue();
      data.tags = opts.getTags();
    }
    return data;
  }

  function setSheetData(data) {
    document.querySelectorAll('[contenteditable][data-key]').forEach(el => {
      if (data[el.dataset.key] !== undefined) setFieldValue(el, data[el.dataset.key]);
    });
    if (opts) {
      if (data.food !== undefined) opts.setFoodValue(parseInt(data.food) || 0);
      if (data.tags) opts.setTags(data.tags);
    }
  }

  return { getFieldValue, setFieldValue, saveAll, loadAll, getSheetData, setSheetData };
}
