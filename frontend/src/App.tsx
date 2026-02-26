import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SaveRecipePage } from './pages/SaveRecipePage';
import { CookbookPage } from './pages/CookbookPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem 0' }}>
          <Navbar />
        </div>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<CookbookPage />} />
            <Route path="/cookbook" element={<CookbookPage />} />
            <Route path="/save" element={<SaveRecipePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
