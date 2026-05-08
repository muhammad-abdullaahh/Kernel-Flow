import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import SimulationView from './pages/SimulationView';
import CompareView from './pages/CompareView';
import RecommendationView from './pages/RecommendationView';
import ReportsView from './pages/ReportsView';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SimulationView />} />
          <Route path="/compare" element={<CompareView />} />
          <Route path="/recommend" element={<RecommendationView />} />
          <Route path="/reports" element={<ReportsView />} />
          {/* Default to Simulation View */}
          <Route path="*" element={<SimulationView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
