import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ProductList from './components/ProductList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <ProductList onLogout={handleLogout} />
      ) : (
        <Login setAuth={setIsAuthenticated} />
      )}
    </>
  );
}

export default App;