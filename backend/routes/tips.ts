import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();
dotenv.config();

router.get('/', async (req, res) => {
    const tips = await prisma.tips.findMany();
    res.send(tips);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const tip = await prisma.tips.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (!tip) {
        res.status(404).send('Tip not found');
        return;
    }
    res.send(tip);
});

router.post('/', async (req, res) => {
    const { title, description } = req.body;
    const newId = await prisma.tips.count();
    const tip = await prisma.tips.create({
        data: {
            id: newId,
            title: title,
            createdAt: new Date(),
            updatedAt: new Date(),
            tip: description
        }
    });
    res.send(tip);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const tip = await prisma.tips.update({
        where: {
            id: parseInt(id)
        },
        data: {
            title: title,
            updatedAt: new Date(),
            tip: description
        }
    });
    if (!tip) {
        res.status(404).send('Tip not found');
        return;
    }
    res.send(tip);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const tip = await prisma.tips.delete({
        where: {
            id: parseInt(id)
        }
    });
    if (!tip) {
        res.status(404).send('Tip not found');
        return;
    }
    res.send('Tip ' + id + ' deleted');
});

export default router;