import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();
dotenv.config();

async function getEmployeeFromDB(employeeId: number) {
    const employee = await prisma.employee.findUnique({
        where: { id: employeeId }
    });
    return employee;
}

router.get('/', async (req, res) => {
    const employees = await prisma.employee.findMany();
    const employeesWithoutImage = employees.map(employee => {
        return {
            id: employee.id,
            email: employee.email,
            name: employee.name,
            surname: employee.surname,
            birthdate: employee.birthdate,
            lastLogin: employee.lastLogin,
            work: employee.work
        }
    });
    res.send(employeesWithoutImage);
});

router.get('/:id', async (req, res) => {
    const employeeId = req.params.id;
    const employee = await getEmployeeFromDB(parseInt(employeeId));
    if (employee === null) {
        res.status(404).send("Employee not found");
        return;
    }
    const employeeWithoutImage = {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        surname: employee.surname,
        birthdate: employee.birthdate,
        gender: employee.gender,
        work: employee.work
    }
    res.send(employeeWithoutImage);
});

router.get('/:id/image', async (req, res) => {
    const employeeId = req.params.id;
    const employee = await getEmployeeFromDB(parseInt(employeeId));
    if (employee === null) {
        res.status(404).send("Employee not found");
        return;
    }
    if (employee.image === null) {
        res.status(404).send("Employee image not found");
        return;
    }
    res.status(200).type('image/png').send(employee.image);
});

export default router;
