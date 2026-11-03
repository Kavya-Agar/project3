import { VENDOR_NAME } from '../../config/constants';

export default function WelcomeScreen({ onStart }) {
  return (
    <button type="button" className="welcome" onClick={onStart}>
      <h1 className="welcome__title">{VENDOR_NAME}</h1>
      <p className="welcome__sub">Fresh-brewed boba, made the Aggie way. Howdy!</p>
      <span className="welcome__cta">Touch to order</span>
    </button>
  );
}
