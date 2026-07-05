import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Practice } from './pages/Practice';
import { WrongBook } from './pages/WrongBook';
import { Stats } from './pages/Stats';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice/:id" element={<Practice />} />
        <Route path="/wrong" element={<WrongBook />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
}

export default App;