const Appointment = require('../models/appointmentModel.js');
const User = require('../models/userModel.js');
const moment = require('moment');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.body;
    const patientId = req.user._id;

    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or patient not found" });
    }

    if (!moment(appointmentDate, 'YYYY-MM-DDTHH:mm').isValid()) {
      return res.status(400).json({ message: "Invalid appointment date format" });
    }

    const selectedAppointmentTime = moment(appointmentDate);

    if (selectedAppointmentTime.isBefore(moment(), 'day')) {
      return res.status(400).json({ message: "Cannot book appointments for past days" });
    }

    const maxFutureDate = moment().add(2, 'months');
    if (selectedAppointmentTime.isAfter(maxFutureDate, 'day')) {
      return res.status(400).json({ message: "Cannot book appointments too far in the future" });
    }

    const dayOfWeek = selectedAppointmentTime.format('ddd').toLowerCase();
    const selectedTime = selectedAppointmentTime.format('HH:mm');
    const expiryDate = moment(selectedAppointmentTime).add(1, 'hour');
    let isAvailable = false;

    for (const officeHour of doctor.officeHours) {
      if (
        officeHour.day === dayOfWeek &&
        moment(selectedTime, 'HH:mm').isBetween(
          moment(officeHour.startTime, 'HH:mm'),
          moment(officeHour.endTime, 'HH:mm'),
          null,
          '[]'
        )
      ) {
        isAvailable = true;
        break;
      }
    }

    if (!isAvailable) {
      return res.status(400).json({ message: `Dr. ${doctor.fullname} is not available at the selected time. Please check doctor's office hours.` });
    }

    const existingAppointmentSameDoctor = await Appointment.findOne({
      doctor: doctorId,
      user: patientId,
    });

    if (existingAppointmentSameDoctor) {
      return res.status(400).json({ message: 'You already have an appointment with this doctor.' });
    }
    const existingAppointmentWithin1Hour = await Appointment.findOne({
      doctor: doctorId,
      date: selectedAppointmentTime.format('YYYY-MM-DD'),
      time: {
        $gte: selectedAppointmentTime.clone().subtract(1, 'hour').format('HH:mm'),
        $lt: selectedAppointmentTime.clone().add(1, 'hour').format('HH:mm'),
      },
    });

    if (existingAppointmentWithin1Hour) {
      return res.status(400).json({ message: 'Another appointment is already booked within the next 1 hour.' });
    }

    const appointmentData = {
      time: selectedTime,
      date: selectedAppointmentTime.format('YYYY-MM-DD'),
      user: patientId,
      doctor: doctorId,
      expiry: expiryDate.toDate(),
    };

    const appointment = await Appointment.create(appointmentData);

    return res.status(201).json({ message: "Appointment booked successfully", data: appointment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong during the booking process. Please try again later." });
  }
};




exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const patientId = req.user._id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.deleteOne();

    return res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during the cancellation process, Please try again later." });
  }
};


exports.getAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({
      $or: [{ user: userId }, { doctor: userId }]
    });
    return res.status(200).json({ data: appointments });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong while fetching appointments." });
  }
};



