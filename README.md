https://hub.docker.com/repository/docker/zogk/proyecto-final/general
# 🐾 Adoptame API

A REST API for managing pet adoptions. Register users, publish pets, and process adoptions — with mock data generation via Faker.js and full API documentation via Swagger.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v20+ (ESM) |
| Framework | Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + Cookie Parser |
| Mock data | Faker.js |
| Docs | Swagger UI (OpenAPI 3.0) |
| Testing | Mocha + Chai + Supertest |
| Deploy | Render + Docker |

---

## 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/adoptame.git
cd adoptame

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Edit .env with your values

# 4. Start the server
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root with:

```env
PORT=8080
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/Adoptame?retryWrites=true&w=majority&appName=Adoptame
```

> Make sure your MongoDB Atlas cluster has `0.0.0.0/0` whitelisted under **Network Access** so Render (or any external server) can connect.

---

## 🗂️ Project Structure

```
src/
├── controllers/        # Route handlers
│   ├── adoptions.controller.js
│   ├── mocks.controller.js
│   ├── pets.controller.js
│   ├── sessions.controller.js
│   └── users.controller.js
├── dao/                # Database access layer
│   ├── models/
│   │   ├── Adoption.js
│   │   ├── Pet.js
│   │   └── User.js
│   ├── Adoption.js
│   ├── Pets.dao.js
│   └── Users.dao.js
├── docs/               # Swagger YAML files
│   ├── adopatme.yaml
│   ├── pets.yaml
│   └── user.yaml
├── dto/                # Data Transfer Objects
│   ├── Pet.dto.js
│   └── User.dto.js
├── repository/         # Repository pattern layer
│   ├── AdoptionRepository.js
│   ├── GenericRepository.js
│   ├── PetRepository.js
│   └── UserRepository.js
├── routes/             # Express routers
│   ├── adoption.router.js
│   ├── mocks.router.js
│   ├── pets.router.js
│   ├── sessions.router.js
│   └── users.router.js
├── services/           # Service instances
│   ├── index.js
│   └── mocking.js
├── utils/              # Helpers
│   ├── index.js
│   └── uploader.js
└── app.js              # Entry point
```

---

## 📋 API Routes

### Sessions
| Method | Route | Description |
|---|---|---|
| POST | `/api/sessions/register` | Register a new user |
| POST | `/api/sessions/login` | Login and get JWT cookie |
| GET | `/api/sessions/current` | Get current user from cookie |

### Users
| Method | Route | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:uid` | Get user by ID |
| PUT | `/api/users/:uid` | Update user |
| DELETE | `/api/users/:uid` | Delete user |

### Pets
| Method | Route | Description |
|---|---|---|
| GET | `/api/pets` | Get all pets |
| POST | `/api/pets` | Create a pet |
| POST | `/api/pets/withimage` | Create a pet with image upload |
| PUT | `/api/pets/:pid` | Update a pet |
| DELETE | `/api/pets/:pid` | Delete a pet |

### Adoptions
| Method | Route | Description |
|---|---|---|
| GET | `/api/adoptions` | Get all adoptions |
| GET | `/api/adoptions/:aid` | Get adoption by ID |
| POST | `/api/adoptions/:uid/:pid` | Adopt a pet (user ID + pet ID) |

### Mocks
| Method | Route | Description |
|---|---|---|
| GET | `/api/mocks/mockingPets` | Generate 50 fake pets (not saved) |
| GET | `/api/mocks/mockingUsers` | Generate 50 fake users (not saved) |
| POST | `/api/mocks/generateData` | Generate and save to DB |

---

## 🧪 Generating Mock Data

Use the `/api/mocks/generateData` endpoint to populate your database with test data:

```bash
POST /api/mocks/generateData
Content-Type: application/json

{
  "users": 10,
  "pets": 20
}
```

All generated users have the password `coder123`.

---

## 📖 API Documentation

Swagger UI is available at:

```
http://localhost:8080/apidocs
```

Or on production:

```
https://adoptame-app.onrender.com/apidocs
```

---

## 🐳 Docker

The project includes a `Dockerfile` for containerized deployment.

```bash
# Build image
docker build -t adoptame-api .

# Run container
docker run -p 8080:8080 --env-file .env adoptame-api
```

---

## 🧪 Testing

```bash
npm test
```

Runs the test suite with Mocha against the adoption endpoints.

---

## ✨ Features

- User registration and login with JWT authentication
- Pet management (create, update, delete, upload image)
- Adoption flow — validates pet availability, updates owner, marks pet as adopted
- Mock data generation with Faker.js for testing
- Swagger documentation for all endpoints
- Repository pattern for clean data access layer
- Docker-ready for containerized deployment

---

## 👤 Author

**Facundo Gorlero**
[GitHub](https://github.com/facundogorlero)

---

## 📄 License

Built as a final project for the **Coderhouse Backend** course.
