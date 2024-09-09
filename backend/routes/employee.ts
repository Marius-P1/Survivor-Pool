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

async function custumerIsInDB(constId: number) {
    const customer = await prisma.customers.findUnique({
        where: { id: constId }
    });
    return customer !== null;
}

async function getIdFromRequest(req: any) {
    return 1;
}

router.get('/', async (req, res) => {
    const employees = await prisma.employee.findMany();
    const employeesWithoutImage = employees.map(employee => {
        return {
            id: employee.id,
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
        lastLogin: employee.lastLogin,
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

router.get('/customersList', async (req, res) => {
    const employee = await getEmployeeFromDB(await getIdFromRequest(req));
    if (employee === null) {
        res.status(404).send("Employee not found");
        return;
    }
    let customersDataList = [];
    for (let i = 0; i < employee.constumerIds.length; i++) {
        const customer = await prisma.customers.findUnique({
            where: { id: employee.constumerIds[i] }
        });
        if (customer === null) {
            res.status(404).send("Customer not found");
            return;
        }
        let customerData = {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            surname: customer.surname,
            birthdate: customer.birthdate,
            phone: customer.phone_number,
            address: customer.address
        }
        customersDataList.push(customerData);
    }
    res.send(customersDataList);
});

router.put('customersList/add/:idconst', async (req, res) => {
    const employeeId = await getIdFromRequest(req);
    const constId = parseInt(req.params.idconst);
    const employee = await getEmployeeFromDB(employeeId);
    if (employee === null) {
        res.status(404).send("Employee not found");
        return;
    }
    if (!await custumerIsInDB(constId)) {
        res.status(404).send("Customer not found");
        return;
    }
    if (employee.constumerIds.includes(constId)) {
        res.status(404).send("Customer already in team");
        return;
    }
    const constumersList = employee.constumerIds;
    constumersList.push(constId);
    await prisma.employee.update({
        where: { id: employeeId },
        data: { constumerIds: { set: constumersList } }
    });
    res.send("Customer added");
});

router.put('/customersList/remove/:idconst', async (req, res) => {
    const employeeId = await getIdFromRequest(req);
    const constumerId = parseInt(req.params.idconst);
    const employee = await getEmployeeFromDB(employeeId);
    if (employee === null) {
        res.status(404).send("Employee not found");
        return;
    }
    if (!await custumerIsInDB(constumerId)) {
        res.status(404).send("Customer not found");
        return;
    }
    const constumersList = employee.constumerIds;
    const index = constumersList.indexOf(constumerId);
    if (index > -1) {
        constumersList.splice(index, 1);
        await prisma.employee.update({
            where: { id: employeeId },
            data: { constumerIds: { set: constumersList } }
        });
        res.send("Customer removed");
    } else {
        res.status(404).send("Customer not found");
    }
});

export default router;
