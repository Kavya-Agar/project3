import { formatMoney } from '../../utils/money';

export default function CartPanel({ cart, submitting, error, onCheckout }) {
  return (
    <section className="cart" aria-label="Your order">
      <ul className="cart__lines" aria-live="polite">
        {cart.lines.map((line) => (
          <li key={line.lineId} className="cart__line">
            <span>
              {line.quantity} × {line.name}
              {line.toppings.length > 0 && ` (${line.toppings.join(', ')})`}
            </span>
            <span>
              {formatMoney(line.unitPrice * line.quantity)}{' '}
              <button type="button" className="cart__remove" aria-label={`Remove ${line.name}`}
                      onClick={() => cart.removeLine(line.lineId)}>✕</button>
            </span>
          </li>
        ))}
      </ul>
      {error && <p className="status status--error" role="alert">{error}</p>}
      <div className="cart__footer">
        <span className="cart__total">
          {cart.itemCount} {cart.itemCount === 1 ? 'drink' : 'drinks'} · {formatMoney(cart.total)}
        </span>
        <button type="button" className="big-btn big-btn--primary" disabled={!cart.lines.length || submitting}
                onClick={onCheckout}>
          {submitting ? 'Sending…' : 'Place order'}
        </button>
      </div>
    </section>
  );
}
