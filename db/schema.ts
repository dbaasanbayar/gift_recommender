import { integer, pgTable, text, timestamp, vector } from "drizzle-orm/pg-core";

// Бизнес entity — "DGL Music Shop"
export const providers = pgTable("providers", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessName: text("business_name").notNull(),
  email:        text("email").notNull(),
  phone:        text("phone"),
  description:  text("description"),
  approved:     integer("approved").default(0), // 0=pending, 1=approved, -1=rejected
  createdAt:    timestamp("created_at").defaultNow(),
});

// Бизнесийн ажилтнууд — хэн нэвтэрч байна
export const providerMembers = pgTable("provider_members", {
  id:         text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  providerId: text("provider_id").notNull().references(() => providers.id),
  clerkId:    text("clerk_id").notNull().unique(),
  role:       text("role").notNull().default("owner"), // "owner" | "staff"
  createdAt:  timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  providerId:  text("provider_id").notNull().references(() => providers.id),
  addedBy:     text("added_by").references(() => providerMembers.id),
  name:        text("name").notNull(),
  type:        text("type").notNull(),
  description: text("description").notNull(),
  price:       integer("price").notNull(),
  ageMin:      integer("age_min").notNull(),
  ageMax:      integer("age_max").notNull(),
  interests:   text("interests").array().notNull(),
  skills:      text("skills").array().notNull(),
  embedding:   vector("embedding", { dimensions: 1536 }),
  approved:    integer("approved").default(0),
  createdAt:   timestamp("created_at").defaultNow(),
});

export type Provider = typeof providers.$inferSelect;
export type ProviderMember = typeof providerMembers.$inferSelect;
export type Product = typeof products.$inferSelect;
