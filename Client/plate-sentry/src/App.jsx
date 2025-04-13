import { useState } from 'react';
import reactLogo from './assets/react.svg';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import ReportsPage from './pages/ReportsPage';
//import NotFoundPage from './pages/NotFoundPage';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/reports" element={<ReportsPage />} />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />
}

export default App;