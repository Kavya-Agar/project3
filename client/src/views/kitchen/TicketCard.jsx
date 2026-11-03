import { ORDERING_LABELS } from './labels';
import { formatElapsed, getUrgency } from '../../utils/urgency';

export default function TicketCard({ ticket, sugarLevels, onComplete }) {
  const urgency = getUrgency(ticket.ageSeconds);
  const sugarLabel = (value) => sugarLevels.find((level) => level.value === value)?.label ?? value;

  return (
    <article className={`ticket-card ticket-card--${urgency}`} aria-label={`Order ${ticket.orderId}`}>
      <div className="ticket-card__head">
        <span className="ticket-card__number">#{ticket.orderId}</span>
        <span className="ticket-card__timer" aria-label={`Waiting ${formatElapsed(ticket.ageSeconds)}`}>
          {formatElapsed(ticket.ageSeconds)}
        </span>
      </div>
      <div className="ticket-card__meta">
        <span className="ticket-card__source">{ORDERING_LABELS[ticket.source] ?? ticket.source}</span>
        <span>Placed {ticket.placedAt}</span>
      </div>
      <ul className="ticket-card__items">
        {ticket.items.map((item, index) => (
          <li key={index} className="ticket-card__item">
            <div className="ticket-card__item-name">{item.quantity} × {item.name}</div>
            <div className="ticket-card__mods">
              {[...item.toppings, `Ice: ${item.iceLevel}`, `Sugar: ${sugarLabel(item.sugarLevel)}`].join(' · ')}
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="ticket-card__done" onClick={() => onComplete(ticket.orderId)}>
        Complete order #{ticket.orderId}
      </button>
    </article>
  );
}
