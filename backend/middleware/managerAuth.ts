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
        const userToken = await prisma.token.findUnique({
            where: {
                token: token
            }
        });
        if (userToken === null) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        if (userToken !== null && userToken.validUntil < new Date()) {
            res.status(401).json({ error: "Token expired" });
            return;
        }
        const employee = await prisma.employee.findUnique({
            where: {
                email: userToken.email
            }
        });
        if (employee === null) {
            res.status(401).json({ error: "Employee not found" });
            return;
        }
        if (employee.role !== "MANAGER") {
            res.status(401).json({ error: "Not an admin" });
            return;
        }
        res.locals.employeeId = employee.id;
	    next();
    } catch(error) {
        res.status(401).json({ error: "Authentication error" });
        return;
    }
};
