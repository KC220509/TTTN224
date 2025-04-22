import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from './App.tsx';
import LoginPage from './pages/LoginPage/loginPage.tsx';
import AdminPage from './pages/AdminPage/adminPage.tsx';
import TeamleadPage from './pages/TeamleadPage/teamleadPage.tsx';
import OperatorPage from './pages/OperatorPage/OperatorPage.tsx';
import SupervisorPage from './pages/SupervisorPage/SupervisorPage.tsx';
import PrivateRoute from './PrivateRoute.tsx';
import UserManagers from './pages/AdminPage/userManager.tsx';
import IndexPage from './pages/AdminPage/indexPage.tsx';
import UpdatePass from './pages/AdminPage/updatePass.tsx';
import IndexPageTL from './pages/TeamleadPage/indexPage.tsx';
import DeviceDeviceGroup from './pages/TeamleadPage/device-Dvgroup.tsx';
// import IndexPage from './pages/AdminPage/indexPage.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} >
          <Route index element={<LoginPage />} />


          {/* Admin Layout */}
          <Route path='admin-page' element={<PrivateRoute allowedRoles={['1']}><AdminPage /></PrivateRoute>}>
            <Route index element={<IndexPage />} />
            <Route path='user-manager' element={<UserManagers />} />
            <Route path='update-pass' element={<UpdatePass />} />
          </Route>

          {/* Teamlead Layout */}
          <Route path='teamlead-page' element={<PrivateRoute allowedRoles={['2']}><TeamleadPage /></PrivateRoute>} >
            <Route index element={<IndexPageTL />} />
            <Route path='device-groups' element={<DeviceDeviceGroup />} />
          </Route>

          {/* Operator Layout */}
          <Route path='operator-page' element={<PrivateRoute allowedRoles={['3']}><OperatorPage /></PrivateRoute>} />

          {/* Supervisor Layout */}
          <Route path='supervisor-page' element={<PrivateRoute allowedRoles={['4']}><SupervisorPage /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
)
