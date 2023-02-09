import { faker } from "@faker-js/faker";
import prisma from "../../src/config/database";

export function createConsole() {
    return prisma.console.create({
        data: {
            name: faker.name.fullName(),
        }
    })
}
