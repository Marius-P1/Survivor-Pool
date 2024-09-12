import { ShortCustomersDTO, CustomerDTO } from "../dto/customersDTO";
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient()
const authMiddleware = require("../middleware/auth");
const managerAuthMiddleware = require("../middleware/managerAuth");
dotenv.config();

async function getCustomersDB() {
	const customers = await prisma.customers.findMany();
	return customers;
}

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

// GET /customers
// Get the list of customers
router.get('/', authMiddleware, async (request: Request, response: Response) => {
	const employeeId = response.locals.employeeId;
	if (employeeId === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const employee = await getEmployeeFromDB(employeeId);
	if (employee === null) {
		response.status(404).send("Employee not found");
		return;
	}
	let customers;
	if (employee.role === "MANAGER") {
		customers = await getCustomersDB();
	} else {
		const customerList = employee.customerIds;
		customers = await prisma.customers.findMany({
			where: {
				id: {
					in: customerList
				}
			}
		});
	}
	const shortCustomersDTO = [];
	for (const customer of customers) {
		const shortCustomerDTO = new ShortCustomersDTO(customer.id, customer.name, customer.surname, customer.email);
		shortCustomersDTO.push(shortCustomerDTO);
	}
	response.status(200).send(shortCustomersDTO);
});

async function getCustomerDB(id: number) {
	const customer = await prisma.customers.findUnique({
		where: {
			id: id
		}
	});
	return customer;
}

// GET /customers/:id
// Get the information of a customer
router.get('/:id', authMiddleware, async (request: Request, response: Response) => {
	const employeeId = response.locals.employeeId;
	if (employeeId === null || request.params.id === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const employee = await getEmployeeFromDB(employeeId);
	if (employee === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		response.status(400).send("Invalid ID");
		return;
	}
	if (employee.role !== "MANAGER" && !employee.customerIds.includes(id)) {
		response.status(401).send("Unauthorized");
		return;
	}
	const customer = await getCustomerDB(id);
	if (customer === null) {
		response.status(404).send("Customer not found");
		return;
	}
	const customerDTO = new CustomerDTO(customer.id, customer.email, customer.name, customer.surname, customer.birthdate, customer.gender, customer.description, customer.astrological_sign, customer.phone_number, customer.address);
	response.status(200).send(customerDTO);
});

// GET /customers/:id/image
// Get the image of a customer
router.get('/:id/image', authMiddleware, async (request: Request, response: Response) => {
	const employeeId = response.locals.employeeId;
	if (employeeId === null || request.params.id === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const employee = await getEmployeeFromDB(employeeId);
	if (employee === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		response.status(400).send("Invalid ID");
		return;
	}
	if (employee.role !== "MANAGER" && !employee.customerIds.includes(id)) {
		response.status(401).send("Unauthorized");
		return;
	}
	const customer = await getCustomerDB(id);
	if (customer === null) {
		response.status(404).send("Customer not found");
		return;
	}
	if (customer.image === null) {
		response.status(404).send("Image not available for this customer");
		return;
	}
	response.status(200).type('image/png').send(customer.image);
});

// GET /customers/:id/clothes
// Get the clothes of a customer
router.get('/:id/clothes', authMiddleware, async (request: Request, response: Response) => {
	const employeeId = response.locals.employeeId;
	if (employeeId === null || request.params.id === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const employee = await getEmployeeFromDB(employeeId);
	if (employee === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		response.status(400).send("Invalid ID");
		return;
	}
	if (employee.role !== "MANAGER" && !employee.customerIds.includes(id)) {
		response.status(401).send("Unauthorized");
		return;
	}
	const customer = await getCustomerDB(id);
	if (customer === null) {
		response.status(404).send("Customer not found");
		return;
	}
	const clothes = await prisma.clothes.findMany({
		where: {
			id: {
				in: customer.clothes_ids
			}
		}
	});
	response.status(200).send(clothes);
});

// GET /customers/:id/encounters
// Get the encounters of a customer
router.get('/:id/encounters', authMiddleware, async (request: Request, response: Response) => {
	const employeeId = response.locals.employeeId;
	if (employeeId === null || request.params.id === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const employee = await getEmployeeFromDB(employeeId);
	if (employee === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		response.status(400).send("Invalid ID");
		return;
	}
	if (employee.role !== "MANAGER" && !employee.customerIds.includes(id)) {
		response.status(401).send("Unauthorized");
		return;
	}
	const meetings = await prisma.enconters.findMany({
		where: {
			customer_id: id
		}
	});
	response.status(200).send(meetings);
});

// GET /customers/:id/payments
// Get the payments of a customer
router.get('/:id/payments', managerAuthMiddleware, async (request: Request, response: Response) => {
	const employeeId = response.locals.employeeId;
	if (employeeId === null || request.params.id === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const employee = await getEmployeeFromDB(employeeId);
	if (employee === null) {
		response.status(404).send("Employee not found");
		return;
	}
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		response.status(400).send("Invalid ID");
		return;
	}
	const payments = await prisma.payments.findMany({
		where: {
			customer_id: id
		}
	});
	response.status(200).send(payments);
});

export default router;
