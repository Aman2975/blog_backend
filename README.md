# Blog App — System Design Document (HLD + LLD)

> **Stack:** Node.js · Express.js · TypeScript · PostgreSQL · Prisma ORM · JWT · Cloudinary  
> **Architecture:** Feature-based Modular (Routes → Controller → Service → Repository)

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Functional Requirements](#2-functional-requirements)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [High Level Design (HLD)](#4-high-level-design-hld)
5. [Low Level Design (LLD)](#5-low-level-design-lld)
6. [API Contract](#6-api-contract)
7. [Design Patterns Used](#7-design-patterns-used)
8. [Edge Cases & Validations](#8-edge-cases--validations)
9. [Future Improvements](#9-future-improvements)

---

## 1. Problem Statement

A blogging platform where users can create, manage, and discover posts. Each post has a visibility status — public posts appear in other users' feeds, while private and draft posts remain personal. Users can save public posts to their own collection and manage their profile.

---

## 2. Functional Requirements

| # | Requirement |
|---|-------------|
| FR-1 | User can register with name, email, and password |
| FR-2 | User can login and receive a JWT token |
| FR-3 | User can create a post with title, description, cover image, and status (public / private / draft) |
| FR-4 | User can edit and delete their own posts |
| FR-5 | User can view a feed of public posts created by other users |
| FR-6 | User can save and unsave public posts to their collection |
| FR-7 | User can view their own saved collection |
| FR-8 | User can update their profile — name, bio, avatar |
| FR-9 | User can change password by providing current password first |
| FR-10 | User can view their own posts (all statuses) |

---

## 3. Non-Functional Requirements

| # | Requirement |
|---|-------------|
| NFR-1 | Passwords must be hashed using bcrypt before storing |
| NFR-2 | All protected routes require valid JWT token |
| NFR-3 | Private and draft posts must never appear in other users' feed |
| NFR-4 | A user cannot save the same post twice |
| NFR-5 | Only the post owner can edit or delete a post |
| NFR-6 | Feed must be paginated to avoid loading all posts at once |
| NFR-7 | Images uploaded via Cloudinary — no raw files stored in server |
| NFR-8 | Input must be validated before reaching service layer |

---

## 4. High Level Design (HLD)

### 4.1 System Architecture

```
┌─────────────────────────────────────────┐
│              CLIENT                     │
│   (Browser / Mobile / Postman)          │
└───────────────────┬─────────────────────┘
                    │ HTTP Request
                    ▼
┌─────────────────────────────────────────┐
│           EXPRESS.JS API                │
│                                         │
│  ┌──────────┐  ┌──────────────────────┐ │
│  │   Auth   │  │  JWT Middleware       │ │
│  │Middleware│  │  (protects routes)   │ │
│  └──────────┘  └──────────────────────┘ │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │         Modules                  │   │
│  │  auth | user | post | collection │   │
│  └──────────────────────────────────┘   │
└────────────┬──────────────┬─────────────┘
             │              │
             ▼              ▼
┌────────────────┐   ┌──────────────┐
│  PostgreSQL DB │   │  Cloudinary  │
│  (via Prisma)  │   │ (image store)│
└────────────────┘   └──────────────┘
```

---

### 4.2 Component Breakdown

| Component | Responsibility |
|-----------|---------------|
| **Auth Module** | Register, login, JWT generation |
| **User Module** | Profile view, update name/bio/avatar, change password |
| **Post Module** | Create, edit, delete posts, view feed, view own posts |
| **Collection Module** | Save, unsave, view saved posts |
| **Auth Middleware** | Verify JWT on every protected route |
| **Error Middleware** | Global error handler — catches all thrown errors |
| **Cloudinary Utils** | Upload, delete images from Cloudinary |
| **Prisma Client** | Single shared DB connection (Singleton) |

---

### 4.3 Technology Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Language | TypeScript | Type safety, better DX, catches errors at compile time |
| Framework | Express.js | Lightweight, flexible, full control over structure |
| Database | PostgreSQL | Relational data with clear relationships between User, Post, Collection |
| ORM | Prisma | Type-safe queries, clean schema definition, auto migrations |
| Auth | JWT + bcrypt | Stateless auth, no session storage needed |
| File Storage | Cloudinary | No server storage needed, free tier sufficient, CDN included |
| Validation | Zod | TypeScript-first validation, reusable schemas |
| Architecture | Feature-based Modular | Each module is self-contained, easy to scale and maintain |

---

### 4.4 Request Lifecycle

Every request flows through this chain:

```
Incoming Request
      ↓
  Express Router       → matches URL to correct module route
      ↓
  Auth Middleware      → verifies JWT token (for protected routes)
      ↓
  Validator            → validates request body/params using Zod
      ↓
  Controller           → extracts data from req, calls service
      ↓
  Service              → business logic (authorization checks, rules)
      ↓
  Repository           → Prisma query to PostgreSQL
      ↓
  Response             → JSON sent back to client
```

---

## 5. Low Level Design (LLD)

### 5.1 Folder Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts        → POST /auth/register, POST /auth/login
│   │   ├── auth.controller.ts    → handles req/res for auth
│   │   ├── auth.service.ts       → register/login logic, JWT signing
│   │   ├── auth.validator.ts     → zod schemas for register/login input
│   │   └── auth.types.ts         → RegisterInput, LoginInput interfaces
│   │
│   ├── user/
│   │   ├── user.routes.ts        → GET /users/me, PUT /users/me, etc.
│   │   ├── user.controller.ts    → handles req/res for user
│   │   ├── user.service.ts       → update profile, change password logic
│   │   ├── user.repository.ts    → prisma.user.findUnique, update, etc.
│   │   ├── user.validator.ts     → zod schemas for profile update
│   │   └── user.types.ts         → UpdateProfileInput, ChangePasswordInput
│   │
│   ├── post/
│   │   ├── post.routes.ts        → CRUD routes + feed route
│   │   ├── post.controller.ts    → handles req/res for post
│   │   ├── post.service.ts       → visibility logic, ownership check
│   │   ├── post.repository.ts    → all prisma.post queries
│   │   ├── post.validator.ts     → zod schemas for create/update post
│   │   └── post.types.ts         → CreatePostInput, UpdatePostInput
│   │
│   └── saved/
│       ├── saved.routes.ts
│       ├── saved.controller.ts
│       ├── saved.service.ts  → check if post is public before saving
│       ├── saved.repository.ts
│       ├── saved.validator.ts
│       └── saved.types.ts
│
├── middlewares/
│   ├── auth.middleware.ts         → verifyToken, attach user to req
│   └── error.middleware.ts        → global error handler
│
├── utils/
│   ├── cloudinary.ts              → upload/delete image helpers
│   ├── jwt.ts                     → signToken, verifyToken helpers
│   └── hash.ts                    → hashPassword, comparePassword
│
├── prisma/
│   └── client.ts                  → single PrismaClient instance (Singleton)
│
├── schema.prisma                  → DB schema definition
└── app.ts                         → express app setup, route mounting
```

---

### 5.2 Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  bio       String?
  Profile_image    String?           // Cloudinary URL
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts       Post[]
  saveds saved[]
}

model Post {
  id          String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id     String          @db.Uuid
  title       String          @db.VarChar(255)
  description String
  image_url   String?
  visibility  post_visibility @default(DRAFT)
  created_at  DateTime        @default(now()) @db.Timestamp(6)
  updated_at  DateTime        @default(now()) @db.Timestamp(6)
  users       users           @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_posts_user")
  saved_posts saved_posts[]
}

enum PostStatus {
  public
  private
  draft
}

model saved_posts {
  id      String   @id @default(uuid())
  userId  String
  postId  String
  created_at DateTime @default(now()) @db.Timestamp(6

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])    // prevents saving same post twice
}
```

---

### 5.3 Entity Descriptions

#### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | Display name |
| email | String | Unique, used for login |
| password | String | bcrypt hashed |
| bio | String? | Optional profile bio |
| profile_image | String? | Cloudinary image URL |
| createdAt | DateTime | Auto set on create |
| updatedAt | DateTime | Auto updated |

#### Post
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| title | String | Post title |
| description | String | Post body content |
| visibiltiy | Enum | public / private / draft |
| image_url | String? | Cloudinary image URL |
| user_id | String | FK → User.id |
| createdAt | DateTime | Auto set on create |
| updatedAt | DateTime | Auto updated |

#### saved_posts
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | String | FK → User.id |
| postId | String | FK → Post.id |
| createdAt | DateTime | When post was saved |

**Unique constraint:** `(userId, postId)` — one user can save a post only once

---

### 5.4 Entity Relationship Diagram (ERD)

```
┌───────────────────┐         ┌───────────────────┐
│       USER        │         │       POST        │
│───────────────────│         │───────────────────│
│ id         (PK)   │◄──────  │ id         (PK)   │
│ name              │   1:N   │ title             │
│ email      (UQ)   │         │ description       │
│ password          │         │ status (enum)     │
│ bio               │         │ image_url         │
│ profile_image     │         │ user_i d   (FK)───┘
│ createdAt         │         │ createdAt         │
│ updatedAt         │         │ updatedAt         │
└────────┬──────────┘         └────────┬──────────┘
         │                             │
         │ 1                           │ 1
         │                             │
         │ N                           │ N
         ▼                             ▼
┌───────────────────────────────────────────────────┐
│                   Saved_posts                     │
│───────────────────────────────────────────────────│
│ id              (PK)                              │
│ userId          (FK) ──────────────► USER         │
│ postId          (FK) ──────────────► POST         │
│ createdAt                                         │
│                                                   │
│ UNIQUE (userId, postId)                           │
└───────────────────────────────────────────────────┘

Relationships:
  User    1 ──< N    Post         (one user writes many posts)
  User    1 ──< N    Saved_posts   (one user saves many posts)
  Post    1 ──< N    saved_posts   (one post saved by many users)
  User  M >──< N     Post         via saved_posts (many-to-many)
```

---

### 5.5 Visibility Rules (Core Business Logic)

```
GET /posts/feed (public feed)
  WHERE status = 'public'
  AND   authorId ≠ currentUserId     ← exclude own posts from feed

GET /posts/me (own posts)
  WHERE authorId = currentUserId      ← all statuses visible

GET /posts/:id (single post)
  IF post.authorId === currentUserId  → always show
  IF post.authorId !== currentUserId  → show only if status = 'public'

POST /saved/:postId (save post)
  Only allowed if post.status = 'public'
```

---

## 6. API Contract

### Auth Routes — `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, get JWT token |

**POST /auth/register**
```json
// Request Body
{
  "name": "Aman",
  "email": "aman@example.com",
  "password": "securepass123"
}

// Response 201
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "Aman",
    "email": "aman@example.com"
  }
}
```

**POST /auth/login**
```json
// Request Body
{
  "email": "aman@example.com",
  "password": "securepass123"
}

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Aman",
    "email": "aman@example.com"
  }
}
```

---

### User Routes — `/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | ✅ | Get own profile |
| PUT | `/users/me` | ✅ | Update name, bio, avatar |
| PUT | `/users/me/password` | ✅ | Change password |

**PUT /users/me**
```json
// Request Body (all optional)
{
  "name": "Aman Singh",
  "bio": "Backend Developer"
}
// avatar sent as multipart/form-data

// Response 200
{
  "message": "Profile updated",
  "user": { "id": "uuid", "name": "Aman Singh", "bio": "Backend Developer" }
}
```

**PUT /users/me/password**
```json
// Request Body
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}

// Response 200
{ "message": "Password changed successfully" }

// Response 401 (wrong current password)
{ "error": "Current password is incorrect" }
```

---

### Post Routes — `/posts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/posts` | ✅ | Create new post |
| GET | `/posts/feed` | ✅ | Get public posts from others |
| GET | `/posts/me` | ✅ | Get own posts (all statuses) |
| GET | `/posts/:id` | ✅ | Get single post |
| PUT | `/posts/:id` | ✅ | Edit own post |
| DELETE | `/posts/:id` | ✅ | Delete own post |

**POST /posts**
```json
// Request Body (multipart/form-data for image)
{
  "title": "My First Post",
  "description": "This is the content...",
  "status": "public"
}

// Response 201
{
  "message": "Post created",
  "post": {
    "id": "uuid",
    "title": "My First Post",
    "status": "public",
    "coverImage": "https://cloudinary.com/...",
    "authorId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**GET /posts/feed**
```
Query Params:
  page  = 1      (default)
  limit = 10     (default)

// Response 200
{
  "posts": [...],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

---

### Collection Routes — `/saved`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/saved/:postId` | ✅ | Save a post |
| DELETE | `/saved/:postId` | ✅ | Unsave a post |
| GET | `/saved` | ✅ | Get all saved posts |

---

## 7. Design Patterns Used

### 7.1 Repository Pattern
**Where:** `user.repository.ts`, `post.repository.ts`, `collection.repository.ts`

All Prisma queries are isolated inside repository files. Service layer never directly calls Prisma — it goes through the repository.

```ts
// post.repository.ts
export const postRepository = {
  findFeed: (userId: string, page: number, limit: number) => {
    return prisma.post.findMany({
      where: { status: 'public', NOT: { authorId: userId } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }
}
```

**Benefit:** If Prisma is swapped for another ORM — only repository files change, service stays untouched.

---

### 7.2 Singleton Pattern
**Where:** `prisma/client.ts`

```ts
// prisma/client.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

One instance created once. Every repository imports this same client. Prevents connection pool exhaustion.

---

### 7.3 Middleware — Chain of Responsibility
**Where:** `auth.middleware.ts`, `error.middleware.ts`

Every protected request passes through the auth middleware chain before reaching the controller:

```
Request → authMiddleware → validator → controller
```

```ts
// auth.middleware.ts
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const decoded = verifyToken(token);
  req.user = decoded;
  next(); // pass to next handler
};
```

---

### 7.4 Service Layer Pattern
**Where:** Every module's `*.service.ts`

Controllers never contain business logic. Service contains all rules:
- Is this user the post owner?
- Is the post public before saving to collection?
- Is current password correct before changing?

```ts
// post.service.ts
export const deletePost = async (postId: string, userId: string) => {
  const post = await postRepository.findById(postId);
  if (!post) throw new Error('Post not found');
  if (post.authorId !== userId) throw new Error('Forbidden'); // ownership check
  await postRepository.delete(postId);
};
```

---

## 8. Edge Cases & Validations

| Scenario | Handling |
|----------|----------|
| User tries to edit someone else's post | Service checks `authorId === currentUserId` → 403 Forbidden |
| User saves same post twice | `@@unique([userId, postId])` in DB → 409 Conflict |
| User saves a private or draft post | Service checks `post.status === 'public'` before saving → 400 Bad Request |
| User changes password with wrong current password | bcrypt compare fails → 401 Unauthorized |
| User views private post of another user | Service checks status + ownership → 403 Forbidden |
| Post deleted while in someone's collection | `onDelete: Cascade` on Collection → auto removed |
| User deleted — their posts remain? | `onDelete: Cascade` on Post → posts auto deleted |
| Feed without pagination | `take` and `skip` enforced — max 10 per page |
| Unauthenticated request to protected route | Auth middleware blocks → 401 Unauthorized |
| Invalid post status value | Zod enum validation → 400 Bad Request |

---

## 9. Future Improvements

| Feature | Why |
|---------|-----|
| **Comments on posts** | User engagement |
| **Like / reaction system** | Post popularity tracking |
| **Tags / Categories** | Better content organization |
| **Full-text search** | PostgreSQL `tsvector` for searching posts by title or content |
| **Cursor-based pagination** | More efficient than offset for large feeds |
| **Redis feed cache** | Cache public feed, invalidate on new post |
| **Email verification on register** | Security improvement |
| **Refresh token** | Better JWT security (short-lived access token + long-lived refresh) |
| **Rate limiting** | Prevent API abuse using `express-rate-limit` |
| **Soft delete for posts** | Mark as deleted instead of removing, allow recovery |

---

*Document maintained by: Aman | github.com/Aman2975 | iaman.space*
