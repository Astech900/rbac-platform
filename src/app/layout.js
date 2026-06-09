import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'RBAC Social Platform',
  description: 'A role-based social media application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="winter">
      <body className="bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen text-slate-800 antialiased selection:bg-primary/30">
        <AuthProvider>
          <Navbar />
          <main className="container">
            {children}
          </main>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
        </AuthProvider>
      </body>
    </html>
  );
}
