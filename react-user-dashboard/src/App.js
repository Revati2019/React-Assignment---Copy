import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
};

export default App;
