import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import store from './store';
import Layout from './layout/Layout';
import HeaderComponent from './components/Header/HeaderComponent';
import Home from './layout/home/home';
import AccessPage from './layout/access/AccessPage';
import Step1Request from './layout/request/Step1Request';
import Step2Request from './layout/request/Step2Request';
import StatusPage from './layout/status/StatusPage';
import QRPage from './layout/qr/QRPage';
import InstructionsPage from './layout/instructions/InstructionsPage';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <HeaderComponent />
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            
            <Route path="/access" element={<AccessPage />} />
            
            <Route path="/request-step-1" element={<Step1Request />} />
            
            <Route path="/request-step-2" element={<Step2Request />} />
            
            <Route path="/status" element={<StatusPage />} />
            
            <Route path="/qr" element={<QRPage />} />
            
            <Route path="/instructions" element={<InstructionsPage />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
