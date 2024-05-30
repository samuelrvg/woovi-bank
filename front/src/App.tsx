import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectRouter';
import { isAuthenticated } from './utils/auth';
import Dashboard from './pages/dashboard';
import SignIn from './pages/signin';
import SignUp from './pages/signup';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated()} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}
