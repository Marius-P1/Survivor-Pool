import { PrismaClient } from '@prisma/client'
import { promisify } from 'util';
import dotenv from "dotenv";

const request = require('request')
const prisma = new PrismaClient()

dotenv.config();

const TEAMTOKEN = process.env.TEAMTOKEN;

const API_MAIL = process.env.API_MAIL;
const API_PASS = process.env.API_PASS;

const fetchClothes = require("./fetchClothes");
const fetchTips = require("./fetchTips");
const fetchEncounters = require("./fetchEncounters");
const fetchEvents = require("./fetchEvents");
const fetchCustomers = require("./fetchCustomers");

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
			console.log("Error: Could not get token from API");
			console.log("Status code: ", respons.statusCode);
			console.log("Body: ", respons.body);
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


module.exports = async () => {
    console.log("Fetching data from API");
    const token = await getEmployeeAPI(API_MAIL as string, API_PASS as string);

    if (token === null) {
        console.log("Error: Could not fetch data from API");
        console.log("Please check your API credentials");
        return;
    }
    console.log("Token: ", token);
    await fetchClothes(token, 1, true);
    await fetchTips(token);
    await fetchEncounters(token);
    await fetchEvents(token);
    await fetchCustomers(token);
    console.log("Data fetched from API");
}
