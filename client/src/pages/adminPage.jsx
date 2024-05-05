import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import React, { useState, useEffect, useParams } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/HoursStyles.css";

const AllDoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('')
  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserId(response.data.user._id);
        setUserRole(response.data.user.role)
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3500/appointment/get/${userId}`);
        setAppointments(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        setLoading(false);
      }
    };

    fetchDoctorAppointments();
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
    <>{userRole === 'doctor' && (
      <div id="appointments-container">
        <h2 style={{padding:"10px"}}>Doctor's Appointments: </h2>
        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <ul style={{padding:"5px", margin:"10px"}} id="appointments-list">
            {appointments.map((appointment) => (
              <li key={appointment._id} className="appointment-item">
                <div className="datetime">
                  Date: {appointment.date}, Time: {appointment.time}
                </div>
                <button onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
              </li>
            ))}
          </ul>
        )}
         <ToastContainer />
      </div>
      )}    
    </>
  );
};

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3500/user/ownUser');
        setUserId(response.data.user._id);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.patch(`http://127.0.0.1:3500/auth/updatePassword/${userId}`, {
        oldPassword,
        password,
        confirmPassword,
      });
      
      setMessage(response.data.message);
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <div className="containerUpdate">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword" className="labelUpdate">Old Password:</label>
          <input
            className="textInputUpdate"
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="labelUpdate">New Password:</label>
          <input
            className="textInputUpdate"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="labelUpdate">Confirm New Password:</label>
          <input
            className="textInputUpdate" 
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};


const DoctorProfileImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post(`http://127.0.0.1:3500/util/uploadProfileimg/${userRole}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Profile image uploaded successfully:', response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <>{userRole === 'doctor' && (
    <div className="containerUpdate">
      <h2> Upload your Profile picture</h2>
      <div style={{padding:"5px",margin:"10px"}}>
        <input style={{padding:"5px",margin:"10px"}} type="file" accept="image/*" onChange={handleImageChange} />
        <button style={{padding:"5px",margin:"10px"}} onClick={handleImageUpload}>Upload Profile Image</button>
      </div>
    </div>
    )}
    </>
  );
};

const BioUpdateForm = () => {

  const [bio, setBio] = useState("");  
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        `http://127.0.0.1:3500/doctor/update-bio`,
        { bio }
      );
      toast.success('Bio updated successfully');
    } catch (error) {
      console.error("Error updating bio: ", error);
      toast.error('Error updating bio');
    }
  };

  return (
    <>{userRole === 'doctor' && (
    <div className="containerUpdate" >
      <h2 className="labelUpdate">Update Bio</h2>
      <form onSubmit={handleSubmit}>
        <label className="labelUpdate">
          Bio:
          <textarea
            className="textInputUpdate"
            value={bio}
            onChange={handleBioChange}
            placeholder="Enter your bio"
            rows={5}
            cols={50}
          />
        </label>
        <br />
        <button type="submit">Update Bio</button>
      </form>
      <ToastContainer/>
    </div>
    )}</>
  );
};

const SpecialtyUpdateForm = () => {

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Urology',
  ];

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSpecialty) {
      toast.error('Please select a specialty.');
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:3500/doctor/specialty`,
        { specialty: selectedSpecialty },
      );
    toast.success('Bio updated successfully');

    } catch (error) {
      console.error("Error updating specialty: ", error);
      toast.error('Error updating specialty');

    }
  };

  return (
    <>{userRole === 'doctor' && (

    <div className="containerUpdate">
      <h2 className="labelUpdate">Choose Specialty</h2>
      <form onSubmit={handleSubmit}>
        <label className="labelUpdate">
          Select Specialty:
          <select value={selectedSpecialty} onChange={handleSpecialtyChange}>
            <option value="">Select a specialty</option>
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Update Specialty</button>
      </form>
      <ToastContainer/>
    </div>
    )}</>
  );
};

const UpdateOfficeHours = () => {
  const [newOfficeHours, setNewOfficeHours] = useState([
    { day: '', startTime: '', endTime: '' }
  ]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleAddDay = () => {
    if (newOfficeHours.length < 5) {
      setNewOfficeHours([...newOfficeHours, { day: '', startTime: '', endTime: '' }]);
    } else {
      toast.error('You cannot add more than 5 days per week');
    }
  };

  const handleRemoveDay = (index) => {
    if (newOfficeHours.length > 1) {
      const updatedOfficeHours = [...newOfficeHours];
      updatedOfficeHours.splice(index, 1);
      setNewOfficeHours(updatedOfficeHours);
    } else {
      toast.error('You must have at least 1 day per week');
    }
  };

  const handleUpdateOfficeHours = () => {

    const isValid = newOfficeHours.every(hours => hours.day && hours.startTime && hours.endTime);
    if (!isValid) {
      toast.error('Please fill in all fields before updating office hours');
      return;
    }

    axios
      .post(`http://127.0.0.1:3500/doctor/update-office-hours`, { officeHours: newOfficeHours })
      .then((response) => {
        toast.success('Office hours updated successfully');
        console.log('Office hours updated successfully:', response.data);
      })
      .catch((error) => {
        toast.error('Error updating office hours');
        console.error('Error updating office hours:', error);
      });
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOfficeHours = [...newOfficeHours];
    updatedOfficeHours[index] = {
      ...updatedOfficeHours[index],
      [name]: value,
    };
    setNewOfficeHours(updatedOfficeHours);
  };

  return (
    <>
      {userRole === 'doctor' && (
        <div className="containerUpdate" style={{ borderBottom: "black solid" }}>
          <h2 className="labelUpdate">Update Office hours</h2>

          {newOfficeHours.map((officeHour, index) => (
            <div key={index}>
              <label className="labelUpdate">
                Day {index + 1}:
                <select className="selectInputUpdate" name="day" value={officeHour.day} onChange={(e) => handleInputChange(index, e)}>
                  <option value="">Select a day</option>
                  <option value="mon">Monday</option>
                  <option value="tue">Tuesday</option>
                  <option value="wed">Wednesday</option>
                  <option value="thu">Thursday</option>
                  <option value="fri">Friday</option>
                  <option value="sat">Saturday</option>
                  <option value="sun">Sunday</option>
                </select>
              </label>
              <label className="labelUpdate">
                Start Time:
                <input placeholder="EX: 09:00:00" className="textInputUpdate" type="text" name="startTime" value={officeHour.startTime} onChange={(e) => handleInputChange(index, e)} />
              </label>
              <label className="labelUpdate">
                End Time:
                <input placeholder="EX: 17:00:00" style={{ borderBottom: "black solid" }} className="textInputUpdate" type="text" name="endTime" value={officeHour.endTime} onChange={(e) => handleInputChange(index, e)} />
              </label>
              <button className="buttonUpdateUpdate" onClick={() => handleRemoveDay(index)}>Remove Day</button>
            </div>
          ))}
          <button className="buttonUpdateUpdate" onClick={handleAddDay}>Add Day</button>
          <button className="buttonUpdateUpdate" onClick={handleUpdateOfficeHours}>Update Office Hours</button>
          <ToastContainer className="Toastify__toast-containerUpdate" />
        </div>
      )}
    </>
  );
};


const CreateOrUpdateMedicalRecord = () => {
  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [labReports, setLabReports] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleCreateOrUpdateMedicalRecord = () => {
    axios
      .post(`http://127.0.0.1:3500/medical-records/create`, {
        patientId,
        diagnosis,
        medications,
        labReports,
        prescriptions,
        additionalNotes,
      })
      .then((response) => {
        console.log('Medical record created/updated successfully:', response.data);
        toast.success('Medical record created/updated successfully');

      })
      .catch((error) => {
        console.error('Error creating/updating medical record:', error);
        toast.error('Error creating/updating medical record');

      });
  };

  return (
    <>{userRole === 'doctor' && (

    <div className="containerUpdate">
      <h2 className="labelUpdate">Create/Update Medical Record</h2>

      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="patientId">Patient ID:</label>
        <input
          className="textInputUpdate"
          type="text"
          id="patientId"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="diagnosis">Diagnosis:</label>
        <textarea
          className="textInputUpdate"
          id="diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter Diagnosis"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="medications">Medications:</label>
        <textarea
          id="medications"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          placeholder="Enter Medications"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="labReports">Lab Reports:</label>
        <textarea
          id="labReports"
          value={labReports}
          onChange={(e) => setLabReports(e.target.value)}
          placeholder="Enter Lab Reports"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="prescriptions">Prescriptions:</label>
        <textarea
          id="prescriptions"
          value={prescriptions}
          onChange={(e) => setPrescriptions(e.target.value)}
          placeholder="Enter Prescriptions"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="additionalNotes">Additional Notes:</label>
        <textarea
          id="additionalNotes"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Enter Additional Notes"
        />
      </div>
      <button className="buttonUpdateUpdate" onClick={handleCreateOrUpdateMedicalRecord}>Create/Update Medical Record</button>
      <ToastContainer />

    </div>
    )}</>
  );
};

const MakeDoctorRequest = () => {
  const [userId, setUserId] = useState('');

  const [userRole, setUserRole] = useState('');
  
    useEffect(() => {
      axios.get('http://127.0.0.1:3500/user/ownUser')
        .then((response) => {
          setUserRole(response.data.user.role);
        })
        .catch((error) => {
          console.error('Error fetching user role:', error);
        });
    }, []);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://127.0.0.1:3500/auth/make-doctor', { userId });
      toast.success('User\'s role updated to doctor');
    } catch (error) {
      console.error('Error updating user\'s role:', error);
      toast.error('Error updating user\'s role');

    }
  };

  return (
    <>
    {userRole === 'admin' && (
      <div className="containerUpdate">
        <h2 className="labelUpdate">Make User a Doctor</h2>
        <form onSubmit={handleSubmit}>
          <label className="labelUpdate">
            User ID:
            <input
              className="textInputUpdate"
              type="text"
              value={userId}
              onChange={handleUserIdChange}
              placeholder="Enter User ID"
            />
          </label>
          <button className="buttonUpdateUpdate" type="submit">Make Doctor</button>
        </form>
        <ToastContainer />
      </div>
    )}
  </>
  );
};

const AdminPage = () => {
  return (
    <>
    <Navbar/>

    <AllDoctorAppointments/>

    <DoctorProfileImageUpload/>

    <SpecialtyUpdateForm/>

    <BioUpdateForm/>

    <UpdateOfficeHours/>

    <CreateOrUpdateMedicalRecord/>

    <UpdatePassword/>

    <MakeDoctorRequest/>

    <div className="containerUpdate">
    <h2 style={{padding:"10px"}} className="labelUpdate">Check all users</h2>
    <button
  style={{ textAlign: "center" }}
  className="buttonUpdateUpdate"
  onClick={() => { window.location.href = "/usersList"; }}
>
  Go to all Users
</button>
    </div>
    <Footer/>
    </>
  );
}

export default AdminPage;
