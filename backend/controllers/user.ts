import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import dotenv from "dotenv";

const request = require('request')
const prisma = new PrismaClient()

dotenv.config();


const TEAMTOKEN = process.env.TEAMTOKEN;

async function getEmployee(email: string) {
	const user = await prisma.credentials.findUnique({
		where: {
			email: email
		}
	});
	return user;
}

async function createCredentials(email: string, password: string) {
	await prisma.credentials.create({
		data: {
			email: email,
			password: password
		}
	});
}

async function getEmployeeAPI(email: string, password: string) : Promise<string | null> {
	const requestPromise = promisify(request);

	try {
		const respons = await requestPromise({
			url: process.env.API_URL + '/employees/login',
			method: 'POST',
			headers: {
				'accept': 'application/json',
				'X-Group-Authorization': TEAMTOKEN
			},
			body: "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"
		});

		if (respons.statusCode !== 200) {
			return null;
		}
		const tokenAPI = JSON.parse(respons.body)["access_token"];
		return tokenAPI;
	}
	catch (error) {
		console.log("Error: ", error);
		return null;
	}
}

async function createToken(email: string, token: string) {
	const validity = new Date();
	validity.setHours(validity.getHours() + 2);
	await prisma.token.create({
		data: {
			email: email,
			token: token,
			validUntil: validity
		}
	});
}

async function checkCredentials(email: string, password: string) {
	const user = await prisma.credentials.findUnique({
		where: {
			email: email
		}
	});
	if (user === null) {
		return false;
	}
	if (user.password !== password) {
		return false;
	}
	return true;
}

exports.login = (async (request: Request, response: Response) => {
	if (!request.query.email || !request.query.password)
		return response.status(400).send("Missing parameters");
	const email = request.query.email;
	const password = request.query.password;
    let isOldDBUser = false;

	const user = await getEmployee(email as string);
	let token = uuidv4();

	if (user === null) {
		await getEmployeeAPI(email as string, password as string).then(tokenAPI => {
			if (tokenAPI === null) {
				response.status(400).send("User not found");
				return;
			}
			token = tokenAPI;
		});
		await createCredentials(email as string, password as string);
        isOldDBUser = true;
	} else {
		if (!await checkCredentials(email as string, password as string)) {
			response.status(400).send("Wrong password");
			return;
		}
	}
	await createToken(email as string, token);
	await prisma.employee.update({
		where: { email: email as string },
		data: { lastLogin: new Date() }
	});
	response.status(200).json({ token });
	if (isOldDBUser) {
		console.log("User added to the database"); // TODO : Add the fetch of the db
	}
});
