// @ts-ignore
import express from 'express';
// @ts-ignore
import path from 'path';
import * as fs from 'fs';
// @ts-ignore
import request from 'request';

const app = express();

/* ------- JSON FILE ------- */
const employeesJsonFilePath = path.join(__dirname, '../json/employees.json');
const costumersJsonFilePath = path.join(__dirname, '../json/client.json');

function readJsonFileSync(filepath: string, encoding: BufferEncoding = 'utf8'): any {
    const file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}
/* ------- JSON FILE ------- */

/* ------- API INFO ------- */
const url = 'https://soul-connection.fr/api';
const api_key = 'f6f0e17dd019269fb27bf4e21a823fb8';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJqZWFubmUubWFydGluQHNvdWwtY29ubmVjdGlvbi5mciIsIm5hbWUiOiJKZWFubmUiLCJzdXJuYW1lIjoiTWFydGluIiwiZXhwIjoxNzI3MTgyNDcyfQ.gZwOFHOxITY7B_6vsrJgIUTI0PN6Nxj2m6jARkGFRK0';
const autorization_token = 'Bearer ' + token;
const email = "jeanne.martin@soul-connection.fr";
const password = "naouLeA82oeirn";
/* ------- API INFO ------- */

interface Employee {
    id: number;
    email: string;
    name: string;
    surname: string;
    birth_date?: string;
    gender?: string;
    work?: string;
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

        let hasToBeUpdated = false;
        const apiEmployees: Employee[] = JSON.parse(response.body);
        const localData = readJsonFileSync(employeesJsonFilePath);
        const localEmployees: Employee[] = localData.employees || [];

        const promises = apiEmployees.map((apiEmployee, index) => {
            return new Promise<void>((resolve, reject) => {
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
                    //console.log('Image:', body);
                });
            });
        });

        await Promise.all(promises);

        for (let i = 0; i < localEmployees.length; i++) {
            const user = localEmployees[i];
            if (!user.hasOwnProperty('birth_date')) user.birth_date = 'undefined';
            if (!user.hasOwnProperty('gender')) user.gender = 'undefined';
            if (!user.hasOwnProperty('work')) user.work = 'undefined';

            for (let j = 0; j < apiEmployees.length; j++) {
                const apiUser = apiEmployees[j];
                if (user.id === apiUser.id) {
                    const fields: (keyof Employee)[] = ['birth_date', 'gender', 'work', 'name', 'surname', 'email'] as (keyof Employee)[];
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

        const newUsers = (localEmployees === undefined) ? apiEmployees : apiEmployees.filter(apiUser =>
            !localEmployees.some(localUser => localUser.email === apiUser.email)
        );

        if (newUsers.length > 0) {
            localEmployees.push(...newUsers);
            fs.writeFileSync(employeesJsonFilePath, JSON.stringify({ employees: localEmployees }, null, 2), 'utf8');
            console.log('New employees added.');
        } else {
            if (hasToBeUpdated) {
                fs.writeFileSync(employeesJsonFilePath, JSON.stringify({ employees: localEmployees }, null, 2), 'utf8');
                console.log('Users updated.');
            } else {
                console.log('No new users to add.');
            }
        }
    } catch (error) {
        console.error('Error updating API users:', error);
    }
}

setInterval(requestEmployees, 10000);

async function requestCustomers() {
    try {
        const response = await new Promise<{ body: string }>((resolve, reject) => {
            request({
                url: url + '/customers',
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

        const apiUsers = JSON.parse(response.body);
        const localUsers = readJsonFileSync(costumersJsonFilePath).client;

        const newUsers = (localUsers === undefined) ? apiUsers : apiUsers.filter((apiUser: any) =>
            !localUsers.some((localUser: any) => localUser.email === apiUser.email)
        );

        if (newUsers.length > 0) {
            localUsers.push(...newUsers);
            fs.writeFileSync(costumersJsonFilePath, JSON.stringify({ users: localUsers }, null, 2), 'utf8');
            console.log('New users added.');
        } else {
            console.log('No new users to add.');
        }
    } catch (error) {
        console.error('Error updating customers:', error);
    }
}

//setInterval(requestCustomers, 5000);

export default app;