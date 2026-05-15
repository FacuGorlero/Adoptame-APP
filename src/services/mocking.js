import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { createHash } from "../utils/index.js"; 

class MockingService {
    static async generarMockingPets (num) {
  const pets = [];
  for (let i = 0; i < num; i++) {
    pets.push({
      name: faker.person.firstName(),
      specie: faker.animal.type(),
      birthDate: faker.date.past(),
      adopted: false,
      owner: null,
      image: faker.image.url(),
    });
  }
  return pets;
};

static async generarUsuarios (num) {
  const usuarios = [];

  for (let i = 0; i < num; i++) {
    usuarios.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: await createHash("coder123"),
      role: faker.helpers.arrayElement(["user", "admin"]),
      pets: [],
    });
  }

  return usuarios;
};

}

export default MockingService;
