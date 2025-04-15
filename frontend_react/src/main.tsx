import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from './App.tsx';
import LoginPage from './pages/LoginPage/loginPage.tsx';
import AdminPage from './pages/AdminPage/adminPage.tsx';
import TeamleadPage from './pages/TeamleadPage/TeamleadPage.tsx';
import OperatorPage from './pages/OperatorPage/OperatorPage.tsx';
import SupervisorPage from './pages/SupervisorPage/SupervisorPage.tsx';
import PrivateRoute from './PrivateRoute.tsx';
import UserManagers from './pages/AdminPage/userManager.tsx';
import IndexPage from './pages/AdminPage/indexPage.tsx';
import UpdatePass from './pages/AdminPage/updatePass.tsx';
import ResetPass from './pages/AdminPage/resetPassPage.tsx';
// import IndexPage from './pages/AdminPage/indexPage.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} >
          <Route index element={<LoginPage />} />


          {/* Admin Layout */}
          <Route path='admin-page' element={<PrivateRoute><AdminPage /></PrivateRoute>}>
            <Route index element={<IndexPage />} />
            <Route path='user-manager' element={<UserManagers />} />
            <Route path='update-pass' element={<UpdatePass />} />
            <Route path='reset-pass' element={<ResetPass />} />
          </Route>

          {/* Teamlead Layout */}
          <Route path='teamlead-page' element={<PrivateRoute><TeamleadPage /></PrivateRoute>} />

          {/* Operator Layout */}
          <Route path='operator-page' element={<PrivateRoute><OperatorPage /></PrivateRoute>} />

          {/* Supervisor Layout */}
          <Route path='supervisor-page' element={<PrivateRoute><SupervisorPage /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
)
