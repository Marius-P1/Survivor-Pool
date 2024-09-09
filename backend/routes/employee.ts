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

async function customerIsInDB(constId: number) {
    const customer = await prisma.customers.findUnique({
        where: { id: constId }
    });
    return customer !== null;
}

async function getIdFromRequest(req: any) {
    return 1;
}

async function getEmployeeConstumerList(employee: any, res: any) {
    if (employee === null) {
        res.status(404).send("Employee not found");
        return null;
    }
    let customersDataList = [];
    for (let i = 0; i < employee.customerIds.length; i++) {
        const customer = await prisma.customers.findUnique({
            where: { id: employee.customerIds[i] }
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

//Employee's request for his customers list
router.get('/customerslist', async (req, res) => {
    const employee = await getEmployeeFromDB(await getIdFromRequest(req));
    await getEmployeeConstumerList(employee, res);
});

//Managers request for the customers list of one employee
router.get('/:id/customerslist', async (req, res) => {
    const employeeId = parseInt(req.params.id);
    const employee = await getEmployeeFromDB(employeeId);
    await getEmployeeConstumerList(employee, res);
});

router.put('/:id/customerslist/add/:idconst', async (req, res) => {
    const employeeId = parseInt(req.params.id);
    const constId = parseInt(req.params.idconst);
    const employee = await getEmployeeFromDB(employeeId);
    if (employee === null) {
        res.status(404).send("Employee not found");
        return;
    }
    if (!await customerIsInDB(constId)) {
        res.status(404).send("Customer not found");
        return;
    }
    if (employee.customerIds.includes(constId)) {
        res.status(404).send("Customer already in team");
        return;
    }
    const customersList = employee.customerIds;
    customersList.push(constId);
    await prisma.employee.update({
        where: { id: employeeId },
        data: { customerIds: { set: customersList } }
    });
    res.send("Customer added");
});

router.put('/:id/customerslist/remove/:idconst', async (req, res) => {
    const employeeId = parseInt(req.params.id);
    const customerId = parseInt(req.params.idconst);
    const employee = await getEmployeeFromDB(employeeId);
    if (employee === null) {
        res.status(404).send("Employee not found");
        return;
    }
    if (!await customerIsInDB(customerId)) {
        res.status(404).send("Customer not found");
        return;
    }
    const customersList = employee.customerIds;
    const index = customersList.indexOf(customerId);
    if (index > -1) {
        customersList.splice(index, 1);
        await prisma.employee.update({
            where: { id: employeeId },
            data: { customerIds: { set: customersList } }
        });
        res.send("Customer removed");
    } else {
        res.status(404).send("Customer not found");
    }
});

export default router;
