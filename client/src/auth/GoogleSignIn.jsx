import { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

const GSI_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) return resolve();
    const script = document.createElement('script');
    script.src = GSI_SCRIPT_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load Google sign-in'));
    document.head.appendChild(script);
    return undefined;
  });
}

export default function GoogleSignIn() {
  const { config, signIn } = useAuth();
  const buttonRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: config.clientId,
          callback: ({ credential }) => signIn(credential).catch((err) => setError(err.message)),
        });
        window.google.accounts.id.renderButton(buttonRef.current, { theme: 'filled_black', size: 'large' });
      })
      .catch((err) => setError(err.message));
    return () => { cancelled = true; };
  }, [config.clientId, signIn]);

  return (
    <main className="signin" id="main">
      <h1>Manager sign-in</h1>
      <p>Sign in with an authorized Google account to open the dashboard.</p>
      <div ref={buttonRef} />
      {error && <p className="status status--error" role="alert">{error}</p>}
    </main>
  );
}
