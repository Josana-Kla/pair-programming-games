import { faker } from "@faker-js/faker";
import prisma from "../../src/config/database";

export function createGame(consoleId: number) {
    return prisma.game.create({
        data: {
            title: faker.name.fullName(),
            consoleId: consoleId
        }
    })
}
