import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();
dotenv.config();

router.get('/isvalid', async (req, res) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).send('Unauthorized');
            return;
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            res.status(401).send('Unauthorized');
            return;
        }
        const user = await prisma.token.findUnique({
            where: {
                token: token
            }
        });
        if (user === null) {
            res.status(200).send(false);
            return;
        }
        if (user !== null && user.validUntil < new Date()) {
            res.status(200).send(false);
            return;
        }
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export default router;
