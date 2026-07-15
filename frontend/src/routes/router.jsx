import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { RegisterSocietyPage } from '../pages/RegisterSocietyPage.jsx';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.jsx';
import { VerifyOtpPage } from '../pages/VerifyOtpPage.jsx';
import { ResetPasswordPage } from '../pages/ResetPasswordPage.jsx';
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
  { path: '/register-society', element: <RegisterSocietyPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/verify-otp', element: <VerifyOtpPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
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
