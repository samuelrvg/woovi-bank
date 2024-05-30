import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectRouter';
import { isAuthenticated } from './utils/auth';
import Dashboard from './pages/dashboard';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

export function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated()} />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}
