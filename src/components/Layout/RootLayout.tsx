import { Outlet } from 'react-router-dom';
import DebugPanel from '../DebugPanel';

const RootLayout = () => {
  return (
    <>
      <Outlet />
      <DebugPanel />
    </>
  );
};

export default RootLayout;
