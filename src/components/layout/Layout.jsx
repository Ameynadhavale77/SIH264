import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Statutory Government Top Tricolor Ribbon */}
      <div className="gov-tricolor-bar" />

      {/* Official SIH Prototype Research Disclaimer Banner */}
      <div className="gov-disclaimer-banner">
        {t('app.prototypeNotice')}
      </div>

      <div className="app-layout">
        <Sidebar />
        <div className="main-wrapper">
          <Header />
          <main className="content-container">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
