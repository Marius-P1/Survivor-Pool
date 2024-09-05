import { PrismaClient } from '@prisma/client'
import { promisify } from 'util';
import dotenv from "dotenv";

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

    const requestPromise = promisify(request);

    try {
        const respons = await requestPromise({
            url: process.env.API_URL + '/clothes/' + id + '/image',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Group-Authorization': TEAMTOKEN
            }
        });

        if (respons.statusCode !== 200) {
            console.log("Error: Could not fetch data from clothes id: ", id);
            return;
        }
        const clothesImage = respons.body;
        const clothesImageStr = Buffer.from(clothesImage).toString('base64');
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
