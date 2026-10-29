import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Management from './pages/Management.jsx';

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand app-nav sticky-top">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2 text-white" to="/">
            <span className="brand-mark"><i className="bi bi-mortarboard-fill" /></span>
            Course Manager
          </NavLink>
          <ul className="navbar-nav ms-auto gap-1">
            <li className="nav-item">
              <NavLink end className="nav-link" to="/"><i className="bi bi-house" /> Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/manage"><i className="bi bi-table" /> Management</NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container flex-grow-1 pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manage" element={<Management />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container py-3 text-center">Course Management System, Team 3</div>
      </footer>
    </div>
  );
}