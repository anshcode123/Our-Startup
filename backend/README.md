# Backend (`backend/`)

Standalone Node.js + Express.js + PostgreSQL + Prisma ORM + Cloudinary backend for the Anshul.dev Product CMS & Admin Portal.

## Structure

```text
backend/
├── server.js                    # Standalone Express API server
├── routes/
│   ├── auth.js                  # /api/auth/* routes
│   └── products.js              # /api/products/* & /api/upload routes
├── controllers/
│   ├── authController.js        # Login, logout, session check, rate limiting
│   └── productController.js     # Product CRUD, publish/unpublish, Cloudinary upload
├── middleware/
│   └── authMiddleware.js        # JWT HTTP-only cookie verification middleware
├── lib/
│   ├── auth.js                  # bcrypt hashing, JWT sign/verify, cookie builder, rate limiter
│   ├── cloudinary.js            # Cloudinary upload stream & asset deletion
│   ├── prisma.js                # Prisma Client singleton
│   └── validation.js            # Strict input, URL, slug, and magic-byte image validation
├── prisma/
│   ├── schema.prisma            # PostgreSQL schema (AdminUser, Product, ProductStatus)
│   ├── seed.js                  # Admin user initialization script (no fake products)
│   └── migrations/              # Prisma SQL migrations
├── .env.example                 # Environment variable template (no real secrets)
└── package.json                 # Backend package manifest
```

## Commands

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init_product_cms
npm run prisma:seed
npm run dev
```