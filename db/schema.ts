import { pgTable, text, integer, timestamp, vector } from "drizzle-orm/pg-core";

export const providers = pgTable("providers", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:        text("name").notNull(),
  type:        text("type").notNull(),
  description: text("description").notNull(),
  price:       integer("price").notNull(),
  ageMin:      integer("age_min").notNull(),
  ageMax:      integer("age_max").notNull(),
  interests:   text("interests").array().notNull(),
  skills:      text("skills").array().notNull(),
  imageUrl:    text("image_url"),
  embedding:   vector("embedding", {dimensions: 768}), 
  createdAt:   timestamp("created_at").defaultNow(),
});

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;

