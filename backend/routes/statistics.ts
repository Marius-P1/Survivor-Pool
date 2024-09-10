import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';
import { checkIfTokenIsValid, isManager, getEmployeeIdFromToken } from '../controllers/tokenCheck';

const router = express.Router();
const prisma = new PrismaClient();
dotenv.config();

// Route to get the total number of customers
router.get('/totalcustomers', async (req, res) => {
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
        const totalCustomers = await prisma.customers.count();
        res.send({ totalCustomers });
    } catch (error) {
        console.error("Error fetching total customers:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to get the total revenue
router.get('/totalrevenue', async (req, res) => {
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
        const totalRevenue = await prisma.payments.aggregate({
            _sum: {
                amount: true
            }
        });
        res.send({ totalRevenue: totalRevenue._sum.amount });
    } catch (error) {
        console.error("Error fetching total revenue:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to get the number of events
router.get('/totalevents', async (req, res) => {
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
        const totalEvents = await prisma.events.count();
        res.send({ totalEvents });
    } catch (error) {
        console.error("Error fetching total events:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to get the average rating of encounters
router.get('/averagerating', async (req, res) => {
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
        const averageRating = await prisma.enconters.aggregate({
            _avg: {
                rating: true
            }
        });
        res.send({ averageRating: averageRating._avg.rating });
    } catch (error) {
        console.error("Error fetching average rating:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to get the total number of employees
router.get('/totalemployees', async (req, res) => {
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
        const totalEmployees = await prisma.employee.count();
        res.send({ totalEmployees });
    } catch (error) {
        console.error("Error fetching total employees:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to get the total number of encounters
router.get('/encountersbysource', async (req, res) => {
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
        const encounters = await prisma.enconters.groupBy({
            by: ['source'],
            _avg: {
                rating: true
            },
            _count: true,
            orderBy: {
                _avg: {
                    rating: 'desc'
                }
            }
        });
        const roundedEncounters = encounters.map(encounter => ({
            source: encounter.source,
            avgRating: encounter._avg.rating ? encounter._avg.rating.toFixed(2) : null,
            numberOfEncounters: encounter._count
        }));
        res.send(roundedEncounters);
    } catch (error) {
        console.error("Error fetching encounters by source:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to get the total number of encounters
router.get('/totalencounters', async (req, res) => {
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
        const totalEncounters = await prisma.enconters.count();
        res.send({ totalEncounters });
    } catch (error) {
        console.error("Error fetching total encounters:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
