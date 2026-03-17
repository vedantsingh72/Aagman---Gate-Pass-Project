import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';
import FallbackUI from './components/common/FallbackUI';
import { Suspense } from 'react';
import './index.css';


function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FallbackUI message="Loading application..." />}>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

