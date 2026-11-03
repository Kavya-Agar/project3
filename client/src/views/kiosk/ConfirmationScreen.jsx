import { useEffect, useRef } from 'react';

export default function ConfirmationScreen({ orderId, onDone }) {
  const headingRef = useRef(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <section className="confirmation" aria-labelledby="confirm-heading">
      <h2 id="confirm-heading" tabIndex={-1} ref={headingRef}>Thank you! Your order is in.</h2>
      <p>Your order number is</p>
      <p className="confirmation__number" aria-label={`Order number ${orderId}`}>{orderId}</p>
      <p>We will call you when your drinks are ready.</p>
      <button type="button" className="big-btn big-btn--primary" onClick={onDone}>Start a new order</button>
    </section>
  );
}
