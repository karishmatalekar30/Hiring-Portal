require("dotenv").config();
const express = require("express");     
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Mongoose Schema and Model
const applicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  position: String,
  education: String,
  collegeName: String,
  specialization: String,
  cgpa: String,
  graduationYear: String,
  skills: String,
  accessToPersonalComputer: String,
  preferredStartDate: String,
  resume: String, // Store file path instead of Base64
});

const Application = mongoose.model("Application", applicationSchema);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/", // Save resumes in an 'uploads' folder
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ dest: "uploads/" });

// API Route to handle job applications with file upload
app.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    console.log("Form Data Received:", req.body); // Debugging log
    console.log("Uploaded File:", req.file); // Debugging log

    if (!req.file) {
      return res.status(400).json({ message: "Resume upload failed!" });
    }

    const newApplication = new Application({
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      position: req.body.position,
      education: req.body.education,
      collegeName: req.body.collegeName,
      specialization: req.body.specialization,
      cgpa: req.body.cgpa,
      graduationYear: req.body.graduationYear,
      skills: req.body.skills,
      accessToPersonalComputer: req.body.accessToPersonalComputer,
      preferredStartDate: req.body.preferredStartDate,
      resume: `${process.env.BASE_URL}/uploads/${req.file.filename}`, // Store full URL

    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("❌ Error saving application:", error);
    res.status(500).json({ message: "Error submitting application." });
  }
});


// Fetch all applications
app.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find();
    
    // Modify response to include full resume URL
    res.status(200).json(
      applications.map((app) => ({
        ...app._doc, // Spread the document object properly
        resume: app.resume ? `http://localhost:5000/${app.resume}` : "",
      }))
    );
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Error retrieving applications." });
  }
});


// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Start Server
app.listen(5000, () => {
  console.log(`✅ Server running on port 5000`);
});
