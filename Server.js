const express = require("express");
const app = express();
const database = require("./Database/Database");
const dashboardRoute = require("./Routes/DashboardRoute");
const borrowersRoute = require("./Routes/BorrowersRoute");
const itemsRoute = require("./Routes/ItemsRoute");
const stockdetailsRoute = require("./Routes/StockDetailsRoute");
const loginRoute = require("./Routes/LoginRoute");
const overviewRoute = require("./Routes/OverviewRoute");
const profileRoute = require("./Routes/ProfileRoute");
const usersRoute = require("./Routes/UsersRoute");
const forgotRoute = require("./Routes/ForgotRoute");
const otpRoute = require("./Routes/OTPRoute");
const newpasswordRoute = require("./Routes/NewPasswordRoute");
const auditlogRoute = require("./Routes/AuditLogRoute");
const inventoryRoute= require("./Routes/InventoryRoute");
const session = require('express-session');

app.use(session({
  secret: 'BASED-FOR-SECURITY', // Replace with your own secret key
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("Public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/Views");

app.use("/", dashboardRoute);
app.use("/", borrowersRoute);
app.use("/", itemsRoute);
app.use("/", stockdetailsRoute);
app.use("/", loginRoute);
app.use("/", overviewRoute);
app.use("/", profileRoute);
app.use("/", usersRoute);
app.use("/", forgotRoute);
app.use("/", otpRoute);
app.use("/", newpasswordRoute);
app.use("/", auditlogRoute);
app.use("/", inventoryRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
