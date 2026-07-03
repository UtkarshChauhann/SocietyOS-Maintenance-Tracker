import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { ResidentComplaintsPage } from '../pages/ResidentComplaintsPage.jsx';
import { NewComplaintPage } from '../pages/NewComplaintPage.jsx';
import { ComplaintDetailPage } from '../pages/ComplaintDetailPage.jsx';
import { NoticeBoardPage } from '../pages/NoticeBoardPage.jsx';
import { AdminDashboardPage } from '../pages/AdminDashboardPage.jsx';
import { AdminComplaintsPage } from '../pages/AdminComplaintsPage.jsx';
import { NewNoticePage } from '../pages/NewNoticePage.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/notices', element: <NoticeBoardPage /> },
          { path: '/complaints/:id', element: <ComplaintDetailPage /> }
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute roles={['resident']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/complaints', element: <ResidentComplaintsPage /> },
          { path: '/complaints/new', element: <NewComplaintPage /> }
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute roles={['admin']} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/admin/dashboard', element: <AdminDashboardPage /> },
          { path: '/admin/complaints', element: <AdminComplaintsPage /> },
          { path: '/admin/notices/new', element: <NewNoticePage /> }
        ]
      }
    ]
  },
  { path: '*', element: <Navigate to="/login" replace /> }
]);
