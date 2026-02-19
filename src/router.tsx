import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/Layout/RootLayout';
import Home from './pages/Home';
import FryDetail from './pages/FryDetail';
import Checkout from './pages/Checkout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/fries/:slug',
        element: <FryDetail />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
    ],
  },
]);
