import { getJson } from "serpapi";

export type ShoppingProduct = {
  title: string;
  price: string;
  source: string;
  link: string;
  thumbnail: string;
};

export async function searchGoogleShopping(
  age: number,
  interests: string[],
  skills: string[]
): Promise<ShoppingProduct[]> {
  const query = `gift for ${age} year old child ${interests.slice(0, 2).join(" ")}`;

  const results = await getJson({
    engine: "google_shopping",
    q: query,
    api_key: process.env.SERPAPI_KEY,
    num: 10,
  });

  const items = results.shopping_results ?? [];

  return items.slice(0, 10).map((item: any) => ({
    title: item.title,
    price: item.price ?? "Үнэ байхгүй",
    source: item.source ?? "",
    link: item.product_link ?? item.link ?? "",
    thumbnail: item.thumbnail ?? "",
  }));
}
