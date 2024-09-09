import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();
dotenv.config();

async function getEventFromDB(eventId: number) {
    const event = await prisma.event.findUnique({
        where: { id: eventId }
    });
    return event;
}

router.get('/', async (req, res) => {
    const events = await prisma.event.findMany();
    res.send(events);
});

router.get('/:id', async (req, res) => {
    const event = await getEventFromDB(parseInt(req.params.id));
    if (event === null) {
        res.status(404).send("Event not found");
        return;
    }
    res.send(event);
});

router.post('/', async (req, res) => {
    const { name, date, max_participants, location_x, location_y,
    type, employee_id, location_name, duration } = req.body;
    //const employee id is get from the token
    await prisma.event.create({
        data: {
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
});

router.put('/:id', async (req, res) => {
    const event = await getEventFromDB(parseInt(req.params.id));
    if (event === null) {
        res.status(404).send("Event not found");
        return;
    }
    const { name, date, max_participants, location_x, location_y,
        type, location_name, duration } = req.body;
    await prisma.event.update({
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
});

router.delete('/:id', async (req, res) => {
    const event = await getEventFromDB(parseInt(req.params.id));
    if (event === null) {
        res.status(404).send("Event not found");
        return;
    }
    await prisma.event.delete({
        where: { id: parseInt(req.params.id) }
    });
    res.send("Event deleted");
});

export default router;