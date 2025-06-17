import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const mockUsers = [
  {
    id: 1,
    username: 'developer',
    password: 'dev123',
    role: 'developer',
    name: 'John Developer'
  },
  {
    id: 2,
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    name: 'Jane Manager'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    setLoading(true);
    // Mock authentication
    setTimeout(() => {
      const foundUser = mockUsers.find(
        u => u.username === username && u.password === password
      );
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        navigate('/dashboard');
      } else {
        alert('Invalid credentials');
      }
      setLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}