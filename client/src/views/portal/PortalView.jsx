import { TEAM_NAME, VENDOR_NAME } from '../../config/constants';
import { VIEWS } from '../../config/views';
import './portal.css';

// Internal hub: the only page that links to the other interface views.
export default function PortalView() {
  return (
    <main className="portal" id="main">
      <h1>{VENDOR_NAME} ({TEAM_NAME})</h1>
      <p className="portal__tagline">Gig 'em fresh. Choose an interface view to open.</p>
      <nav aria-label="Interface views">
        <ul className="portal__list">
          {VIEWS.map((view) => (
            <li key={view.key}>
              <a className="portal__button" href={view.path}>
                <span className="portal__label">{view.label}</span>
                <span className="portal__description">{view.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
