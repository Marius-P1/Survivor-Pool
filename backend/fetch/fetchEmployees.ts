import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
// @ts-ignore
import request from 'request';
const app = express();
import dotenv from "dotenv";

dotenv.config();

/* ------- API INFO ------- */
const url = process.env.API_URL;
const api_key = process.env.TEAMTOKEN;
const autorization_token = 'Bearer ' + process.env.TOKENPERSO;
/* ------- API INFO ------- */

interface Employee {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string | null;
    surname: string | null;
    birthdate?: string | null;
    gender?: string | null;
    work?: string | null;
    image?: string | null;
    role?: Role | null;
}

async function requestEmployees() {
    try {
        const response = await new Promise<{ body: string }>((resolve, reject) => {
            request({
                url: url + '/employees',
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'X-Group-Authorization': api_key,
                    'Authorization': autorization_token
                }
            }, (error: any, response: any, body: any) => {
                if (error) return reject(error);
                resolve({ body });
            });
        });

        console.log('API Response:', response.body); // Log the response body

        let hasToBeUpdated = false;
        const apiEmployees: Employee[] = JSON.parse(response.body);
        const localEmployees: Employee[] = await prisma.employee.findMany();

        const promises = Array.isArray(apiEmployees) ? apiEmployees.map((apiEmployee, index) => {
            return new Promise<void>((resolve, reject) => {
                Promise.all([
                    new Promise<void>((resolve, reject) => {
                        request({
                            url: url + '/employees/' + apiEmployee.id,
                            method: 'GET',
                            headers: {
                                'accept': 'application/json',
                                'X-Group-Authorization': api_key,
                                'Authorization': autorization_token
                            }
                        }, (error: any, response: any, body: any) => {
                            if (error) return reject(error);
                            apiEmployees[index] = JSON.parse(body);
                            resolve();
                        });
                    }),
                    new Promise<void>((resolve, reject) => {
                        request({
                            url: url + '/employees/' + apiEmployee.id + '/image',
                            method: 'GET',
                            headers: {
                                'accept': 'application/json',
                                'X-Group-Authorization': api_key,
                                'Authorization': autorization_token
                            }
                        }, (error: any, response: any, body: any) => {
                            if (error) return reject(error);
                            apiEmployees[index].image = body; // Assuming body contains the image data
                            resolve();
                        });
                    })
                ]).then(() => resolve()).catch(reject);
            });
        }) : [];

        await Promise.all(promises);

        for (let i = 0; i < localEmployees.length; i++) {
            const user = localEmployees[i];
            if (!user.hasOwnProperty('birthdate')) user.birthdate = 'undefined';
            if (!user.hasOwnProperty('gender')) user.gender = 'undefined';
            if (!user.hasOwnProperty('work')) user.work = 'undefined';
            if (!user.hasOwnProperty('image')) user.image = 'undefined';

            for (let j = 0; j < apiEmployees.length; j++) {
                const apiUser = apiEmployees[j];
                if (user.id === apiUser.id) {
                    const fields: (keyof Employee)[] = ['birthdate', 'gender', 'work', 'name', 'surname', 'email', 'image'] as (keyof Employee)[];
                    // @ts-ignore
                    fields.forEach(field => {
                        if (user[field] !== apiUser[field]) {
                            // @ts-ignore
                            user[field] = apiUser[field];
                            hasToBeUpdated = true;
                        }
                    });
                }
            }
        }

        const newUsers = Array.isArray(apiEmployees) ? (localEmployees === undefined ? apiEmployees : apiEmployees.filter(apiUser =>
            !localEmployees.some(localUser => localUser.email === apiUser.email)
        )) : [];

        if (newUsers.length > 0) {
            await prisma.employee.createMany({ data: newUsers.map(user => ({ ...user, role: user.role as Role })) });
            console.log('New employees added.');
        } else {
            if (hasToBeUpdated) {
                for (const user of localEmployees) {
                    await prisma.employee.update({
                        where: { id: user.id },
                        data: { ...user, role: user.role as Role }
                    });
                }
                console.log('Users updated.');
            } else {
                console.log('No new users to add.');
            }
        }
    } catch (error) {
        console.error('Error updating API users:', error);
    }
    console.log('Request done');
    const employees = await prisma.employee.findMany();
    console.log('Now the employees are:', JSON.stringify(employees, null, 2));
}

setInterval(requestEmployees, 10000);

export default app;