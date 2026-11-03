import { useState } from 'react';

const EMPTY_ITEM = { name: '', price: '', category: '', isAvailable: true };

// Add / edit form for a menu item. `item` is null when adding.
export default function MenuItemForm({ item, categories, onSave, onCancel }) {
  const [draft, setDraft] = useState(item ?? { ...EMPTY_ITEM, category: categories[0] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const setField = (field) => (event) => {
    const { type, checked, value } = event.target;
    setDraft((current) => ({ ...current, [field]: type === 'checkbox' ? checked : value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(draft);
    } catch (err) {
      setError(err);
      setSaving(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>{item ? `Edit ${item.name}` : 'Add menu item'}</h2>
      <div className="item-form">
        <label>Name
          <input required maxLength={100} value={draft.name} onChange={setField('name')} />
        </label>
        <label>Price ($)
          <input required type="number" min="0.01" step="0.01" value={draft.price} onChange={setField('price')} />
        </label>
        <label>Category
          <select value={draft.category} onChange={setField('category')}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span>Available to customers</span>
          <input type="checkbox" checked={draft.isAvailable} onChange={setField('isAvailable')} />
        </label>
        <div className="item-form__actions">
          <button className="btn btn--primary" type="submit" disabled={saving}>Save</button>
          <button className="btn" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
      {error && (
        <p className="status status--error" role="alert">
          {error.message}{error.details ? `: ${error.details.join('; ')}` : ''}
        </p>
      )}
    </form>
  );
}
