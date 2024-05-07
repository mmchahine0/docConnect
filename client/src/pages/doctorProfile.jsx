import { Link, useParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorProfileS from "../components/DoctorProfile";


const DoctorProfile = () => {
  const { doctorIdString } = useParams();

  const appointmentRoute = `/appointment/${doctorIdString}`;

  return (
    <>
      <Navbar />
      <DoctorProfileS userId={doctorIdString} />
      <nav className="profile-a" style={{marginLeft:"45%",marginBottom:"20px"}}>
        <Link to={appointmentRoute}>Make an Appointment</Link> <br/>
      </nav>
      <Footer />
    </>
  );
}

export default DoctorProfile;
