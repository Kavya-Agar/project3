import { MENU } from '../config.js';

// Validates a menu item payload and returns the cleaned values or a list of errors.
export function validateMenuItem({ name, price, category, isAvailable = true } = {}) {
  const errors = [];
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanPrice = Number(price);

  if (!cleanName) errors.push('Name is required');
  else if (cleanName.length > MENU.NAME_MAX_LENGTH) {
    errors.push(`Name must be at most ${MENU.NAME_MAX_LENGTH} characters`);
  }
  if (!Number.isFinite(cleanPrice) || cleanPrice <= 0 || cleanPrice > MENU.PRICE_MAX) {
    errors.push(`Price must be between 0 and ${MENU.PRICE_MAX}`);
  }
  if (!MENU.CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${MENU.CATEGORIES.join(', ')}`);
  }

  return {
    errors,
    value: {
      name: cleanName,
      price: Math.round(cleanPrice * 100) / 100,
      category,
      isAvailable: Boolean(isAvailable),
    },
  };
}
