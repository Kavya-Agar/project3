import { useRef } from 'react';
import { formatMoney } from '../../utils/money';

export default function DrinkBrowser({ products, categories, activeCategory, onCategoryChange, onSelect }) {
  const gridRef = useRef(null);
  const visible = products.filter((product) => product.category === activeCategory);

  return (
    <section aria-labelledby="browse-heading">
      <h2 id="browse-heading" className="kiosk__heading">What are you craving?</h2>
      <div className="category-tabs" role="group" aria-label="Drink categories">
        {categories.map((category) => (
          <button key={category} type="button" className="category-tab" aria-pressed={category === activeCategory}
                  onClick={() => { onCategoryChange(category); gridRef.current?.scrollTo?.({ top: 0 }); }}>
            {category}
          </button>
        ))}
      </div>
      <ul className="drink-grid" ref={gridRef} style={{ listStyle: 'none', padding: 0 }}>
        {visible.map((product) => (
          <li key={product.productId}>
            <button type="button" className="drink-card" style={{ width: '100%', height: '100%' }}
                    aria-label={`${product.name}, ${formatMoney(product.price)}`} onClick={() => onSelect(product)}>
              <span className="drink-card__name">{product.name}</span>
              <span className="drink-card__price">{formatMoney(product.price)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
