import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

module.exports = async (req : any, res : any, next : any) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }
        const user = await prisma.token.findUnique({
            where: {
                token: token
            }
        });
        if (user === null) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        if (user !== null && user.validUntil < new Date()) {
            res.status(401).json({ error: "Token expired" });
            return;
        }

	    next();
    } catch(error) {
        res.status(401).json({ error: "Authentication error" });
        return;
    }
};
