import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";

const prisma = new PrismaClient()

dotenv.config();

export async function checkIfTokenIsValid(token: string) {
    const user = await prisma.token.findUnique({
        where: {
            token: token
        }
    });

    return user !== null;
}

export async function isManager(token: string) {
    const user = await prisma.token.findUnique({
        where: {
            token: token
        }
    });
    if (user === null) {
        return false;
    }
    const employee = await prisma.employee.findUnique({
        where: {
            email: user.email
        }
    });
    if (employee === null) {
        return false;
    }
    return employee.role === "MANAGER";
}

export async function getEmployeeIdFromToken(token: string) {
    const user = await prisma.token.findUnique({
        where: {
            token: token
        }
    });
    if (user === null) {
        return null;
    }
    const employee = await prisma.employee.findUnique({
        where: {
            email: user.email
        }
    });
    if (employee === null) {
        return null;
    }
    return employee.id;
}

export async function getEmployeeFromToken(token: string) {
    const user = await prisma.token.findUnique({
        where: {
            token: token
        }
    });
    if (user === null) {
        return null;
    }
    const employee = await prisma.employee.findUnique({
        where: {
            email: user.email
        }
    });
    return employee;
}
