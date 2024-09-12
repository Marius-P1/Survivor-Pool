import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
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

router.get('/ismanager', authMiddleware, async (req, res) => {
    try {
        const employeeId = res.locals.employeeId;
        if (employeeId === null) {
            res.status(200).send(false);
            return;
        }
        const employee = await prisma.employee.findUnique({
            where: {
                id: employeeId
            }
        });
        if (employee === null) {
            res.status(200).send(false);
            return;
        }
        if (employee.role === 'MANAGER') {
            res.status(200).send(true);
            return;
        }
        res.status(200).send(false);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export default router;
