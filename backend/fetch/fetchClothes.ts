import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";

const fetch = require('node-fetch');
const request = require('request')
const prisma = new PrismaClient()

dotenv.config();

const TEAMTOKEN = process.env.TEAMTOKEN;

const API_MAIL = process.env.API_MAIL;
const API_PASS = process.env.API_PASS;


async function createClothes(id: number, image: string) {
    await prisma.clothes.create({
        data: {
            id: id,
            image: image
        }
    });
}

async function checkIfClothesIdExists(id: number) {
    const clothes = await prisma.clothes.findUnique({
        where: {
            id: id
        }
    });
    if (clothes === null) {
        return false;
    }
    return true;
}

module.exports = async function fetchClothes(token: string, id: number, recursive: boolean = false) {
    if (await checkIfClothesIdExists(id)) {
        if (recursive) {
            await fetchClothes(token, id + 1, recursive);
        }
        return;
    }

    try {
        const avatar = await fetch(process.env.API_URL + '/clothes/' + id + '/image', {
            method: 'GET',
            headers: {
                'accept': 'image/png',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN!
            }
        });
        if (avatar.status === 429) {
            console.log("Received 429 Too Many Requests, waiting before retrying...2 + id:" + id);
            await new Promise(r => setTimeout(r, 5000));
            return await fetchClothes(token, id, recursive);
        }
        if (!avatar.ok) {
            console.log("Error: Could not fetch data from clothes id: ", id);
            console.log("Status code: ", avatar.status);
            console.log("Body: ", await avatar.text());
            return;
        }
        const clothesImage = await avatar.buffer();
        const clothesImageStr = clothesImage.toString('base64');
        await createClothes(id, clothesImageStr);
        if (recursive) {
            await fetchClothes(token, id + 1, recursive);
        }
        return;
    }
    catch (error) {
        console.log("Error: ", error);
        return;
    }

}
