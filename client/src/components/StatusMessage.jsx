// Consistent loading and error states for data-driven screens.
export function Loading({ label = 'Loading…' }) {
  return <p className="status status--loading" role="status">{label}</p>;
}

export function ErrorMessage({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="status status--error" role="alert">
      <p>{error.message ?? 'Something went wrong.'}</p>
      {error.details?.length > 0 && (
        <ul>{error.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      )}
      {onRetry && <button type="button" onClick={onRetry}>Try again</button>}
    </div>
  );
}
