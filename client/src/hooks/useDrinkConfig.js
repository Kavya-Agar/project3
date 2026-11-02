import { useMemo, useState } from 'react';

// State for customizing one drink (toppings, ice, sugar, quantity) and its price.
export function useDrinkConfig(product, options) {
  const [toppings, setToppings] = useState([]);
  const [iceLevel, setIceLevel] = useState(options.defaultIceLevel);
  const [sugarLevel, setSugarLevel] = useState(options.defaultSugarLevel);
  const [quantity, setQuantity] = useState(1);

  const toggleTopping = (name) =>
    setToppings((current) => {
      if (current.includes(name)) return current.filter((topping) => topping !== name);
      return current.length < options.maxToppings ? [...current, name] : current;
    });

  const unitPrice = product.price + toppings.length * options.toppingPrice;
  const changeQuantity = (delta) =>
    setQuantity((current) => Math.min(options.maxQuantity, Math.max(1, current + delta)));

  const line = useMemo(
    () => ({
      productId: product.productId,
      name: product.name,
      toppings,
      iceLevel,
      sugarLevel,
      quantity,
      unitPrice,
    }),
    [product, toppings, iceLevel, sugarLevel, quantity, unitPrice],
  );

  return {
    toppings, iceLevel, sugarLevel, quantity, unitPrice, line,
    toggleTopping, setIceLevel, setSugarLevel, changeQuantity,
    atToppingLimit: toppings.length >= options.maxToppings,
  };
}
