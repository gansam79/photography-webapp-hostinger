import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';

// Pages
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Quotations from './pages/Quotations';
import Invoices from './pages/Invoices';
import NotFound from './pages/NotFound';

// Components
import Reminders from './components/common/Reminders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Reminders />
    </Router>
  );
}

export default App;
