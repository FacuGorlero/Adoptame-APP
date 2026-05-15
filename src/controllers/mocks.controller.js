import MockingService from '../services/mocking.js';
import { petsService, usersService } from "../services/index.js";

const getMascotas = async (req, res) => {
    try {
        const mascotas = await MockingService.generarMockingPets(50);
        res.send({ status: "success", payload: mascotas });
    } catch (e) {
        res.status(500).json({ error: "Error generating mock pets" });
    }
};

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await MockingService.generarUsuarios(50);
        res.send({ status: "success", payload: usuarios });
    } catch (e) {
        res.status(500).json({ error: "Error generating mock users" });
    }
};

const generateData = async (req, res) => {
    try {
        const users = Number(req.body.users ?? req.query.users ?? 0);
        const pets  = Number(req.body.pets  ?? req.query.pets  ?? 0);

        if (users < 0 || pets < 0) {
            return res.status(400).json({ error: "users and pets must be >= 0" });
        }

        let petList  = [];
        let userList = [];

        if (pets > 0) {
            petList = await MockingService.generarMockingPets(pets);
            // BUG FIX: usar insertMany del repository en vez de dao directamente
            await petsService.insertMany(petList);
        }

        if (users > 0) {
            userList = await MockingService.generarUsuarios(users);
            await usersService.insertMany(userList);
        }

        return res.status(201).json({
            message: "Data generated and saved successfully",
            generated: { users: userList.length, pets: petList.length },
            data: { users: userList, pets: petList },
        });
    } catch (e) {
        console.error("Error generating data:", e);
        return res.status(500).json({ error: "Failed to generate data", detail: e.message });
    }
};

export default { getMascotas, getUsuarios, generateData };
