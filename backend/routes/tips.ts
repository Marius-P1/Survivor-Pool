import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();
dotenv.config();

router.get('/', async (req, res) => {
    try {
        const tips = await prisma.tips.findMany();
        res.send(tips);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export default router;
