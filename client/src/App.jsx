import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from './auth/RequireAuth';
import { Loading } from './components/StatusMessage';
import { VIEWS } from './config/views';
import PortalView from './views/portal/PortalView';

const viewModules = import.meta.glob('./views/{manager,cashier,kiosk,kitchen}/*View.jsx');

function ComingSoon({ label }) {
  return <main id="main"><h1>{label}</h1><p>This view is not available yet.</p></main>;
}

function buildRoute(view) {
  const load = viewModules[view.component];
  const Component = load ? lazy(load) : () => <ComingSoon label={view.label} />;
  const element = view.requiresAuth
    ? <RequireAuth><Component /></RequireAuth>
    : <Component />;
  return <Route key={view.key} path={view.path} element={element} />;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<PortalView />} />
        {VIEWS.map(buildRoute)}
        <Route path="*" element={<ComingSoon label="Page not found" />} />
      </Routes>
    </Suspense>
  );
}
