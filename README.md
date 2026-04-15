# 🎁 Gift Recommender — Хүүхдийн Бэлэг Зөвлөгч

> AI + RAG системд суурилсан хүүхдийн бэлэг санал болгох платформ.  
> Хүүхдийн нас, сонирхол, хөгжүүлэх чадварт тулгуурлан хамгийн тохиромжтой бэлэг, курс, туршлагыг санал болгоно.

🔗 **Live Demo:** [gift-recommender-delta.vercel.app](https://gift-recommender-delta.vercel.app)

---

## ✨ Features

- **AI-powered recommendation** — Groq LLM (llama-3.3-70b) ашиглан монгол хэлээр тайлбартай бэлгийн санал
- **Semantic search** — OpenAI embedding + pgvector ашиглан vector similarity search
- **RAG систем** — Local provider-уудын өгөгдөлд тулгуурлан хамааралтай бэлэг хайх
- **Provider dashboard** — Clerk auth ашиглан provider бүртгэл, бүтээгдэхүүн нэмэх
- **Age-based filtering** — Хүүхдийн насанд тохирсон бэлэг шүүх
- **Interest & skill matching** — Сонирхол болон хөгжүүлэх чадварт тулгуурлан тааруулах

---

## 🛠 Tech Stack

| Давхарга | Технологи |
|---|---|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Neon PostgreSQL, Drizzle ORM |
| Vector Search | pgvector, OpenAI text-embedding-3-small |
| AI | Groq API (llama-3.3-70b-versatile) |
| Auth | Clerk |
| Deploy | Vercel |

---

## 🏗 Architecture

```
User Input (age, interests, skills)
        ↓
OpenAI Embedding API
        ↓
pgvector Similarity Search (Neon PostgreSQL)
        ↓
Age Filter + Vector Ranking
        ↓
Groq LLM — Generate Explanation
        ↓
Recommendations + AI Explanation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL account
- OpenAI API key
- Groq API key
- Clerk account

### Installation

```bash
# Clone the repo
git clone https://github.com/dbaasanbayar/gift_recommender.git
cd gift_recommender

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
DATABASE_URL=your_neon_connection_string
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Database Setup

```bash
# Push schema to database
npm run db:push

# Seed mock providers
npm run db:seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
gift_recommender/
├── app/
│   ├── api/
│   │   ├── recommend/
│   │   │   └── route.ts      # AI recommendation endpoint
│   │   └── provider/
│   │       └── product/
│   │           └── route.ts  # Provider product endpoint
│   ├── provider/
│   │   └── page.tsx          # Provider dashboard
│   ├── sign-in/
│   ├── sign-up/
│   └── page.tsx              # Main page
├── db/
│   ├── index.ts              # Database connection
│   ├── schema.ts             # Drizzle schema
│   └── seed.ts               # Mock data seed
├── lib/
│   └── embeddings.ts         # OpenAI embedding utility
├── components/
│   └── ProviderDashboard.tsx
└── middleware.ts             # Clerk auth middleware
```

---

## 🔌 API Endpoints

### `POST /api/recommend`

Хүүхдийн нас, сонирхол, чадварт тулгуурлан бэлэг санал болгоно.

**Request:**
```json
{
  "age": 8,
  "interests": ["art", "technology"],
  "skills": ["creativity", "focus"]
}
```

**Response:**
```json
{
  "recommendations": [...],
  "explanation": "AI-generated explanation in Mongolian"
}
```

### `POST /api/provider/product`

Provider бүтээгдэхүүн нэмнэ. Clerk auth шаардана.

**Request:**
```json
{
  "clerkId": "user_xxx",
  "name": "Lego Technic Set",
  "type": "physical",
  "description": "...",
  "price": 85000,
  "ageMin": 7,
  "ageMax": 14,
  "interests": ["engineering"],
  "skills": ["problem_solving"]
}
```

---

## 📊 Database Schema

```
providers        — Mock provider products (seeded)
products         — Provider-submitted products
provider_users   — Authenticated providers (via Clerk)
```

---

## 🤖 How RAG Works

1. **Indexing** — Provider бүтээгдэхүүн бүрийг OpenAI embedding-ээр vector болгон Neon PostgreSQL-д хадгална
2. **Query** — Хэрэглэгчийн input-г embedding болгоно
3. **Retrieval** — pgvector cosine similarity ашиглан хамгийн ойр бүтээгдэхүүнийг хайна
4. **Generation** — Groq LLM олдсон бүтээгдэхүүнийг монгол хэлээр тайлбарлана

---

## 👤 Author

**Baasanbayar D.**  
Junior Fullstack Developer  
[GitHub](https://github.com/dbaasanbayar)

---

## 📄 License

MIT
