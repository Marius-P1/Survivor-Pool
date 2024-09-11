import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import employeeRouter from "./routes/employee";
import tipsRouter from "./routes/tips";
import eventRouter from "./routes/event";
import statRouter from "./routes/statistics";

dotenv.config();
const app = express();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;

const userController = require("./controllers/user");
const authMiddleware = require("./middleware/auth");
const fetchController = require("./fetch/fetch");
const customerController = require("./controllers/customers");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/employee", employeeRouter);
app.use("/events", eventRouter);
app.use("/tips", tipsRouter);
app.use("/statistics", statRouter);


app.post("/login", userController.login);

app.get("/", (request: Request, response: Response) => {
	response.status(200).send("Hello World");
});

app.get("/customers", customerController.getCustomers);
app.get("/customers/:id", customerController.getCustomer);
app.get("/customers/:id/image", customerController.getCustomerImage);
app.get("/customers/:id/clothes", customerController.getCustomerClothes);
app.get("/customers/:id/payments", customerController.getCustomerPayments);
app.get("/customers/:id/encounters", customerController.getCustomerEncounters);

// Example of a protected route (You can only access this route if you have a valid token)
// The authMiddleware function checks if the token is valid
app.get("/protected", authMiddleware, (request: Request, response: Response) => {
	response.status(200).send("Protected route");
});

app.listen(PORT, () => {
	console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
	throw new Error(error.message);
});

// Fetch data from API on server start
fetchController();
// And then fetch data from API every X minutes (set in a .env file)
// setInterval(fetchController, parseInt(process.env.FETCH_INTERVAL as string) * 60000);
