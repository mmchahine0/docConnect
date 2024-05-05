const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3500;
require('dotenv').config();

const authRouter = require('./routes/authroutes.js');
const utilRoutes = require('./routes/utilRoutes.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const medicalRecordsRoutes = require('./routes/medicalRecordsRoutes.js');
const surveyRoutes = require('./routes/surveyRoutes.js')
const doctorRoutes = require('./routes/doctorRoutes.js')
const UserRoutes = require('./routes/UserRoutes');

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:2500'],
  credentials: true
}));

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });


app.use("/auth", authRouter);
app.use("/util", utilRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/medical-records", medicalRecordsRoutes);
app.use("/survey", surveyRoutes)
app.use("/doctor", doctorRoutes)
app.use("/user", UserRoutes)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
