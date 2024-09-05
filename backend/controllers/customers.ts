import { ShortCustomersDTO, CustomerDTO } from "../dto/customersDTO";
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";


const request = require('request')
const prisma = new PrismaClient()

dotenv.config();

async function getCustomersDB() {
	const customers = await prisma.customers.findMany();
	return customers;
}

exports.getCustomers = async function (request: Request, response: Response) {
	const customers = await getCustomersDB();
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
	const customerDTO = new CustomerDTO(customer.id, customer.email, customer.name, customer.surname, customer.birthdate, customer.gender, customer.description, customer.astrological_sign, customer.phone_number, customer.address);
	response.status(200).send(customerDTO);
}

exports.getCustomerImage = async function (request: Request, response: Response) {
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
	if (customer.image === null) {
		response.status(404).send("Image not found");
		return;
	}
	const image = Buffer.from(customer.image, 'base64');
	response.status(200).send(image);
}

exports.getCustomerClothes = async function (request: Request, response: Response) {
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
	const clothes = await prisma.clothes.findMany({
		where: {
			id: {
				in: customer.clothes_ids
			}
		}
	});
	response.status(200).send(clothes);
}
