import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OrganizationPage from './pages/OrganizationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/org/:slug" element={<OrganizationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
