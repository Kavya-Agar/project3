import { formatMoney } from '../../utils/money';

const sugarLabel = (value, levels) => levels.find((level) => level.value === value)?.label ?? value;

export default function OrderTicket({ cart, sugarLevels, submitting, notice, error, onSubmit }) {
  return (
    <aside className="ticket" aria-label="Current order">
      <h2>Current order</h2>
      {notice && <p className="ticket__notice" role="status">{notice}</p>}
      {error && <p className="status status--error" role="alert">{error}</p>}
      <ul className="ticket__lines">
        {cart.lines.map((line) => (
          <li key={line.lineId} className="ticket__line">
            <span>{line.quantity} × {line.name}</span>
            <span className="ticket__detail">
              {[...line.toppings, `Ice: ${line.iceLevel}`, `Sugar: ${sugarLabel(line.sugarLevel, sugarLevels)}`].join(' · ')}
              {' · '}{formatMoney(line.unitPrice * line.quantity)}
            </span>
            <button type="button" className="ticket__remove" aria-label={`Remove ${line.name}`}
                    onClick={() => cart.removeLine(line.lineId)}>✕</button>
          </li>
        ))}
      </ul>
      <div className="ticket__total"><span>Total</span><span>{formatMoney(cart.total)}</span></div>
      <button type="button" className="ticket__submit" disabled={!cart.lines.length || submitting} onClick={onSubmit}>
        {submitting ? 'Sending…' : 'Submit order'}
      </button>
      <button type="button" className="ticket__clear" disabled={!cart.lines.length} onClick={cart.clear}>
        Clear order
      </button>
    </aside>
  );
}
