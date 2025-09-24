import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from './utils/auth';
import { User } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import AddBook from './pages/AddBook';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getUser();
      setUser(userData);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route 
            path="/login" 
            element={
              <main className="main-content">
                {!user ? <Login setUser={setUser} /> : <Navigate to="/books" />}
              </main>
            } 
          />
          <Route 
            path="/register" 
            element={
              <main className="main-content">
                {!user ? <Register setUser={setUser} /> : <Navigate to="/books" />}
              </main>
            } 
          />
          <Route 
            path="/" 
            element={
              <main className="main-content">
                <HomePage />
              </main>
            } 
          />
          <Route 
            path="/books" 
            element={
              <main className="main-content with-padding">
                <BookList />
              </main>
            } 
          />
          <Route 
            path="/books/:id" 
            element={
              <main className="main-content with-padding">
                <BookDetail user={user} />
              </main>
            } 
          />
          <Route 
            path="/add-book" 
            element={
              <main className="main-content">
                {user ? <AddBook /> : <Navigate to="/login" />}
              </main>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
