import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/AllAppointmentStyles.css";

const AllAppointment = () => {
  const { userId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const appointmentRoute = `/chooseSickness`;
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3500/appointment/get/${userId}`);
        const appointmentsData = response.data.data;
        const appointmentsWithDoctorNames = await Promise.all(
          appointmentsData.map(async (appointment) => {
            const doctorIdd = appointment.doctor;
            const doctorResponse = await axios.get(`http://127.0.0.1:3500/doctor/getspecific/${doctorIdd}`);
            const doctorName = doctorResponse.data.doctor.fullname;
            const doctorSpecialty = doctorResponse.data.doctor.specialty;
            return { ...appointment, doctorName, doctorSpecialty };
          })
        );
        setAppointments(appointmentsWithDoctorNames);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://127.0.0.1:3500/appointment/cancel/${appointmentId}`);
      const response = await axios.get(`http://127.0.0.1:3500/appointment/get/${userId}`);
      setAppointments(response.data.data);
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error("Error cancelling appointment");
    }
  };

  return (
    <>
      <Navbar />
      <div id="appointments-container" style={{ minHeight: "57vh" }}>
        <h2 style={{ padding: "10px" }}>Your Appointments:</h2>
        {loading ? (
          <p>Loading appointments...</p>         
        ) : (
          <>
          <ul style={{ padding: "5px", margin: "10px" }} id="appointments-list">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <li key={appointment._id} className="appointment-item">
                  <div className="datetime">
                    <p>Date: {appointment.date}</p>
                    <p>Time: {appointment.time}</p>
                    <p>Doctor: {appointment.doctorName}</p>
                    <p>Specialty: {appointment.doctorSpecialty}</p> 
                  </div>
                  <button className="cancel-button" onClick={() => handleCancelAppointment(appointment._id)}>
                    Cancel Appointment
                  </button>
                </li>
              ))
            ) : (
              <p>No appointments found.</p>
            )}
          </ul> 
    
          </>)}
      </div>
      <nav className="profile-a" style={{marginLeft:"80%",marginBottom:"20px", fontSize:"20px"}}>
          <Link to={appointmentRoute}>Make an Appointment</Link> 
          </nav>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default AllAppointment;
