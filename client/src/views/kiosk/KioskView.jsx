import { useCallback, useState } from 'react';
import { fetchMenu } from '../../api/menuApi';
import { fetchOptions } from '../../api/optionsApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { VENDOR_NAME } from '../../config/constants';
import { useApi } from '../../hooks/useApi';
import { useIdleReset } from '../../hooks/useIdleReset';
import { useOrderCart } from '../../hooks/useOrderCart';
import CartPanel from './CartPanel';
import ConfirmationScreen from './ConfirmationScreen';
import CustomizeScreen from './CustomizeScreen';
import DrinkBrowser from './DrinkBrowser';
import WelcomeScreen from './WelcomeScreen';
import './kiosk.css';

const ORDER_SOURCE = 'kiosk';
const IDLE_TIMEOUT_MS = 90_000;
const CONFIRMATION_TIMEOUT_MS = 20_000;
const SCREENS = { WELCOME: 'welcome', BROWSE: 'browse', CUSTOMIZE: 'customize', DONE: 'done' };

export default function KioskView() {
  const menu = useApi(fetchMenu);
  const options = useApi(fetchOptions);
  const cart = useOrderCart(ORDER_SOURCE);

  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [category, setCategory] = useState(null);
  const [selected, setSelected] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [largeText, setLargeText] = useState(false);

  const reset = useCallback(() => {
    cart.clear();
    setSelected(null);
    setError(null);
    setScreen(SCREENS.WELCOME);
  }, [cart.clear]); // eslint-disable-line react-hooks/exhaustive-deps

  const onConfirmation = screen === SCREENS.DONE;
  useIdleReset(screen !== SCREENS.WELCOME, onConfirmation ? CONFIRMATION_TIMEOUT_MS : IDLE_TIMEOUT_MS, reset);

  if (menu.error || options.error) {
    return <ErrorMessage error={menu.error ?? options.error} onRetry={() => { menu.reload(); options.reload(); }} />;
  }
  if (menu.loading || options.loading) return <Loading />;

  const activeCategory = category ?? options.data.categories[0];

  async function handleCheckout() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await cart.checkout();
      setOrderId(result.orderId);
      setScreen(SCREENS.DONE);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (screen === SCREENS.WELCOME) {
    return <div className={`kiosk${largeText ? ' kiosk--large-text' : ''}`}><WelcomeScreen onStart={() => setScreen(SCREENS.BROWSE)} /></div>;
  }

  return (
    <div className={`kiosk${largeText ? ' kiosk--large-text' : ''}`}>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="kiosk__bar">
        <span className="kiosk__brand">{VENDOR_NAME}</span>
        <div className="kiosk__tools">
          <button type="button" aria-pressed={largeText} onClick={() => setLargeText((on) => !on)}>Larger text</button>
        </div>
      </header>
      <main className="kiosk__main" id="main">
        {screen === SCREENS.BROWSE && (
          <DrinkBrowser products={menu.data} categories={options.data.categories} activeCategory={activeCategory}
                        onCategoryChange={setCategory}
                        onSelect={(product) => { setSelected(product); setScreen(SCREENS.CUSTOMIZE); }} />
        )}
        {screen === SCREENS.CUSTOMIZE && (
          <CustomizeScreen key={selected.productId} product={selected} options={options.data}
                           onBack={() => setScreen(SCREENS.BROWSE)}
                           onAdd={(line) => { cart.addLine(line); setScreen(SCREENS.BROWSE); }} />
        )}
        {screen === SCREENS.DONE && <ConfirmationScreen orderId={orderId} onDone={reset} />}
      </main>
      {screen !== SCREENS.DONE && <CartPanel cart={cart} submitting={submitting} error={error} onCheckout={handleCheckout} />}
    </div>
  );
}
