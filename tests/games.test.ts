import app from "../src/app";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import prisma from "../src/config/database";
import { createConsole } from "./factories/console-factories";
import { createGame } from "./factories/games-factories";

const api = supertest(app);

beforeEach(async () => {
    await prisma.game.deleteMany();
});

describe("tests about games", () => {
    it("GET: should return all games", async () => {
        const result = await api.get('/games');

        const response = result.body;

        expect(response).toEqual([]);
    });

    it("GET: should return exactly games", async () => {
        const console = await createConsole();
        const game = await createGame(console.id);

        const result = await api.get('/games');

        const response = result.body;

        expect(response).toEqual([
            {
                Console: {
                    id: console.id,
                    name: console.name
                },
                id: game.id,
                title: game.title,
                consoleId: console.id
            }
        ]);
    });

    it("GET/:gameId : should not return game by id", async () => {
        const result = await api.get('/games/0');

        const status = result.status;

        expect(status).toBe(404);
    });

    it("GET/:gameId : should return game by id", async () => {
        const console = await createConsole();
        const game = await createGame(console.id);

        const result = await api.get(`/games/${game.id}`);

        const response = result.body;

        expect(response).toEqual(
            {
                id: game.id,
                title: game.title,
                consoleId: console.id
            }
        );
    });

    it("POST: should create a new game", async () => {
        const console = await createConsole();
        const newGame = {
            title: faker.name.fullName(),
            consoleId: console.id
        }

        const result = await api.post("/games").send(newGame);

        const status = result.status;

        expect(status).toBe(201);
    });

    it("POST: should create new game when body is valid", async () => {
        const console = await createConsole();
        const newGame = {
            title: faker.name.fullName(),
            consoleId: console.id,
        }

        const result = await api.post("/games").send(newGame);

        const insertedGame = await prisma.game.findFirst({
            where: {
                title: newGame.title
            }
        });

        expect(insertedGame).toEqual(
            {
                id: insertedGame.id,
                title: insertedGame.title,
                consoleId: console.id
            }
        );
    });

    it("POST: should not create the same game", async () => {
        const newGame = {
            title: faker.name.fullName(),
            consoleId: faker.datatype.number()
        }

        const result = await api.post("/games").send(newGame);

        const status = result.status;

        expect(status).toBe(409);
    });
});

