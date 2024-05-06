import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import "../styles/BookAppointmentStyles.css";

const BookAppointment = ({ doctorId }) => {
  const DocId = doctorId.doctorIdString;
  const [doctor, setDoctor] = useState({});
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [doctorEmail, setDoctorEmail] = useState("");       
  const [officeHours, setOfficeHours] = useState([]);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3500/doctor/getspecific/${DocId}`);
        setDoctor(response.data.doctor);
        setDoctorEmail(response.data.doctor.email);
      } catch (error) {
        console.error("Error fetching doctor information:", error);
      }
    };

    fetchDoctorInfo();
  }, [DocId]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:3500/doctor/getOffice/${DocId}`)
      .then((response) => {
        setOfficeHours(response.data.officeHours);
      })
      .catch((error) => {
        console.error("Error fetching office hours:", error);
      });
  }, [DocId]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    try {
      const formattedAppointmentDate = moment(appointmentDate).format('YYYY-MM-DDTHH:mm:ss');

      const response = await axios.post("http://127.0.0.1:3500/appointment/book", {
        doctorId: DocId,
        appointmentDate: formattedAppointmentDate
      });
      console.log("Appointment booked successfully:", response.data);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error.response.data.message);
      toast.error(error.response.data.message || "Error booking appointment, try another date.");
    }
  };

  return (
    <div className="book-appointment-container" style={{minHeight:"65vh"}}>
      {doctor && (
        <>
          <h2>Book Appointment</h2>
          <div className="doctor-info">
            <img style={{marginRight:"20px"}} className="profile-image" src={doctor.image} alt={doctor.fullname} />
            <p className="profile-p">an appointment with doctor: <p className="profile-p" style={{fontWeight:"bold"}}>{doctor.fullname}</p></p>
            <p className="profile-p">Specialty: <p style={{fontWeight:"bold", marginTop:"25px"}}>{doctor.specialty}</p></p>
            <p className="profile-p">Email: <p style={{fontWeight:"bold",marginTop:"25px"}}>{doctorEmail}</p></p>
          </div>
          <div>
            <p className="profile-p">Office Hours:</p>
            <ul>
              {officeHours.map((officeHour, index) => (
                <li className="profile-p" key={index}>
                  <p className="profile-p">Day: {officeHour.day}</p>
                  <p className="profile-p">Start Time: {officeHour.startTime}</p>
                  <p className="profile-p">End Time: {officeHour.endTime}</p>
                </li>
              ))}
            </ul>
          </div>
          <form style={{marginLeft:"0px"}} onSubmit={handleBookAppointment}>
            <p style={{fontWeight:"bold",marginTop:"25px",marginBottom:"20px"}}>Pick a date:</p>
            <DatePicker
              selected={appointmentDate}
              onChange={date => setAppointmentDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <br/>
            <button style={{margin:"20px"}}type="submit">Book Appointment</button>
          </form>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default BookAppointment;
