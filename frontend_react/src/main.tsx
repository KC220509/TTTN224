import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from './App.tsx';
import LoginPage from './pages/LoginPage/loginPage.tsx';
import AdminPage from './pages/AdminPage/adminPage.tsx';
import TeamleadPage from './pages/TeamleadPage/teamleadPage.tsx';
import SupervisorPage from './pages/SupervisorPage/SupervisorPage.tsx';
import PrivateRoute from './PrivateRoute.tsx';
import UserManagers from './pages/AdminPage/userManager.tsx';
import IndexPage from './pages/AdminPage/indexPage.tsx';
import UpdatePass from './pages/AdminPage/updatePass.tsx';
import IndexPageTL from './pages/TeamleadPage/indexPage.tsx';
import DeviceDeviceGroup from './pages/TeamleadPage/device-Dvgroup.tsx';
import PageResetPass from './pages/PageResetPass/PageResetPass.tsx';
import CommandListPage from './pages/TeamleadPage/commandListPage.tsx';
import ProfilePage from './pages/TeamleadPage/profilePage.tsx';
import IndexPageOP from './pages/OperatorPage/indexPage.tsx';
import ConnectProfilePage from './pages/OperatorPage/opProfilePage.tsx';
import OperatorPage from './pages/OperatorPage/operatorPage.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} >
          {/* Public Routes */}
          <Route index element={<LoginPage />} />
          <Route path='reset-pass-admin' element={<PageResetPass />} />

          {/* Private Routes */}


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
            <Route path='command-lists' element={<CommandListPage />} />
            <Route path='profiles' element={<ProfilePage />} />
          </Route>

          {/* Operator Layout */}
          <Route path='operator-page' element={<PrivateRoute allowedRoles={['3']}><OperatorPage /></PrivateRoute>} >
            <Route index element={<IndexPageOP />} />
            <Route path='profiles' element={<ConnectProfilePage />} />
          </Route>

          {/* Supervisor Layout */}
          <Route path='supervisor-page' element={<PrivateRoute allowedRoles={['4']}><SupervisorPage /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
)
