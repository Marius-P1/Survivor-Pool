import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';
import { checkIfTokenIsValid, isManager, getEmployeeIdFromToken, getEmployeeFromToken } from '../controllers/tokenCheck';

const router = express.Router();
const prisma = new PrismaClient();
dotenv.config();

async function getEventFromDB(eventId: number) {
    try {
        const event = await prisma.events.findUnique({
            where: { id: eventId }
        });
        return event;
    } catch (error) {
        console.error("Error fetching event:", error);
        return null;
    }
}

router.get('/', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).send("Authorization header missing");
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!await checkIfTokenIsValid(token)) {
            res.status(401).send("Invalid token");
            return;
        }
        const employee = await getEmployeeFromToken(token);
        if (employee === null) {
            res.status(401).send("Employee not found");
            return;
        }
        if (employee.role == "MANAGER") {
            const events = await prisma.events.findMany();
            res.send(events);
            return;
        } else {
            const events = await prisma.events.findMany({
                where: {
                    employee_id: employee.id
                }
            });
            res.send(events);
            return;
        }
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).send("Authorization header missing");
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!await isManager(token)) {
            res.status(401).send("Unauthorized");
            return
        }
        if (req.params.id === null) {
            res.status(400).send("Missing parameter");
            return;
        }
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const event = await getEventFromDB(parseInt(req.params.id));
        if (event === null) {
            res.status(404).send("Event not found");
            return;
        }
        res.send(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send("Authorization header missing");
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!await isManager(token)) {
        res.status(401).send("Unauthorized");
        return
    }
    if (req.body === null) {
        res.status(400).send("Missing body");
        return;
    } else if (!req.body.name || !req.body.date || !req.body.max_participants || !req.body.location_x || !req.body.location_y ||
        !req.body.type || !req.body.employee_id || !req.body.location_name || !req.body.duration) {
        res.status(400).send("Missing parameters");
        return;
    }
    const { name, date, max_participants, location_x, location_y,
        type, employee_id, location_name, duration } = req.body;
    try {
        const maxId = await prisma.events.findFirst({
            select: {
                id: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        await prisma.events.create({
            data: {
                id: maxId ? maxId.id + 1 : 1,
                name: name,
                date: date,
                max_participants: max_participants,
                location_x: location_x,
                location_y: location_y,
                type: type,
                employee_id: employee_id,
                location_name: location_name,
                duration: duration
            }
        });
        res.send("Event created");
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).send("Authorization header missing");
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!await isManager(token)) {
            res.status(401).send("Unauthorized");
            return
        }
        if (req.body === null) {
            res.status(400).send("Missing body");
            return;
        } else if (!req.body.name || !req.body.date || !req.body.max_participants || !req.body.location_x || !req.body.location_y ||
            !req.body.type || !req.body.location_name || !req.body.duration) {
            res.status(400).send("Missing parameters");
            return;
        }
        if (req.params.id === null) {
            res.status(400).send("Missing parameter");
            return;
        }
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const event = await getEventFromDB(parseInt(req.params.id));
        if (event === null) {
            res.status(404).send("Event not found");
            return;
        }
        const { name, date, max_participants, location_x, location_y,
            type, location_name, duration } = req.body;
        await prisma.events.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name: name,
                date: date,
                max_participants: max_participants,
                location_x: location_x,
                location_y: location_y,
                type: type,
                location_name: location_name,
                duration: duration
            }
        });
        res.send("Event updated");
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).send("Authorization header missing");
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!await isManager(token)) {
            res.status(401).send("Unauthorized");
            return
        }
        if (req.params.id === null) {
            res.status(400).send("Missing parameter");
            return;
        }
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).send("Invalid ID");
            return;
        }
        const event = await getEventFromDB(parseInt(req.params.id));
        if (event === null) {
            res.status(404).send("Event not found");
            return;
        }
        await prisma.events.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.send("Event deleted");
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
