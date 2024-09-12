import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();
const authMiddleware = require("../middleware/auth");
const managerAuthMiddleware = require("../middleware/managerAuth");
dotenv.config();

async function getEmployeeFromDB(employeeId: number) {
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId }
        });
        return employee;
    } catch (error) {
        console.error("Error fetching employee:", error);
        return null;
    }
}

async function customerIsInDB(constId: number) {
    try {
        const customer = await prisma.customers.findUnique({
            where: { id: constId }
        });
        return customer !== null;
    } catch (error) {
        console.error("Error fetching customer:", error);
        return false;
    }
}

async function getEmployeeConstumerList(employee: any, res: any) {
    if (employee === null) {
        res.status(404).send("Employee not found");
        return null;
    }
    let customersDataList = [];
    try {
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
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).send("Internal Server Error");
    }
}

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const employeeId = res.locals.employeeId;
        if (employeeId === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const employee = await getEmployeeFromDB(employeeId);
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
            lastLogin: employee.lastLogin
        }
        res.send(employeeWithoutImage);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/me/image', authMiddleware, async (req, res) => {
    try {
        const employeeId = res.locals.employeeId;
        if (employeeId === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const employee = await getEmployeeFromDB(employeeId);
        if (employee === null) {
            res.status(404).send("Employee not found");
            return;
        }
        if (employee.image === null) {
            res.status(404).send("Employee image not found");
            return;
        }
        res.status(200).type('image/png').send(employee.image);
    } catch (error) {
        console.error("Error fetching employee image:", error);
        res.status(500).send("Internal Server Error");
    }
});

// All managers request for info about employees
router.get('/', authMiddleware, async (req, res) => {
    try {
        const employeeId = res.locals.employeeId;
        if (employeeId === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const employee = await getEmployeeFromDB(employeeId);
        if (employee === null) {
            res.status(404).send("Employee not found");
            return;
        }
        if (employee.work !== "MANAGER") {
            const employeeData = await prisma.employee.findUnique({
                where: { id: employeeId }
            });
            if (employeeData === null) {
                res.status(404).send("Employee not found");
                return;
            }
            const employeeWithoutImage = {
                id: employeeData.id,
                email: employeeData.email,
                name: employeeData.name,
                surname: employeeData.surname,
                birthdate: employeeData.birthdate,
                lastLogin: employeeData.lastLogin,
                work: employeeData.work
            }
            res.send(employeeWithoutImage);
            return;
        }
        const employees = await prisma.employee.findMany();
        if (employees === null) {
            res.status(404).send("Employees not found");
            return;
        }
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
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:id', managerAuthMiddleware, async (req, res) => {
    try {
        if (req.params.id === null || isNaN(parseInt(req.params.id))) {
            res.status(404).send("Wrong employee id");
            return;
        }
        const employeeId = parseInt(req.params.id);
        const employee = await getEmployeeFromDB(employeeId);
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
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:id/image', managerAuthMiddleware, async (req, res) => {
    try {
        if (req.params.id === null || isNaN(parseInt(req.params.id))) {
            res.status(404).send("Wrong employee id");
            return;
        }
        const employeeId = parseInt(req.params.id);
        const employee = await getEmployeeFromDB(employeeId);
        if (employee === null) {
            res.status(404).send("Employee not found");
            return;
        }
        if (employee.image === null) {
            res.status(404).send("Employee image not found");
            return;
        }
        res.status(200).type('image/png').send(employee.image);
    } catch (error) {
        console.error("Error fetching employee image:", error);
        res.status(500).send("Internal Server Error");
    }
});

//Employee's request for his customers list
router.get('/customerslist', authMiddleware, async (req, res) => {
    try {
        const employeeId = res.locals.employeeId;
        if (employeeId === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const employee = await getEmployeeFromDB(employeeId);
        await getEmployeeConstumerList(employee, res);
    } catch (error) {
        console.error("Error fetching customers list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//Managers request for the customers list of one employee
router.get('/:id/customerslist', managerAuthMiddleware, async (req, res) => {
    try {
        if (req.params.id === null || isNaN(parseInt(req.params.id))) {
            res.status(404).send("Wrong employee id");
            return;
        }
        const employeeId = parseInt(req.params.id);
        const employee = await getEmployeeFromDB(employeeId);
        await getEmployeeConstumerList(employee, res);
    } catch (error) {
        console.error("Error fetching customers list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/:id/customerslist/add/:idconst', managerAuthMiddleware, async (req, res) => {
    try {
        if (req.params.id === null || req.params.idconst === null) {
            res.status(404).send("Wrong employee id or customer id");
            return;
        }
        const employeeId = parseInt(req.params.id);
        const constId = parseInt(req.params.idconst);
        if (isNaN(employeeId) || isNaN(constId)) {
            res.status(404).send("Employee not found");
            return;
        }
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
    } catch (error) {
        console.error("Error adding customer:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/:id/customerslist/remove/:idconst', managerAuthMiddleware, async (req, res) => {
    try {
        if (req.params.id === null || req.params.idconst === null) {
            res.status(404).send("Wrong employee id or customer id");
            return;
        }
        const employeeId = parseInt(req.params.id);
        const constId = parseInt(req.params.idconst);
        if (isNaN(employeeId) || isNaN(constId)) {
            res.status(404).send("Employee not found");
            return;
        }
        const employee = await getEmployeeFromDB(employeeId);
        if (employee === null) {
            res.status(404).send("Employee not found");
            return;
        }
        if (!await customerIsInDB(constId)) {
            res.status(404).send("Customer not found");
            return;
        }
        const customersList = employee.customerIds;
        const index = customersList.indexOf(constId);
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
    } catch (error) {
        console.error("Error removing customer:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/me/stats', authMiddleware, async (req, res) => {
    try {
        const employeeId = res.locals.employeeId;
        if (employeeId === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const employee = await getEmployeeFromDB(employeeId);
        if (employee === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const customerIdsList = employee.customerIds;
        let allStats = [];
        for (let i = 0; i < customerIdsList.length; i++) {
            let paymentStatsByConstId = await prisma.payments.findMany({
                where: { customer_id: customerIdsList[i] }
            });
            let stats = paymentStatsByConstId.map(payment => ({
                amount: payment.amount,
                date: payment.date,
                month: payment.date.split('-')[1]
            }));
            console.log("Payment stats by month:" + paymentStatsByConstId);
            allStats.push(stats);
        }
        console.log("Stats:", allStats.flat());
        res.send(allStats.flat());
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:id/stats', managerAuthMiddleware, async (req, res) => {
    try {
        if (req.params.id === null || isNaN(parseInt(req.params.id))) {
            res.status(404).send("Wrong employee id");
            return;
        }
        const employeeId = parseInt(req.params.id);
        const employee = await getEmployeeFromDB(employeeId);
        if (employee === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const customerIdsList = employee.customerIds;
        console.log(customerIdsList);
        let allStats = [];
        for (let i = 0; i < customerIdsList.length; i++) {
            let paymentStatsByConstId = await prisma.payments.findMany({
                where: { customer_id: customerIdsList[i] }
            });
            let stats = paymentStatsByConstId.map(payment => ({
                amount: payment.amount,
                date: payment.date,
                month: payment.date.split('-')[1]
            }));
            console.log("Payment stats by month:" + paymentStatsByConstId);
            allStats.push(stats);
        }
        console.log("Stats:", allStats.flat());
        res.send(allStats.flat());
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/me/encounter/', authMiddleware, async (req, res) => {
    try {
        const employeeId = res.locals.employeeId;
        if (employeeId === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const employee = await getEmployeeFromDB(employeeId);
        if (employee === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const customerIdsList = employee.customerIds;
        let encounterNbr = 0;
        for (let i = 0; i < customerIdsList.length; i++) {
            let constId = customerIdsList[i];
            let allEncountersByConstId = await prisma.enconters.findMany({
                where: { customer_id: constId }
            });
            encounterNbr += allEncountersByConstId.length;
        }
        res.send({ encounters: encounterNbr });
    } catch (error) {
        console.error("Error fetching encounters:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:id/encounter/', managerAuthMiddleware, async (req, res) => {
    try {
        if (req.params.id === null || isNaN(parseInt(req.params.id))) {
            res.status(404).send("Wrong employee id");
            return;
        }
        const employeeId = parseInt(req.params.id);
        const employee = await getEmployeeFromDB(employeeId);
        if (employee === null) {
            res.status(404).send("Employee not found");
            return;
        }
        const customerIdsList = employee.customerIds;
        let encounterNbr = 0;
        for (let i = 0; i < customerIdsList.length; i++) {
            let constId = customerIdsList[i];
            let allEncountersByConstId = await prisma.enconters.findMany({
                where: { customer_id: constId }
            });
            encounterNbr += allEncountersByConstId.length;
        }
        res.send({ encounters: encounterNbr });
    } catch (error) {
        console.error("Error fetching encounters:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
