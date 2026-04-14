// import { db } from "@/db";
// import { products } from "@/db/schema";
// import { getEmbedding } from "@/lib/embeddings";

const data = [
  {
    name:        "Lego Technic Set",
    type:        "physical",
    description: "Инженерчлэл, логик сэтгэлгээг хөгжүүлэх Lego багц",
    price:       85000,
    ageMin:      7,
    ageMax:      14,
    interests:   ["engineering", "building", "science"],
    skills:      ["problem_solving", "creativity", "focus"],
  },
  {
    name:        "Уран зургийн иж бүрдэл",
    type:        "physical",
    description: "Мэргэжлийн түвшний будаг, бийр, даавуу",
    price:       45000,
    ageMin:      5,
    ageMax:      15,
    interests:   ["art", "drawing", "creativity"],
    skills:      ["creativity", "patience", "expression"],
  },
  {
    name:        "Хүүхдийн кодинг курс",
    type:        "course",
    description: "Scratch ашиглан программчлалын үндэс сурах 8 долоо хоногийн курс",
    price:       120000,
    ageMin:      8,
    ageMax:      14,
    interests:   ["technology", "gaming", "science"],
    skills:      ["problem_solving", "logic", "creativity"],
  },
  {
    name:        "Хөгжмийн хичээл — гитар",
    type:        "course",
    description: "1 сарын гитарын хувийн хичээл, багаж орно",
    price:       150000,
    ageMin:      7,
    ageMax:      16,
    interests:   ["music", "art", "performance"],
    skills:      ["patience", "creativity", "discipline"],
  },
  {
    name:        "Робот угсрах workshop",
    type:        "experience",
    description: "Нэг өдрийн робот угсрах, програмчлах туршлага",
    price:       65000,
    ageMin:      9,
    ageMax:      15,
    interests:   ["engineering", "technology", "science"],
    skills:      ["problem_solving", "teamwork", "logic"],
  },
  {
    name:        "Хоол хийх хүүхдийн курс",
    type:        "experience",
    description: "4 цагийн хоол хийх тайван, хөгжилтэй туршлага",
    price:       55000,
    ageMin:      6,
    ageMax:      14,
    interests:   ["cooking", "creativity", "science"],
    skills:      ["patience", "creativity", "focus"],
  },
  {
    name:        "Шатарны иж бүрдэл + курс",
    type:        "physical",
    description: "Мэргэжлийн шатрын тоглоом + онлайн хичээлийн эрх",
    price:       75000,
    ageMin:      6,
    ageMax:      16,
    interests:   ["strategy", "games", "science"],
    skills:      ["logic", "focus", "patience"],
  },
  {
    name:        "Уншлагын иж бүрдэл",
    type:        "physical",
    description: "Насанд тохирсон 5 номын багц + уншлагын гэрэл",
    price:       60000,
    ageMin:      7,
    ageMax:      15,
    interests:   ["reading", "learning", "creativity"],
    skills:      ["focus", "imagination", "language"],
  },
  {
    name:        "Хүүхдийн зураг авалтын курс",
    type:        "course",
    description: "Гар утасны камер ашиглан зураг авалт сурах 4 долоо хоногийн курс",
    price:       90000,
    ageMin:      10,
    ageMax:      16,
    interests:   ["art", "technology", "creativity"],
    skills:      ["creativity", "patience", "expression"],
  },
  {
    name:        "Дүрслэх урлагийн workshop",
    type:        "experience",
    description: "Бүтэн өдрийн скульптур, бүтээлч урлагийн туршлага",
    price:       70000,
    ageMin:      6,
    ageMax:      14,
    interests:   ["art", "building", "creativity"],
    skills:      ["creativity", "patience", "expression"],
  },
]

// async function main() {
//     console.log("Seed started...");

//     await db.delete(products);

//     for (const item of data) {
//       const embeddingText = `
//         ${item.name}. ${item.description}. 
//         Interests: ${item.interests.join(", ")}. 
//         Skills: ${item.skills.join(", ")}.
//       `;
//       const embedding = await getEmbedding(embeddingText);

//       await db.insert(products).values({...item, embedding});
//       console.log(`${item.name}`);
//     }
    
//     console.log("All finished");
//     process.exit(0);
// };

// main().catch(console.error);