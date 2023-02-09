import app from "../src/app";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import prisma from "../src/config/database";
import { createConsole } from "./factories/console-factories";

const api = supertest(app);

beforeEach(async () => {
    await prisma.console.deleteMany();
});

describe("tests about consoles", () => {
    it("GET: should return all consoles", async () => {
        const result = await api.get('/consoles');

        const response = result.body;

        expect(response).toEqual([]);
    });

    it("GET: should return exactly consoles", async () => {
        const console = await createConsole();

        const result = await api.get('/consoles');

        const response = result.body;

        expect(response).toEqual([
            {
                id: console.id,
                name: console.name
            }
        ]);
    });

    it("GET/:consoleId : should not return console by id", async () => {
        const result = await api.get('/consoles/0');

        const status = result.status;

        expect(status).toBe(404);
    });

    it("GET/:consoleId : should return console by id", async () => {
        const console = await createConsole();

        const result = await api.get(`/consoles/${console.id}`);

        const response = result.body;

        expect(response).toEqual(
            {
                id: console.id,
                name: console.name
            }
        );
    });

    it("POST: should create a new console", async () => {
        const newConsole = {
            name: faker.name.fullName(),
        }

        const result = await api.post("/consoles").send(newConsole);

        const status = result.status;

        expect(status).toBe(201);
    });

    it("POST: should create new console when body is valid", async () => {
        const newConsole = {
            name: faker.name.fullName(),
        }

        const result = await api.post("/consoles").send(newConsole);

        const insertedConsole = await prisma.console.findFirst({
            where: {
                name: newConsole.name
            }
        });

        expect(insertedConsole).toEqual(
            {
                id: insertedConsole.id,
                name: insertedConsole.name
            }
        );
    });

    it("POST: should not create the same console", async () => {
        const body = {
            name: faker.name.fullName()
        } 
        
        const console = await prisma.console.create(
            {
                data: body
            }
        )

        const result = await api.post("/consoles").send(body);
        const status = result.status;
        
        expect(status).toBe(409);
    });
});

