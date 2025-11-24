export type Stock = {
    symbol: string;
    name: string;
    price: number;
    change: number; // Percentage change
    imageUrl: string; // URL for the company logo or stock icon
    isFeatured?: boolean; // Optional: true if it's a featured stock
};
export const allStocks: Stock[] = [
    { symbol: "KOCH", name: "Koch Industries", price: 789.34, change: +12.45, imageUrl: "/logos/koch-industries.png", isFeatured: true },
    { symbol: "PBLX", name: "Publix Inc.", price: 178.90, change: +1.23, imageUrl: "/logos/Publix-Logo-700x394.png", isFeatured: true },
    { symbol: "ACHN", name: "Auchan Inc.", price: 223.45, change: +2.34, imageUrl: "/logos/Auchan-Logo-700x394.png", isFeatured: true },
    { symbol: "TRGT", name: "Target Corp.", price: 412.56, change: +0.89, imageUrl: "/logos/Target-Logo-700x394.png" },
    { symbol: "CAFR", name: "Carrefour Group.", price: 445.12, change: -5.67, imageUrl: "/logos/Carrefour-Logo-700x394.png" },
    { symbol: "WGRNS", name: "Walgreens Co.", price: 189.23, change: -2.10, imageUrl: "/logos/Walgreens-Logo-700x394.png" },
];