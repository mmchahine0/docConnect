import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import appointmentimg from '../images/appointment.jpg';
import doctorimg from '../images/doctor.jpg';
import amindimg from '../images/admin.jpg';
import "../styles/HomeStyles.css"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
    useEffect(() => {
      axios.get('http://127.0.0.1:3500/user/ownUser')
        .then((response) => {
          setUserRole(response.data.user.role);
        })
        .catch((error) => {
          console.error('Error fetching user role:', error);
        });
    }, []);
  
  const handleClick = (string) =>{
    navigate(string)
  }

  
    
  return (
    <div style={{minHeight:"100vh"}}>
    <Navbar />
    {userRole ==='user' &&(<>
    <div className="firstColumnHome">
    <div className="image-container">
          <img src={appointmentimg} alt="Hospital Image"/>
          <div className="column-textHome1" style={{ borderLeft: '3px solid #022d36' }}>
          <p style={{ paddingTop: '5px', textAlign:"left"}}>Take control of your health.</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}>Schedule medical appointments easily.</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}>Connect with trusted healthcare</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}>providers and prioritize your well-being.</p></div>
          <button onClick={() => handleClick("/chooseSickness")} className="buttonHome" style={{fontSize:"18px", marginLeft:"-345px"}}>Make an Appointment</button>

        </div>
    </div>

      <div className="secondColumnHome">
      <div className="image-container">
          <img src={doctorimg} alt="Hospital Image" />
          <div className="column-textHome2" style={{ borderLeft: '3px solid #022d36' }} >
          <p style={{ paddingTop: '5px', textAlign:"left" }}>Explore diverse doctor profiles.</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}>Discover expertise and book appointments</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}> with trusted healthcare professionals tailored to your needs.</p>
          </div>
          <button onClick={() => handleClick("/doctorList")} className="buttonHome" style={{fontSize:"18px", marginLeft:"350px"}}>Check out our Doctors</button>

        </div>
      </div>
      </>)}
      {(userRole === 'doctor' || userRole === 'admin')  && (
        <div className="firstColumnHome">
          <div className="image-container" style={{}}>
            <img src={amindimg} alt="Hospital Image" />
            <div className="column-textHome1" style={{ borderRight: '3px solid #022d36' }}>
              <p style={{ paddingTop: '5px' }}>Access your privileges here.</p>
            </div>
            <button onClick={() => handleClick("/adminPage")} className="buttonHome">Press here</button>

          </div>
        </div>
      )}
    
      <div className="circleColumnHome">

</div>


    <Footer />
    </div>
  );
}

export default Home;