import "dotenv/config";
import { db } from "@/db";
import { products, providers, providerMembers } from "@/db/schema";
import { getEmbedding } from "@/lib/embeddings";

// interests and skills MUST use same values as page.tsx INTERESTS/SKILLS
// so product embeddings align with user query embeddings in RAG search
const data = [
  {
    name:        "Lego Technic Set",
    type:        "physical",
    description: "Инженерчлэл, логик сэтгэлгээг хөгжүүлэх Lego багц",
    price:       85000,
    ageMin:      7,
    ageMax:      14,
    interests:   ["technology", "science"],
    skills:      ["logic"],
  },
  {
    name:        "Уран зургийн иж бүрдэл",
    type:        "physical",
    description: "Мэргэжлийн түвшний будаг, бийр, даавуу",
    price:       45000,
    ageMin:      5,
    ageMax:      15,
    interests:   ["art"],
    skills:      ["creative"],
  },
  {
    name:        "Хүүхдийн кодинг курс",
    type:        "course",
    description: "Scratch ашиглан программчлалын үндэс сурах 8 долоо хоногийн курс",
    price:       120000,
    ageMin:      8,
    ageMax:      14,
    interests:   ["technology", "science"],
    skills:      ["logic"],
  },
  {
    name:        "Хөгжмийн хичээл — гитар",
    type:        "course",
    description: "1 сарын гитарын хувийн хичээл, багаж орно",
    price:       150000,
    ageMin:      7,
    ageMax:      16,
    interests:   ["music", "art"],
    skills:      ["patience"],
  },
  {
    name:        "Робот угсрах workshop",
    type:        "experience",
    description: "Нэг өдрийн робот угсрах, програмчлах туршлага",
    price:       65000,
    ageMin:      9,
    ageMax:      15,
    interests:   ["technology", "science"],
    skills:      ["teamwork"],
  },
  {
    name:        "Хоол хийх хүүхдийн курс",
    type:        "experience",
    description: "4 цагийн хоол хийх тайван, хөгжилтэй туршлага",
    price:       55000,
    ageMin:      6,
    ageMax:      14,
    interests:   ["cooking"],
    skills:      ["patience"],
  },
  {
    name:        "Шатарны иж бүрдэл + курс",
    type:        "physical",
    description: "Мэргэжлийн шатрын тоглоом + онлайн хичээлийн эрх",
    price:       75000,
    ageMin:      6,
    ageMax:      16,
    interests:   ["science"],
    skills:      ["logic"],
  },
  {
    name:        "Уншлагын иж бүрдэл",
    type:        "physical",
    description: "Насанд тохирсон 5 номын багц + уншлагын гэрэл",
    price:       60000,
    ageMin:      7,
    ageMax:      15,
    interests:   ["art", "science"],
    skills:      ["focus"],
  },
  {
    name:        "Хүүхдийн зураг авалтын курс",
    type:        "course",
    description: "Гар утасны камер ашиглан зураг авалт сурах 4 долоо хоногийн курс",
    price:       90000,
    ageMin:      10,
    ageMax:      16,
    interests:   ["art", "technology"],
    skills:      ["creative"],
  },
  {
    name:        "Дүрслэх урлагийн workshop",
    type:        "experience",
    description: "Бүтэн өдрийн скульптур, бүтээлч урлагийн туршлага",
    price:       70000,
    ageMin:      6,
    ageMax:      14,
    interests:   ["art"],
    skills:      ["creative"],
  },
  {
    name:        "Боксын сургалт",
    type:        "physical",
    description: "1 сарын боксын сургалт",
    price:       100000,
    ageMin:      3,
    ageMax:      16,
    interests:   ["sport"],
    skills:      ["patience"],
  },
];

async function main() {
  console.log("Seed started...");

  // Seed provider үүсгэнэ
  const existing = await db.select().from(providers).limit(1);
  let providerId: string;

  if (existing.length > 0) {
    providerId = existing[0].id;
  } else {
    const inserted = await db
      .insert(providers)
      .values({
        businessName: "Seed Provider",
        email: "seed@giftrecommender.mn",
        approved: 1,
      })
      .returning();
    providerId = inserted[0].id;

    await db.insert(providerMembers).values({
      providerId,
      clerkId: "seed_provider",
      role: "owner",
    });
  }

  await db.delete(products);

  for (const item of data) {
    // Format mirrors user query in /api/recommend for aligned vector space
    const embeddingText = `
      ${item.ageMin}-${item.ageMax} настай хүүхэд.
      Сонирхол: ${item.interests.join(", ")}.
      Хөгжүүлэх чадвар: ${item.skills.join(", ")}.
      ${item.name}. ${item.description}.
    `.trim();
    const embedding = await getEmbedding(embeddingText);

    await db.insert(products).values({
      ...item,
      providerId,
      embedding,
      approved: 1,
    });
    console.log(`✓ ${item.name}`);
  }

  console.log("All finished");
  process.exit(0);
}

main().catch(console.error);
