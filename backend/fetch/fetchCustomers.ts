import { PrismaClient } from '@prisma/client'
import { promisify } from 'util';
import dotenv from "dotenv";

const request = require('request')
const prisma = new PrismaClient()

dotenv.config();

const TEAMTOKEN = process.env.TEAMTOKEN;

const API_MAIL = process.env.API_MAIL;
const API_PASS = process.env.API_PASS;

const fetchClothes = require('./fetchClothes');

async function checkIfPaymentsIdExists(id: number) {
    const payments = await prisma.payments.findUnique({
        where: {
            id: id
        }
    });
    if (payments === null) {
        return false;
    }
    return true;
}

async function createPayments(id: number, customerId: number, date: string, amount: number, paymentMethod: string) {
    await prisma.payments.create({
        data: {
            id: id,
            customer_id: customerId,
            date: date,
            amount: amount,
            payment_method: paymentMethod
        }
    });
}

async function fetchPayments(token: string, customerId: number) {
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: 'https://soul-connection.fr/api/customers/' + customerId + '/payments_history',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from payments of customer id: ", customerId);
            console.log("Status code: ", respons.statusCode);
            console.log("Body: ", respons.body);
            return;
        }
        const payments = JSON.parse(respons.body);
        for (let i = 0; i < payments.length; i++) {
            if (await checkIfPaymentsIdExists(payments[i].id)) {
                continue;
            }
            await createPayments(payments[i].id, customerId, payments[i].date, payments[i].amount, payments[i].payment_method);
        }
        return;
    }
    catch (error) {
        console.log("Error: ", error);
    }
}

async function updateClothesType(token: string, clothesId: number, type: string) {
    await prisma.clothes.update({
        where: {
            id: clothesId
        },
        data: {
            type: type
        }
    });
}

async function getCustomersClothesIds(token: string, customerId: number) : Promise<number[] | null> {
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: 'https://soul-connection.fr/api/customers/' + customerId + '/clothes',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from customer clothes id: ", customerId);
            console.log("Status code: ", respons.statusCode);
            console.log("Body: ", respons.body);
            return null;
        }
        const clothes = JSON.parse(respons.body);
        let clothesIds = [];
        for (let i = 0; i < clothes.length; i++) {
            await updateClothesType(token, clothes[i].id, clothes[i].type);
            clothesIds.push(clothes[i].id);
        }
        return clothesIds;
    }
    catch (error) {
        console.log("Error: ", error);
        return null;
    }
}

async function fetchCustomersImage(token: string, customerId: number) : Promise<string | null> {
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: 'https://soul-connection.fr/api/customers/' + customerId + '/image',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from customer image id: ", customerId);
            console.log("Status code: ", respons.statusCode);
            console.log("Body: ", respons.body);
            return null;
        }
        const customerImage = respons.body;
        const customerImageStr = Buffer.from(customerImage).toString('base64');
        return customerImageStr;
    }
    catch (error) {
        console.log("Error: ", error);
        return null;
    }
}

async function checkIfCustomersIdExists(id: number) {
    const customers = await prisma.customers.findUnique({
        where: {
            id: id
        }
    });
    if (customers === null) {
        return false;
    }
    return true;
}

async function createCustomers(id: number, email: string, name: string, surname: string, birthdate: string, gender: string, desc : string, astrological_sign: string, phone : string, adress : string, image: string | null, clothesIds: number[]) {
    await prisma.customers.create({
        data: {
            id: id,
            email: email,
            name: name,
            surname: surname,
            birthdate: birthdate,
            gender: gender,
            description: desc,
            astrological_sign: astrological_sign,
            phone_number: phone,
            address: adress,
            image: image,
            clothes_ids: clothesIds
        }
    });
}

async function updateCustomersImageIfNull(token: string, customerId: number, image: string | null) {
    const client = await prisma.customers.findUnique({
        where: {
            id: customerId
        }
    });
    if (client !== null && client.image === null && image !== null) {
        await prisma.customers.update({
            where: {
                id: customerId
            },
            data: {
                image: image
            }
        });
    }
}

async function getDetailsCustomer(token: string, customerId: number) {
    await fetchPayments(token, customerId);
    let clothesIds = await getCustomersClothesIds(token, customerId);
    let customerImage = await fetchCustomersImage(token, customerId);
    if (clothesIds === null)
        return;
    for (let j = 0; j < clothesIds.length; j++) {
        await fetchClothes(token, clothesIds[j]);
    }
    if (await checkIfCustomersIdExists(customerId)) {
        updateCustomersImageIfNull(token, customerId, customerImage);
        return;
    }
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: 'https://soul-connection.fr/api/customers/' + customerId,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from customers id: ", customerId);
            return;
        }
        const customer = JSON.parse(respons.body);
        await createCustomers(customer.id, customer.email, customer.name, customer.surname, customer.birth_date, customer.gender, customer.description, customer.astrological_sign, customer.phone_number, customer.address, customerImage, clothesIds);
        console.log("Customer: ", customer.id);
        return;
    }
    catch (error) {
        console.log("Error: ", error);
    }
}

module.exports = async function fetchCustomers(token: string) {
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: 'https://soul-connection.fr/api/customers',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from customers");
            return;
        }
        const customers = JSON.parse(respons.body);
        for (let i = 0; i < customers.length; i++) {
            await getDetailsCustomer(token, customers[i].id);
            await new Promise(r => setTimeout(r, 200)); // 5 requests per second else the API will fail some operations
        }
        return;
    }
    catch (error) {
        console.log("Error: ", error);
    }
}