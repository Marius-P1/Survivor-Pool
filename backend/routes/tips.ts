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
    const maxId = await prisma.tips.findFirst({
        select: {
            id: true
        },
        orderBy: {
            id: 'desc'
        }
    });
    const { title, tip } = req.body;
    const newTip = await prisma.tips.create({
        data: {
            id: maxId ? maxId.id + 1 : 1,
            title: title,
            tip: tip
        }
    });
    res.send(newTip);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { newTitle, newTip } = req.body;
    const updatedTip = await prisma.tips.update({
        where: {
            id: parseInt(id)
        },
        data: {
            title: newTitle,
            tip: newTip
        }
    });
    if (!updatedTip) {
        res.status(404).send('Tip not found');
        return;
    }
    res.send(updatedTip);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedTip = await prisma.tips.delete({
        where: {
            id: parseInt(id)
        }
    });
    if (!deletedTip) {
        res.status(404).send('Tip not found');
        return;
    }
    res.send('Tip ' + id + ' deleted');
});

export default router;