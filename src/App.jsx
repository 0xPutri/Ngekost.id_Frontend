import { Toaster } from "sonner";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NgekostAuthProvider } from '@/lib/NgekostAuthContext';

import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import KostList from './pages/KostList';
import KostDetail from './pages/KostDetail';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import Profile from './pages/Profile';
import PageNotFound from './lib/PageNotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <NgekostAuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/kost" element={<KostList />} />
              <Route path="/kost/:id" element={<KostDetail />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </NgekostAuthProvider>
  );
}

export default App;
