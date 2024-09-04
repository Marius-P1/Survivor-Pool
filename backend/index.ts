import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const request = require('request')
const prisma = new PrismaClient()

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/", (request: Request, response: Response) => {
	response.status(200).send("Hello World");
});

app.listen(PORT, () => {
	console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
	throw new Error(error.message);
});
