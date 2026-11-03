import { useEffect, useRef } from 'react';
import { useDrinkConfig } from '../../hooks/useDrinkConfig';
import { formatMoney } from '../../utils/money';

function OptionStep({ title, children }) {
  return (
    <fieldset className="step" style={{ border: 0, padding: 0 }}>
      <legend><h3>{title}</h3></legend>
      <div className="option-row">{children}</div>
    </fieldset>
  );
}

export default function CustomizeScreen({ product, options, onAdd, onBack }) {
  const config = useDrinkConfig(product, options);
  const headingRef = useRef(null);

  // Move focus to the heading so screen reader users hear the new screen.
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <section aria-labelledby="customize-heading">
      <h2 id="customize-heading" className="kiosk__heading" tabIndex={-1} ref={headingRef}>
        Make it yours: {product.name}
      </h2>
      <OptionStep title={`Toppings (${formatMoney(options.toppingPrice)} each, up to ${options.maxToppings})`}>
        {options.toppings.map((name) => (
          <button key={name} type="button" className="option" aria-pressed={config.toppings.includes(name)}
                  disabled={config.atToppingLimit && !config.toppings.includes(name)}
                  onClick={() => config.toggleTopping(name)}>{name}</button>
        ))}
      </OptionStep>
      <OptionStep title="Ice">
        {options.iceLevels.map((level) => (
          <button key={level} type="button" className="option" aria-pressed={level === config.iceLevel}
                  onClick={() => config.setIceLevel(level)}>{level}</button>
        ))}
      </OptionStep>
      <OptionStep title="Sweetness">
        {options.sugarLevels.map((level) => (
          <button key={level.value} type="button" className="option" aria-pressed={level.value === config.sugarLevel}
                  onClick={() => config.setSugarLevel(level.value)}>{level.label}</button>
        ))}
      </OptionStep>
      <div className="kiosk__actions">
        <div className="stepper">
          <button type="button" aria-label="Fewer" onClick={() => config.changeQuantity(-1)}>−</button>
          <span aria-live="polite" aria-label={`Quantity ${config.quantity}`}>{config.quantity}</span>
          <button type="button" aria-label="More" onClick={() => config.changeQuantity(1)}>+</button>
        </div>
        <button type="button" className="big-btn" onClick={onBack}>Back</button>
        <button type="button" className="big-btn big-btn--primary" onClick={() => onAdd(config.line)}>
          Add to order · {formatMoney(config.unitPrice * config.quantity)}
        </button>
      </div>
    </section>
  );
}
