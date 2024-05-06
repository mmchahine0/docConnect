import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/doctorListStyles.css";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3500/doctor/get")
      .then((response) => {
        setDoctors(response.data.doctors);
        console.log(response.data.doctors);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleVisitClick = (doctorId) => {
    const doctorIdString = doctorId.toString();
    navigate(`/doctorProfile/${doctorIdString}`);
  };

  return (
    <>
      <Navbar />

      <div className="doctor-list-container" style={{minHeight:"62vh"}}>
        <h1>Available Doctors</h1>
        <div className="doctor-list">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-item">
                <div className="doctor-info">
                  <img src={doctor.image} alt={`${doctor.fullname} Image`} />
                  <div>
                    <h2>{doctor.fullname}</h2>
                    <p style={{marginBottom:"10px"}}>{doctor.specialty}</p>
                    <button onClick={() => handleVisitClick(doctor._id)}>
                      Visit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No doctors found</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DoctorList;
