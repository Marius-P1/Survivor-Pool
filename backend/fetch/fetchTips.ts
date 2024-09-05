import { PrismaClient } from '@prisma/client'
import { promisify } from 'util';
import dotenv from "dotenv";

const request = require('request')
const prisma = new PrismaClient()

dotenv.config();

const TEAMTOKEN = process.env.TEAMTOKEN;

const API_MAIL = process.env.API_MAIL;
const API_PASS = process.env.API_PASS;

async function createTips(id: number, title: string, tip: string) {
    await prisma.tips.create({
        data: {
            id: id,
            title: title,
            tip: tip
        }
    });
}

async function checkIfTipsIdExists(id: number) {
    const tips = await prisma.tips.findUnique({
        where: {
            id: id
        }
    });
    if (tips === null) {
        return false;
    }
    return true;
}

module.exports = async function fetchTips(token: string) {
    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: process.env.API_URL + '/tips',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from tips");
            return;
        }
        const tips = JSON.parse(respons.body);
        for (let i = 0; i < tips.length; i++) {
            if (await checkIfTipsIdExists(tips[i].id)) {
                continue;
            }
            await createTips(tips[i].id, tips[i].title as string, tips[i].tip as string);
        }
        return;
    }
    catch (error) {
        console.log("Error: ", error);
    }
}
