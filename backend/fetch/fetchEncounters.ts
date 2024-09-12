import { PrismaClient } from '@prisma/client'
import { promisify } from 'util';
import dotenv from "dotenv";

const request = require('request')
const prisma = new PrismaClient()

dotenv.config();

const TEAMTOKEN = process.env.TEAMTOKEN;

const API_MAIL = process.env.API_MAIL;
const API_PASS = process.env.API_PASS;

async function createEncounter(id: number, customerId: number, date: string, rating: number, comment: string, source: string) {
    await prisma.enconters.create({
        data: {
            id: id,
            customer_id: customerId,
            date: date,
            rating: rating,
            comment: comment,
            source: source
        }
    });
}

async function getDetailsEncounter(id: number, token: string) {
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: process.env.API_URL + '/encounters/' + id,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });
        if (respons.status === 429) {
            console.log("Received 429 Too Many Requests, waiting before retrying...3 + id:" + id);
            await new Promise(r => setTimeout(r, 5000));
            return await getDetailsEncounter(id, token);
        }
        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from encounter id: ", id);
            return;
        }
        const encounter = JSON.parse(respons.body);
        await createEncounter(encounter.id, encounter.customer_id, encounter.date, encounter.rating, encounter.comment, encounter.source);
        return;
    }
    catch (error) {
        console.log("Error: ", error);
        return;
    }
}

async function checkIfEncountersIdExists(id: number) {
    const enconters = await prisma.enconters.findUnique({
        where: {
            id: id
        }
    });
    if (enconters === null) {
        return false;
    }
    return true;
}

module.exports = async function fetchEncounters(token: string) {
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: process.env.API_URL + '/encounters',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });
        if (respons.status === 429) {
            console.log("Received 429 Too Many Requests, waiting before retrying...5");
            await new Promise(r => setTimeout(r, 5000));
            return await fetchEncounters(token);
        }
        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from enconters");
            return;
        }
        const enconters = JSON.parse(respons.body);
        for (let i = 0; i < enconters.length; i++) {
            if (await checkIfEncountersIdExists(enconters[i].id)) {
                continue;
            }
            await getDetailsEncounter(enconters[i].id, token);
        }
        return;
    }
    catch (error) {
        console.log("Error: ", error);
    }
}
