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

    if (!moment(appointmentDate).isValid()) {
      return res.status(400).json({ message: "Invalid appointment date format" });
    }

    const existingAppointment = await Appointment.findOne({ doctor: doctorId, appointmentDate });

    if (existingAppointment) {
      return res.status(409).json({ message: "Appointment slot already booked" });
    }

    const dayOfWeek = moment(appointmentDate).format('ddd').toLowerCase();
    const selectedTime = moment(appointmentDate).format('HH:mm');

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
      return res.status(400).json({ message: `Dr. ${doctor.fullname} is not available at the selected time. Please check doctor office hour at Dr. ${doctor.fullname}'s Profile` });
    }
    const selectedAppointmentTime = moment(appointmentDate);

    const existingAppointmentWithin1Hour = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: {
        $gte: selectedAppointmentTime.clone().subtract(1, 'hour').toDate(),
        $lt: selectedAppointmentTime.clone().add(1, 'hour').toDate(),
      },
    });

    if (existingAppointmentWithin1Hour) {
      return res.status(400).json({ message: 'Another appointment is already booked within the next 1 hour.' });
    }

    const appointmentData = {
      time: selectedTime,
      date: moment(appointmentDate).format('YYYY-MM-DD'),
      user: patientId,
      doctor: doctorId

    };

    const appointment = await Appointment.create(appointmentData);

    return res.status(201).json({ message: "Appointment booked successfully", data: appointment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during the booking process, Please try again later." });
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
