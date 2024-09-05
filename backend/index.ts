import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

const userController = require("./controllers/user");
const authMiddleware = require("./middleware/auth");


app.post("/login", userController.login);

app.get("/", (request: Request, response: Response) => {
	response.status(200).send("Hello World");
});


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
