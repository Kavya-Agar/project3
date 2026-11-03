import { Router } from 'express';
import { MENU, ORDERING } from '../config.js';

const router = Router();

// Drink customization choices shared by the cashier and kiosk screens.
router.get('/', (req, res) => {
  res.json({
    categories: MENU.CATEGORIES,
    toppings: ORDERING.TOPPINGS,
    toppingPrice: ORDERING.TOPPING_PRICE,
    maxToppings: ORDERING.MAX_TOPPINGS,
    maxQuantity: ORDERING.MAX_QUANTITY,
    iceLevels: ORDERING.ICE_LEVELS,
    defaultIceLevel: ORDERING.DEFAULT_ICE_LEVEL,
    sugarLevels: ORDERING.SUGAR_LEVELS,
    defaultSugarLevel: ORDERING.DEFAULT_SUGAR_LEVEL,
  });
});

export default router;
