import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();
const authMiddleware = require("../middleware/auth");
const managerAuthMiddleware = require("../middleware/managerAuth");
dotenv.config();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const tips = await prisma.tips.findMany();
        res.send(tips);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.params.id === null) {
            res.status(400).send('ID missing');
            return;
        }
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).send('ID must be a number');
            return
        }
        const id = parseInt(req.params.id);
        const tip = await prisma.tips.findUnique({
            where: {
                id: id
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

router.post('/', managerAuthMiddleware, async (req, res) => {
    try {
        if (!req.body.title || !req.body.tip) {
            res.status(400).send('Title and tip are required');
            return;
        }
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

router.put('/:id', managerAuthMiddleware, async (req, res) => {
    try {
        if (req.params.id === null) {
            res.status(400).send('ID missing');
            return;
        }
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).send('ID must be a number');
            return
        }
        if (!req.body.title || !req.body.tip) {
            res.status(400).send('Title and tip are required');
            return;
        }
        const id = parseInt(req.params.id);
        const { newTitle, newTip } = req.body;
        const updatedTip = await prisma.tips.update({
            where: {
                id: id
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

router.delete('/:id', managerAuthMiddleware, async (req, res) => {
    try {
        if (req.params.id === null) {
            res.status(400).send('ID missing');
            return;
        }
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).send('ID must be a number');
            return
        }
        const id = parseInt(req.params.id);
        const deletedTip = await prisma.tips.delete({
            where: {
                id: id
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
