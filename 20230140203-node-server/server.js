const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");
const path = require("path");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes=require('./routes/auth');
const dashboardRouter = require("./routes/dashboard");
const reportsRouter = require("./routes/reports");

const db = require("./models");

app.use(express.static(path.join(__dirname, "public")));
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.get("/", (req, res) => {
  res.send("Home Page for API");vs
});
const ruteBuku = require("./routes/books");

app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRouter);
app.use("/api/reports", reportsRouter);

const iotRoutes = require('./routes/iot');

app.use(express.json());
app.use("/api/iot", iotRoutes);


app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
