# 🗳️ SecureVote — Secure Online Voting System

A full-stack, enterprise-grade online voting platform with **blockchain-inspired audit trails**, **JWT authentication**, and **tamper-proof vote verification**.

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────┐
│   Next.js 15    │────▶│  Spring Boot 3   │────▶│ MySQL 8  │
│   (Frontend)    │     │   (REST API)     │     │          │
│   Port: 3000    │     │   Port: 8080     │     │Port: 3306│
└─────────────────┘     └──────────────────┘     └──────────┘
      TypeScript              Java 17              InnoDB
    Tailwind CSS          Spring Security
   Framer Motion            JWT / BCrypt
       Axios            SHA-256 Audit Chain
```

## 🔐 Security Features

- **JWT Authentication** — Stateless tokens with configurable expiration
- **BCrypt Password Hashing** — Industry-standard password protection
- **Role-Based Access Control** — ADMIN and VOTER roles with `@PreAuthorize`
- **SHA-256 Vote Hashing** — Each vote generates a unique cryptographic hash
- **Blockchain-Inspired Audit Chain** — Votes are chained via `previousHash` references
- **One-Person-One-Vote** — Database-level enforcement prevents duplicate voting
- **Vote Anonymity** — Vote data is separated from voter identity post-hashing
- **Merkle Root Tree** — Cryptographic "Election Seal" for total data integrity [NEW]
- **Individual Vote Proofs** — Mathematical proof that a vote is included in results [NEW]

## 📁 Project Structure

```
MINI PROJECT/
├── backend/                         # Spring Boot 3 REST API
│   ├── src/main/java/com/votingsystem/
│   │   ├── config/                  # Security, JWT, CORS
│   │   ├── controller/             # REST endpoints
│   │   ├── dto/                    # Request/Response objects
│   │   ├── entity/                 # JPA entities
│   │   ├── enums/                  # Role, ElectionStatus
│   │   ├── exception/             # Global error handling
│   │   ├── repository/           # Spring Data JPA
│   │   └── service/              # Business logic
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                       # Next.js 15 Application
│   ├── src/
│   │   ├── app/                   # App Router pages
│   │   │   ├── admin/            # Admin dashboard
│   │   │   ├── elections/        # Election listing
│   │   │   ├── login/            # Authentication
│   │   │   ├── register/         # User registration
│   │   │   ├── results/[id]/     # Election results
│   │   │   ├── verify/           # Vote verification
│   │   │   └── vote/[id]/        # Voting interface
│   │   ├── components/           # Navbar, Footer, MerkleVisualizer
│   └── lib/                  # API client, Auth, MerkleUtils
│   └── app/verify/merkle/    # Merkle verification page
│   └── package.json
├── docker-compose.yml
├── run.bat                          # Project Management Console
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Java 17+** and **Maven 3.8+**
- **Node.js 18+** and **npm**
- **MySQL 8.0** (or use Docker)

### Option 1: Docker Compose (Recommended)
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Option 2: Manual Setup

**1. Database**
```sql
CREATE DATABASE voting_system;
CREATE USER 'voting_user'@'localhost' IDENTIFIED BY 'voting_pass';
GRANT ALL PRIVILEGES ON voting_system.* TO 'voting_user'@'localhost';
```

**2. Backend**
```bash
cd backend
mvn spring-boot:run
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new voter |
| POST | `/api/auth/login` | ❌ | Login & get JWT |
| GET | `/api/elections` | ❌ | List all elections |
| GET | `/api/elections/{id}` | ❌ | Election details |
| POST | `/api/votes` | ✅ | Cast a vote |
| GET | `/api/votes/verify/{hash}` | ✅ | Verify vote hash |
| POST | `/api/admin/elections` | 🔑 | Create election |
| PATCH | `/api/admin/elections/{id}/status` | 🔑 | Update status |
| DELETE | `/api/admin/elections/{id}` | 🔑 | Delete election |
| GET | `/api/admin/audit/{electionId}` | 🔑 | View audit trail |
| GET | `/api/admin/audit/{electionId}/verify` | 🔑 | Verify chain |
| POST | `/api/audit/calculate/{id}` | 🔑 | Calculate Merkle Root |
| GET | `/api/audit/proof/{hash}` | ❌ | Get Merkle Proof |

> ✅ = Authenticated user | 🔑 = Admin only

## 🔗 Audit Chain Mechanism

```
Vote 1 → SHA256(data) → Hash₁  |  prevHash = "GENESIS"
Vote 2 → SHA256(data) → Hash₂  |  prevHash = Hash₁
Vote 3 → SHA256(data) → Hash₃  |  prevHash = Hash₂
...
```

Each vote's hash is linked to the previous, creating an immutable chain. Any tampering breaks the chain, which the admin can verify instantly.

## 🧪 Creating an Admin User

Insert directly into the database:
```sql
INSERT INTO users (full_name, email, password, role, enabled)
VALUES ('Admin', 'admin@securevote.com', '$2a$10$...', 'ADMIN', true);
```
Generate the BCrypt hash using any online tool or a Spring Boot runner.

## 📄 License

This project is for educational purposes — Mini Project submission.
