import { ParsedMenuRuntime } from "@/schema/menu";

export const parsedMenuTR: ParsedMenuRuntime = {
  source: "vision-llm",
  locale: "tr",
  sections: [
    {
      id: "mains",
      name: { text: "MENÜ", original: "MENU" },
      entries: [
        {
          type: "item",
          item: {
            id: "veg-shrimp-salad",
            name: {
              text: "Karidesli Sebze Salatası",
              original: "Vegetable Salad with Marinated Shrimp",
            },
          },
        },
        {
          type: "item",
          item: {
            id: "moutabel",
            name: { text: "Mütebbel", original: "Moutabel" },
          },
        },
        // --- CHOICE GROUP: Main course selection ---
        {
          type: "choice",
          group: {
            id: "main-choice",
            title: {
              text: "Lütfen seçiminizi yapınız:",
              original: "please choose from our selection:",
            },
            min: 1,
            max: 1,
            options: [
              {
                id: "grilled-chicken",
                name: {
                  text: "Izgara Tavuk Göğüs",
                  original: "Grilled Chicken Breast",
                },
                description: {
                  text: "Domates soslu penne makarna, sote kabak, baharatlı tereyağı sos",
                  original:
                    "Penne with tomato sauce, sautéed zucchini, herbed butter",
                },
              },
              {
                id: "penne-tomato",
                name: {
                  text: "Domates Soslu Penne Makarna",
                  original: "Penne with Tomato Sauce",
                },
                description: {
                  text: "Sote kabak, baharatlı tereyağı sos",
                  original: "sautéed zucchini, herbed butter",
                },
              },
              {
                id: "local-basa",
                name: {
                  text: "Yerel seçenek: Sebzeli Basa Balığı",
                  original: "local option: BASA FISH WITH VEGETABLES",
                },
                description: {
                  text: "Buharda pilav",
                  original: "steamed rice",
                },
                allergens: ["balık"],
              },
            ],
          },
        },
        {
          type: "item",
          item: {
            id: "mango-mousse",
            name: { text: "Mango Mus", original: "Mango Mousse" },
          },
        },
      ],
    },
    {
      id: "before-landing",
      name: { text: "İnişten Önce", original: "before landing" },
      period: "before_landing",
      entries: [
        // --- CHOICE GROUP: before-landing selection (1 of N OR local option) ---
        {
          type: "choice",
          group: {
            id: "landing-choice",
            title: {
              text: "Lütfen seçiminizi yapınız:",
              original: "please choose from our selection:",
            },
            min: 1,
            max: 1,
            options: [
              {
                id: "fresh-fruit",
                name: {
                  text: "Taze Mevsim Meyveleri",
                  original: "Seasonal Fresh Fruit",
                },
              },
              {
                id: "assorted-cheese",
                name: { text: "Peynir Çeşitleri", original: "Assorted Cheese" },
              },
              {
                id: "scrambled-eggs",
                name: { text: "Çırpılmış Yumurta", original: "Scrambled Eggs" },
                description: {
                  text: "Maydanozlu kiraz domates, röşti patates",
                  original: "parsley cherry tomato, hash brown potatoes",
                },
              },
              // Local option variant
              {
                id: "local-fresh-fruits",
                name: {
                  text: "Yerel seçenek: Taze Mevsim Meyveleri",
                  original: "local option: SEASONAL FRESH FRUITS",
                },
              },
            ],
          },
        },
        // Fixed accompaniments/items
        {
          type: "item",
          item: {
            id: "pickled-cucumber",
            name: { text: "Salatalık Turşusu", original: "Pickled Cucumber" },
          },
        },
        {
          type: "item",
          item: {
            id: "congee-chicken",
            name: {
              text: "Tavuklu Pirinç Lapası",
              original: "Congee with Chicken",
            },
          },
        },
        {
          type: "item",
          item: {
            id: "bread-butter-jam",
            name: {
              text: "Tereyağı / Reçel, Ekmek",
              original: "butter / jam, bread",
            },
          },
        },
      ],
    },
  ],
  warnings: [
    "Bazı yemekler çalıştırma/iniş sırasında servis dışı olabilir.",
    "Tüm yemekler İslami hassasiyetlerle hazırlanır.",
  ],
  suggestions: ["Muebbet nedir?", "Hangi seçenekler vejeteryan?"],
};
