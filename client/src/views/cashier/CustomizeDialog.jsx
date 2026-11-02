import { useDrinkConfig } from '../../hooks/useDrinkConfig';
import { formatMoney } from '../../utils/money';

function ChipGroup({ legend, choices, isSelected, onToggle, disabledWhen = () => false }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="chip-row">
        {choices.map(({ key, label }) => (
          <button key={key} type="button" className="chip" aria-pressed={isSelected(key)}
                  disabled={disabledWhen(key)} onClick={() => onToggle(key)}>
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function CustomizeDialog({ product, options, onAdd, onCancel }) {
  const config = useDrinkConfig(product, options);
  const asChoices = (values) => values.map((value) => ({ key: value, label: value }));

  return (
    <div className="dialog-backdrop" role="presentation">
      <div className="dialog" role="dialog" aria-modal="true" aria-label={`Customize ${product.name}`}>
        <h2>{product.name}</h2>
        <ChipGroup legend={`Toppings (+${formatMoney(options.toppingPrice)} each, max ${options.maxToppings})`}
                   choices={asChoices(options.toppings)} isSelected={(name) => config.toppings.includes(name)}
                   onToggle={config.toggleTopping}
                   disabledWhen={(name) => config.atToppingLimit && !config.toppings.includes(name)} />
        <ChipGroup legend="Ice" choices={asChoices(options.iceLevels)}
                   isSelected={(level) => level === config.iceLevel} onToggle={config.setIceLevel} />
        <ChipGroup legend="Sugar" choices={options.sugarLevels.map((level) => ({ key: level.value, label: level.label }))}
                   isSelected={(value) => value === config.sugarLevel} onToggle={config.setSugarLevel} />
        <div className="dialog__footer">
          <div className="qty">
            <button type="button" aria-label="Decrease quantity" onClick={() => config.changeQuantity(-1)}>−</button>
            <span aria-live="polite">{config.quantity}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => config.changeQuantity(1)}>+</button>
          </div>
          <div className="dialog__actions">
            <button type="button" className="dialog__cancel" onClick={onCancel}>Cancel</button>
            <button type="button" className="dialog__add" onClick={() => onAdd(config.line)}>
              Add · {formatMoney(config.unitPrice * config.quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
