import { PrismaClient } from '@prisma/client'
import { promisify } from 'util';
import dotenv from "dotenv";

const request = require('request')
const prisma = new PrismaClient()

dotenv.config();

const TEAMTOKEN = process.env.TEAMTOKEN;

const API_MAIL = process.env.API_MAIL;
const API_PASS = process.env.API_PASS;

async function createEvents(id: number, name: string, date: string, maxParticipants: number, locationX: string, locationY: string, type: string, employee_id : number, location_name : string, duration : number) {
    await prisma.events.create({
        data: {
            id: id,
            name: name,
            date: date,
            max_participants: maxParticipants,
            location_x: locationX,
            location_y: locationY,
            type: type,
            employee_id: employee_id,
            location_name: location_name,
            duration: duration
        }
    });
}

async function getDetailsEvents(id: number, token: string) {
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: process.env.API_URL + '/events/' + id,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from events id: ", id);
            return;
        }
        const event = JSON.parse(respons.body);
        await createEvents(event.id, event.name, event.date, event.max_participants, event.location_x, event.location_y, event.type, event.employee_id, event.location_name, event.duration);
        return;
    }
    catch (error) {
        console.log("Error: ", error);
        return;
    }
}

async function checkIfEventsIdExists(id: number) {
    const events = await prisma.events.findUnique({
        where: {
            id: id
        }
    });
    if (events === null) {
        return false;
    }
    return true;
}

module.exports = async function fetchEvents(token: string) {
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: process.env.API_URL + '/events',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from events");
            return;
        }
        const events = JSON.parse(respons.body);
        for (let i = 0; i < events.length; i++) {
            if (await checkIfEventsIdExists(events[i].id)) {
                continue;
            }
            await getDetailsEvents(events[i].id, token);
        }
        return;
    }
    catch (error) {
        console.log("Error: ", error);
    }
}
