import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

//pages 
import Home from "./pages/Home"
import Appointment from './pages/appointment';
import ChooseSickness from './pages/chooseSickness';
import DoctorList from './pages/doctorList';
import DoctorProfile from './pages/doctorProfile';
import LoginS from './pages/login';
import Signup from './pages/signup';
import PatientProfile from './pages/patientProfile';
import AdminPage from './pages/adminPage';
import AllUsers from './pages/AllUsers'
import NotFound from './pages/notFound';
import AllAppointment from './pages/AllAppointments';

//components
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthProvider';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout/>}>
            <Route
              path="/*"
              element={<NotFound />}
            />
            {/* public routes */}
            <Route
              path="/login"
              element={<LoginS />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            
            {/* protected */}
            <Route element={<RequireAuth allowedRole={["user","doctor","admin"]}/>}>
              <Route
              path="/home"
              element={<Home />}
              />
              <Route
              path="/appointment/:doctorIdString"
              element={<Appointment />}
              />
              <Route
              path="/chooseSickness"
              element={<ChooseSickness />}
              />
              <Route
              path="/doctorList"
              element={<DoctorList />}
              />
              <Route
              path="/doctorProfile/:doctorIdString"
              element={<DoctorProfile />}
              />
              <Route
              path="/patientProfile/:userId"
              element={<PatientProfile />}
                />
              <Route
              path="/appointments/:userId"
              element={<AllAppointment />}
              />
          </Route>
            {/* specified role to precced */}
          <Route element={<RequireAuth allowedRole={["doctor","admin"]}/>}>

            <Route
              path="/adminPage"
              element={<AdminPage/>}
            />
            <Route
              path="/usersList"
              element={<AllUsers/>}
            />
          </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
