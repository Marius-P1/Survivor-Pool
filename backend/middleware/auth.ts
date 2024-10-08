import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

module.exports = async (req : any, res : any, next : any) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).send("Authorization header missing");
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).send("Token missing");
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
        const employee = await prisma.employee.findUnique({
            where: {
                email: user.email
            }
        });
        if (employee === null) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        res.locals.employeeId = employee.id;
	    next();
    } catch(error) {
        res.status(401).json({ error: "Authentication error" });
        return;
    }
};
