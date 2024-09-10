import { ShortCustomersDTO, CustomerDTO } from "../dto/customersDTO";
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";
import {checkIfTokenIsValid, getEmployeeFromToken, isManager} from "./tokenCheck";


const request = require('request')
const prisma = new PrismaClient()

dotenv.config();

async function getCustomersDB() {
	const customers = await prisma.customers.findMany();
	return customers;
}

exports.getCustomers = async function (request: Request, response: Response) {
	const authHeader = request.headers.authorization;
	if (!authHeader) {
		response.status(401).send("Authorization header missing");
		return;
	}
	const token = authHeader.split(" ")[1];
	if (!await checkIfTokenIsValid(token)) {
		response.status(401).send("Invalid token");
		return;
	}
	let customers;
	if (await isManager(token)) {
		customers = await getCustomersDB();
	} else {
		const employee = await getEmployeeFromToken(token);
		if (employee === null) {
			response.status(401).send("Employee not found");
			return;
		}
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
}

async function getCustomerDB(id: number) {
	const customer = await prisma.customers.findUnique({
		where: {
			id: id
		}
	});
	return customer;
}

exports.getCustomer = async function (request: Request, response: Response) {
	const authHeader = request.headers.authorization;
	if (!authHeader) {
		response.status(401).send("Authorization header missing");
		return;
	}
	const token = authHeader.split(" ")[1];
	if (!await checkIfTokenIsValid(token)) {
		response.status(401).send("Invalid token");
		return;
	}
	const employee = await getEmployeeFromToken(token);
	if (employee === null) {
		response.status(401).send("Employee not found");
		return;
	}
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		response.status(400).send("Invalid ID");
		return;
	}
	const customer = await getCustomerDB(id);
	if (customer === null) {
		response.status(404).send("Customer not found");
		return;
	}
	if (employee.role !== "MANAGER" && !employee.customerIds.includes(parseInt(request.params.id))) {
		response.status(401).send("Unauthorized");
		return;
	}
	const customerDTO = new CustomerDTO(customer.id, customer.email, customer.name, customer.surname, customer.birthdate, customer.gender, customer.description, customer.astrological_sign, customer.phone_number, customer.address);
	response.status(200).send(customerDTO);
}

exports.getCustomerImage = async function (request: Request, response: Response) {
	const authHeader = request.headers.authorization;
	if (!authHeader) {
		response.status(401).send("Authorization header missing");
		return;
	}
	const token = authHeader.split(" ")[1];
	if (!await checkIfTokenIsValid(token)) {
		response.status(401).send("Invalid token");
		return;
	}
	const employee = await getEmployeeFromToken(token);
	if (employee === null) {
		response.status(401).send("Employee not found");
		return;
	}
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		response.status(400).send("Invalid ID");
		return;
	}
	const customer = await getCustomerDB(id);
	if (customer === null) {
		response.status(404).send("Customer not found");
		return;
	}
	if (employee.role !== "MANAGER" && !employee.customerIds.includes(parseInt(request.params.id))) {
		response.status(401).send("Unauthorized");
		return;
	}
	if (customer.image === null) {
		response.status(404).send("Image not found");
		return;
	}
	response.status(200).type('image/png').send(customer.image);
}

exports.getCustomerClothes = async function (request: Request, response: Response) {
	const authHeader = request.headers.authorization;
	if (!authHeader) {
		response.status(401).send("Authorization header missing");
		return;
	}
	const token = authHeader.split(" ")[1];
	if (!await checkIfTokenIsValid(token)) {
		response.status(401).send("Invalid token");
		return;
	}
	const employee = await getEmployeeFromToken(token);
	if (employee === null) {
		response.status(401).send("Employee not found");
		return;
	}
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		response.status(400).send("Invalid ID");
		return;
	}
	if (employee.role !== "MANAGER" && !employee.customerIds.includes(parseInt(request.params.id))) {
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
}

exports.getCustomerEncounters = async function (request: Request, response: Response) {
	const authHeader = request.headers.authorization;
	if (!authHeader) {
		response.status(401).send("Authorization header missing");
		return;
	}
	const token = authHeader.split(" ")[1];
	if (!await checkIfTokenIsValid(token)) {
		response.status(401).send("Invalid token");
		return;
	}
	const employee = await getEmployeeFromToken(token);
	if (employee === null) {
		response.status(401).send("Employee not found");
		return;
	}
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		response.status(400).send("Invalid ID");
		return;
	}
	if (employee.role !== "MANAGER" && !employee.customerIds.includes(parseInt(request.params.id))) {
		response.status(401).send("Unauthorized");
		return;
	}
	const meetings = await prisma.enconters.findMany({
		where: {
			customer_id: id
		}
	});
	response.status(200).send(meetings);
}

exports.getCustomerPayments = async function (request: Request, response: Response) {
	const authHeader = request.headers.authorization;
	if (!authHeader) {
		response.status(401).send("Authorization header missing");
		return;
	}
	const token = authHeader.split(" ")[1];
	if (!await checkIfTokenIsValid(token)) {
		response.status(401).send("Invalid token");
		return;
	}
	const employee = await getEmployeeFromToken(token);
	if (employee === null) {
		response.status(401).send("Employee not found");
		return;
	}
	if (employee.role !== "MANAGER") {
		response.status(401).send("Unauthorized");
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
}
