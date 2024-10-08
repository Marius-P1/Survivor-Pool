import {PrismaClient} from '@prisma/client';
import {promisify} from 'util';
import dotenv from "dotenv";
import express from 'express';
const fetch = require('node-fetch');

const request = require('request');
const prisma = new PrismaClient();
dotenv.config();

const app = express();
const TEAMTOKEN = process.env.TEAMTOKEN;
const API_URL = process.env.API_URL;

async function checkIfEmployeeIdExists(id: number) {
    const employee = await prisma.employee.findUnique({
        where: { id: id }
    });
    return employee !== null;
}

async function createEmployee(id: number, email: string, name: string | null, surname: string | null,
    birthdate: string | null, gender: string | null, work: string | null, image: string | null, customerIdsList: number[]) {
    await prisma.employee.create({
        data: {
            id: id,
            email: email,
            name: name,
            surname: surname,
            birthdate: birthdate,
            gender: gender,
            work: work,
            image: image,
            // @ts-ignore
            role: (work === "Coach") ? "COACH" : "MANAGER",
            customerIds: customerIdsList
        }
    });
}

async function updateEmployeeImageIfNull(employeeId: number, image: string | null) {
    const employee = await prisma.employee.findUnique({
        where: { id: employeeId }
    });
    if (employee !== null && employee.image === null && image !== null) {
        await prisma.employee.update({
            where: { id: employeeId },
            data: { image: image }
        });
    }
}

async function fetchEmployeeDetails(token: string, employeeId: number) {
    const requestPromise = promisify(request);
    try {
        const response = await requestPromise({
            url: `${API_URL}/employees/${employeeId}`,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (response.statusCode !== 200) {
            console.log("Error: Could not fetch data for employee id: ", employeeId);
            console.log("Status code: ", response.statusCode);
            console.log("Body: ", response.body);
            return null;
        }
        return JSON.parse(response.body);
    } catch (error) {
        console.log("Error: ", error);
        return null;
    }
}

async function fetchEmployeeImage(token: string, employeeId: number): Promise<string | null> {
    try {
        const response = await fetch(`${API_URL}/employees/${employeeId}/image`, {
            method: 'GET',
            headers: {
                'accept': 'image/png',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });
        if (!response.ok) {
            console.log("Error: Could not fetch image for employee id: ", employeeId);
            console.log("Status code: ", response.status);
            console.log("Body: ", response.body);
            return null;
        }
        const employeeImage = await response.buffer();
        const employeeImageStr = employeeImage.toString('base64');
        return employeeImageStr;
    } catch (error) {
        console.log("Error: ", error);
        return null;
    }
}

async function getEmployeeDetails(token: string, employeeId: number) {
    const employee = await fetchEmployeeDetails(token, employeeId);
    const employeeImage = await fetchEmployeeImage(token, employeeId);
    const customerIdsList: number[] = [];

    if (employee === null) return;
    if (await checkIfEmployeeIdExists(employeeId)) {
        await updateEmployeeImageIfNull(employeeId, employeeImage);
    } else {
        await createEmployee(employee.id, employee.email, employee.name, employee.surname, employee.birth_date,
            employee.gender, employee.work, employeeImage, customerIdsList);
    }
}

module.exports = async function fetchEmployees(token: string) {
    console.log("Fetching employees from API");
    const requestPromise = promisify(request);

    try {
        const response = await requestPromise({
            url: `${API_URL}/employees`,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (response.statusCode !== 200) {
            console.log("Error: Could not fetch data from employees");
            console.log("Status code: ", response.statusCode);
            console.log("Body: ", response.body);
            return;
        }
        const employees = JSON.parse(response.body);
        for (let i = 0; i < employees.length; i++) {
            await getEmployeeDetails(token, employees[i].id);
            await new Promise(r => setTimeout(r, 200));
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

export default app;
