import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const request = supertest('http://localhost:8080');

describe('Router de adopciones', () => {
    describe("GET api/adoptions", () => {
        it("Debería retornar un array de adopciones", async () => {
            const { status, body } = await request.get('/api/adoptions');
            expect(status).to.equal(200);
            expect(body).to.have.property('status', 'success');
            expect(body.payload).to.be.an('array');
        });

        it("Debería devolver 404 si la ruta no existe", async () => {
            const { status } = await request.get('/adoptions/noexiste');
            expect(status).to.equal(404);
        });

        it("Debería devolver la información de una adopción existente", async () => {
            let aid = "677fe8303f57bd860c5804e6";
            const { status, body } = await request.get(`/api/adoptions/${aid}`);
            expect(status).to.equal(200);
            expect(body).to.have.property('status', 'success');
            expect(body.payload).to.be.an('object');
            expect(body.payload).to.have.property('_id', aid);
        });

        it("Debería devolver 404 si la adopción no existe", async () => {
            let idNoExistente = "677fe8303f57bd860c5804e7";
            const { status, body } = await request.get(`/api/adoptions/${idNoExistente}`);
            expect(status).to.equal(404);
            expect(body).to.have.property('status', 'error');
            expect(body).to.have.property('error', 'Adoption not found');
        });
    });

    describe("POST api/adoptions", () => {
        it("Debería crear una adopción con éxito", async () => {
            let uid = "677fe13ff9213efa4b82977c";
            let pid = "677fe13ef9213efa4b829715";

            const { status, body } = await request.post(`/api/adoptions/${uid}/${pid}`);
            expect(status).to.equal(200);
            expect(body).to.have.property('status', 'success');
            expect(body).to.have.property('message', 'Pet adopted');
        });

        it("Debería devolver error si el usuario no existe", async () => {
            let uid = "1234567890abcdef12345678"; // ID de usuario inexistente
            let pid = "677fe13ef9213efa4b82971c";

            const { status, body } = await request.post(`/api/adoptions/${uid}/${pid}`);
            expect(status).to.equal(404);
            expect(body).to.have.property('status', 'error');
            expect(body).to.have.property('error', 'user Not found');
        });

        it("Debería devolver error si la mascota no existe", async () => {
            let uid = "677fe13ff9213efa4b829770";
            let pid = "1234567890abcdef12345678"; // ID de mascota inexistente

            const { status, body } = await request.post(`/api/adoptions/${uid}/${pid}`);
            expect(status).to.equal(404);
            expect(body).to.have.property('status', 'error');
            expect(body).to.have.property('error', 'Pet not found');
        });

        it("Debería devolver error si la mascota ya está adoptada", async () => {
            let uid = "677fe13ff9213efa4b829770";
            let pid = "677fe13ef9213efa4b829713"; // ID de una mascota ya adoptada

            const { status, body } = await request.post(`/api/adoptions/${uid}/${pid}`);
            expect(status).to.equal(400);
            expect(body).to.have.property('status', 'error');
            expect(body).to.have.property('error', 'Pet is already adopted');
        });
    });
});
