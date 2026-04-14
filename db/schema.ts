import { integer, pgTable, text, timestamp, vector } from "drizzle-orm/pg-core";


export const providerUsers = pgTable("provider_users", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId:     text("clerk_id").notNull().unique(),
  name:        text("name").notNull(),
  email:       text("email").notNull(),
  phone:       text("phone"),
  createdAt:   timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  providerId:   text("provider_id").notNull().references(() => providerUsers.id),
  name:         text("name").notNull(),
  type:         text("type").notNull(), // "physical" | "course" | "experience"
  description:  text("description").notNull(),
  price:        integer("price").notNull(),
  ageMin:       integer("age_min").notNull(),
  ageMax:       integer("age_max").notNull(),
  interests:    text("interests").array().notNull(),
  skills:       text("skills").array().notNull(),
  embedding:   vector("embedding", {dimensions: 1536}),
  approved:     integer("approved").default(0), // 0=pending, 1=approved
  createdAt:    timestamp("created_at").defaultNow(),
});

export type ProviderUser = typeof providerUsers.$inferSelect;
export type Product = typeof products.$inferSelect;

