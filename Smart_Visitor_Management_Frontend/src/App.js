import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import store from './store';
import Layout from './layout/Layout';
import HeaderComponent from './components/Visitor/Header/HeaderComponent';
import Home from './layout/Visitor/Home/Home';
import AccessPage from './layout/Visitor/Access/Access';
import Step1Request from './layout/Visitor/Request/Step1';
import Step2Request from './layout/Visitor/Request/Step2';
import StatusPage from './layout/Visitor/Status/Status';
import QRPage from './layout/Visitor/QR/QR';
import InstructionsPage from './layout/Visitor/Instructions/Instructions';
import AdminDashboard from './layout/Admin/Dashboard/Dashboard';
import ApprovalManagement from './layout/Admin/ApprovalManagement/ApprovalManagement';
import SecurityMonitoringPage from './layout/Admin/SecurityMonitoring/SecurityMonitoring';
import BlacklistManagement from './layout/Admin/BlacklistManagement/BlacklistManagement';
import ReportsAndLogs from './layout/Admin/ReportsAndLogs/ReportsAndLogs';
import UserManagement from './layout/Admin/UserManagement/UserManagement';

import LoginPage from './layout/Login/LoginPage';

import ContactDashboard from './layout/Contact_Person/Dashboard/Dashboard';
import RequestsInbox from './layout/Contact_Person/RequestsInbox/RequestsInbox';
import RequestReview from './layout/Contact_Person/RequestReview/RequestReview';
import ApprovedRequests from './layout/Contact_Person/ApprovedRequests/ApprovedRequests';
import RejectedRequests from './layout/Contact_Person/RejectedRequests/RejectedRequests';
import SentToAdmin from './layout/Contact_Person/SentToAdmin/SentToAdmin';
import VisitorHistory from './layout/Contact_Person/VisitorHistory/VisitorHistory';
import Notifications from './layout/Contact_Person/Notifications/Notifications';
import ProfileSettings from './layout/Contact_Person/ProfileSettings/ProfileSettings';

// Security Officer Layouts
import Scanner from './layout/Security_Officer/Scanner/Scanner';
import Verification from './layout/Security_Officer/Verification/Verification';
import EntryApproval from './layout/Security_Officer/EntryApproval/EntryApproval';
import ActiveVisitors from './layout/Security_Officer/ActiveVisitors/ActiveVisitors';
import ExitVerification from './layout/Security_Officer/ExitVerification/ExitVerification';
import IncidentReport from './layout/Security_Officer/IncidentReport/IncidentReport';
import LogsHistory from './layout/Security_Officer/LogsHistory/LogsHistory';
import SecurityNotifications from './layout/Security_Officer/Notifications/Notifications';
import SecurityDashboard from './layout/Security_Officer/Dashboard/Dashboard';

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isDashboardPath = location.pathname.startsWith('/admin') || 
                          location.pathname.startsWith('/contact_person') || 
                          location.pathname.startsWith('/security-dashboard') ||
                          location.pathname.startsWith('/Security_Officer');

  return (
    <>
      {!isLoginPage && !isDashboardPath && <HeaderComponent />}
      <Layout>
        <Routes>
          {/* Entry Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Visitor Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/access" element={<AccessPage />} />
          <Route path="/request-step-1" element={<Step1Request />} />
          <Route path="/request-step-2" element={<Step2Request />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/qr" element={<QRPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/approval-management" element={<ApprovalManagement />} />
          <Route path="/admin/security-monitoring" element={<SecurityMonitoringPage />} />
          <Route path="/admin/blacklist-management" element={<BlacklistManagement />} />
          <Route path="/admin/reports-logs" element={<ReportsAndLogs />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Contact Person Routes */}
          <Route path="/contact_person/dashboard" element={<ContactDashboard />} />
          <Route path="/contact_person/requests-inbox" element={<RequestsInbox />} />
          <Route path="/contact_person/request-review" element={<RequestReview />} />
          <Route path="/contact_person/approved-requests" element={<ApprovedRequests />} />
          <Route path="/contact_person/rejected-requests" element={<RejectedRequests />} />
          <Route path="/contact_person/sent-to-admin" element={<SentToAdmin />} />
          <Route path="/contact_person/visitor-history" element={<VisitorHistory />} />
          <Route path="/contact_person/notifications" element={<Notifications />} />
          <Route path="/contact_person/profile-settings" element={<ProfileSettings />} />
          
          {/* Security Officer Routes */}
          <Route path="/Security_Officer/scanner" element={<Scanner />} />
          <Route path="/Security_Officer/verification" element={<Verification />} />
          <Route path="/Security_Officer/entry-approval" element={<EntryApproval />} />
          <Route path="/Security_Officer/active-visitors" element={<ActiveVisitors />} />
          <Route path="/Security_Officer/exit-verification" element={<ExitVerification />} />
          <Route path="/Security_Officer/incident-report" element={<IncidentReport />} />
          <Route path="/Security_Officer/logs-history" element={<LogsHistory />} />
          <Route path="/Security_Officer/notifications" element={<SecurityNotifications />} />
          <Route path="/Security_Officer/dashboard" element={<SecurityDashboard />} />
          
          <Route path="/security-dashboard" element={<Navigate to="/Security_Officer/dashboard" replace />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
