import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ProfileStyles.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({
  userId,
}) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newDateOfBirth, setNewDateOfBirth] = useState(new Date());
  const [newAllergies, setNewAllergies] = useState('');
  const [newMedicalHistory, setNewMedicalHistory] = useState('');
  const [newCriticalConditions, setNewCriticalConditions] = useState('');
  const [medicalRecords, setMedicalRecords] = useState(null);
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newMedications, setNewMedications] = useState([]);
  const [newLabReports, setNewLabReports] = useState([]);
  const [newPrescriptions, setNewPrescriptions] = useState([]);
  const [newAdditionalNotes, setNewAdditionalNotes] = useState('');
  const [showUpdateDateOfBirthModal, setShowUpdateDateOfBirthModal] = useState(false);
  const [newDateOfBirthInput, setNewDateOfBirthInput] = useState('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.patch(`http://127.0.0.1:3500/auth/updatePassword`, {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      
      setMessage(response.data.message);
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login'); 
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Something went wrong. Please try again later.');
      }
    }
  };
  const handleUpdatePasswordClick = () => {
    setShowChangePasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowChangePasswordModal(false);
  };
  const handleAllergiesChange = (event) => {
    setNewAllergies(event.target.value);
  };

  const handleMedicalHistoryChange = (event) => {
    setNewMedicalHistory(event.target.value);
  };

  const handleCriticalConditionsChange = (event) => {
    setNewCriticalConditions(event.target.value);
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3500/medical-records/getAUser/${userId}`);
      setMedicalRecords(response.data.medicalRecords[0]);
      setNewDiagnosis(response.data.medicalRecords[0].diagnosis);
      setNewMedications(response.data.medicalRecords[0].medications);
      setNewLabReports(response.data.medicalRecords[0].labReports);
      setNewPrescriptions(response.data.medicalRecords[0].prescriptions);
      setNewAdditionalNotes(response.data.medicalRecords[0].additionalNotes);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleUpdateDateOfBirth = () => {
    setNewDateOfBirth(newDateOfBirthInput);
    setShowUpdateDateOfBirthModal(false);
    notifySuccess('Date of Birth updated successfully');
  };

  const handleUpdateSurveys = () => {
    if (!newAllergies || !newMedicalHistory) {
      notifyError('Allergies and Medical History are required.');
      return;
    }

    const formattedDateOfBirth = newDateOfBirth ? new Date(newDateOfBirth).toISOString().split('T')[0] : '';

    const updatedSurvey = {
      userId: userId,
      allergies: newAllergies,
      medicalHistory: newMedicalHistory,
      criticalConditions: newCriticalConditions,
      dateofbirth: formattedDateOfBirth,
    };

    axios.post('http://127.0.0.1:3500/survey/submit', updatedSurvey)
      .then(response => {
        console.log('Survey updated successfully:', response.data);
        setNewDateOfBirth(response.data.dateofbirth);
        setNewAllergies(response.data.allergies);
        setNewMedicalHistory(response.data.medicalHistory);
        setNewCriticalConditions(response.data.criticalConditions);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating survey:', error);
        notifyError('Error updating surveys');
      });
  };

  useEffect(() => {
    const fetchUserSurvey = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3500/survey/get/${userId}`);
        setNewDateOfBirth(response.data.dateofbirth);
        setNewAllergies(response.data.allergies);
        setNewMedicalHistory(response.data.medicalHistory);
        setNewCriticalConditions(response.data.criticalConditions);
      } catch (error) {
        console.error('Error fetching user survey:', error);
      }
    };

    fetchUserSurvey();
  }, [userId]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:3500/user/getUser/${userId}`)
      .then(response => {
        const { fullname, email } = response.data.user;
        setFullName(fullname);
        setEmail(email);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });

    fetchMedicalRecords();
  }, [userId]);

  const handleUpdateDateOfBirthClick = () => {
    setShowUpdateDateOfBirthModal(true);
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <label style={{marginTop:"10px"}}>Full Name:</label>
        <span>{`${fullName}`}</span><span style={{color:"gray"}}> {`(${userId})`}</span>
      </div>
      <div className="profile-info">
        <label>Email:</label>
        <span>{email}</span>
      </div>
      <div className="profile-info">
        <label>Date of Birth:</label>
        <span>{newDateOfBirth ? new Date(newDateOfBirth).toISOString().split('T')[0] : ''}</span>
        <button style={{marginLeft:"5px"}} className="profile-a" onClick={handleUpdateDateOfBirthClick}>Change</button>
      </div>
      {showUpdateDateOfBirthModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowUpdateDateOfBirthModal(false)}>
              &times;
            </span>
            <div>
              <label>New Date of Birth: <span style={{color:"gray"}}>Press update survery when done </span></label>
              <input
                type="date"
                value={newDateOfBirthInput}
                onChange={(e) => setNewDateOfBirthInput(e.target.value)}
              />
            </div>
            <button className="profile-a" onClick={handleUpdateDateOfBirth}>Set</button>
          </div>
        </div>
      )}
      <div className="profile-info">
        <label>Allergies:</label>
        <textarea value={newAllergies || ''} onChange={handleAllergiesChange} />
      </div>
      <div className="profile-info">
        <label>Medical History:</label>
        <textarea value={newMedicalHistory || ''} onChange={handleMedicalHistoryChange} />
      </div>
      <div className="profile-info">
        <label>Critical Conditions:</label>
        <textarea value={newCriticalConditions || ''} onChange={handleCriticalConditionsChange} />
      </div>
      <button className="profile-a" onClick={handleUpdateSurveys}>Update Survey</button>
      <div className="profile-info" style={{marginTop:"10px",flexDirection:"column",display:"flex",  justifyContent:"center",alignItems:"center"}}>
        <h3 style={{marginLeft:"-60px",fontSize: '24px'}}>Medical Records</h3>
        {medicalRecords ? (
          <ul>
            <li key={medicalRecords._id}>
              <strong style={{fontSize: '24px'}}>Diagnosis: {newDiagnosis || 'N/A'}</strong> <br />
              <strong style={{fontSize: '24px'}}>Medications: {newMedications || 'N/A'} </strong><br />
              <strong style={{fontSize: '24px'}}>Lab Reports: {newLabReports || 'N/A'}</strong><br />
              <strong style={{fontSize: '24px'}}>Prescriptions: {newPrescriptions || 'N/A'}</strong><br />
              <strong style={{fontSize: '24px'}}>Additional Notes: {newAdditionalNotes || 'N/A'}</strong><br />
            </li>
          </ul>
        ) : (
          <p>No medical records found.</p>
        )}
      </div>
      <div className="profile-info">
        <button className="profile-a" onClick={handleUpdatePasswordClick}>Change Password</button>
      </div>
      
      {showChangePasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleClosePasswordModal}>&times;</span>
            <form onSubmit={handleSubmitPassword}>
              <div>
                <input
                  style={{margin:"3px"}}
                  id="oldPassword"
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  style={{margin:"3px"}}
                  id="password"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  style={{margin:"3px"}}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="profile-a">Update Password</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
