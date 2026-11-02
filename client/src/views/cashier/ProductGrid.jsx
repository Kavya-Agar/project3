import { formatMoney } from '../../utils/money';

export default function ProductGrid({ products, categories, activeCategory, onCategoryChange, onSelect }) {
  const visible = products.filter((product) => product.category === activeCategory);
  return (
    <>
      <div className="cashier__tabs" role="group" aria-label="Menu categories">
        {categories.map((category) => (
          <button key={category} type="button" className="cashier__tab"
                  aria-pressed={category === activeCategory} onClick={() => onCategoryChange(category)}>
            {category}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {visible.map((product) => (
          <button key={product.productId} type="button" className="product-tile" onClick={() => onSelect(product)}>
            <span>{product.name}</span>
            <span className="product-tile__price">{formatMoney(product.price)}</span>
          </button>
        ))}
      </div>
    </>
  );
}
