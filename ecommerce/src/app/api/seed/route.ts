import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const SAMPLE_ITEMS = [
    { category: "vinyls", name: "Abbey Road – The Beatles", desc: "Classic vinyl record", price: 34.99, seller: "VinylShop", image: "🎵", condition: "mint", age: "1969", rating: 0, number_of_reviewers: 0 },
    { category: "vinyls", name: "Dark Side of the Moon – Pink Floyd", desc: "Legendary progressive rock album", price: 29.99, seller: "VinylShop", image: "🎵", condition: "good", age: "1973", rating: 0, number_of_reviewers: 0 },
    { category: "vinyls", name: "Rumours – Fleetwood Mac", desc: "Timeless classic", price: 27.99, seller: "VinylShop", image: "🎵", condition: "mint", age: "1977", rating: 0, number_of_reviewers: 0 },
    { category: "antique", name: "Victorian Oak Writing Desk", desc: "Beautifully restored Victorian era desk", price: 1249.00, seller: "AntiqueHouse", image: "🪑", condition: "restored", age: "1880", material: "oak", rating: 0, number_of_reviewers: 0 },
    { category: "antique", name: "Art Deco Walnut Cabinet", desc: "Elegant walnut cabinet from the 1930s", price: 899.00, seller: "AntiqueHouse", image: "🪑", condition: "good", age: "1935", material: "walnut", rating: 0, number_of_reviewers: 0 },
    { category: "antique", name: "Georgian Mahogany Bookcase", desc: "Rare Georgian era bookcase", price: 1599.00, seller: "AntiqueHouse", image: "🪑", condition: "fair", age: "1790", material: "mahogany", rating: 0, number_of_reviewers: 0 },
    { category: "gps", name: "Garmin Forerunner 265", desc: "Advanced GPS running watch with AMOLED display", price: 449.99, seller: "TechGear", image: "⌚", condition: "new", battery: "13 days", rating: 0, number_of_reviewers: 0 },
    { category: "gps", name: "Polar Vantage V3", desc: "Premium multisport GPS watch", price: 499.99, seller: "TechGear", image: "⌚", condition: "new", battery: "8 days", rating: 0, number_of_reviewers: 0 },
    { category: "gps", name: "Suunto Race S", desc: "Lightweight GPS sport watch", price: 399.99, seller: "TechGear", image: "⌚", condition: "new", battery: "26 hours", rating: 0, number_of_reviewers: 0 },
    { category: "shoes", name: "Nike Pegasus 41", desc: "Versatile everyday running shoe", price: 129.99, seller: "RunFast", image: "👟", condition: "new", size: "42", material: "mesh", rating: 0, number_of_reviewers: 0 },
    { category: "shoes", name: "Adidas Ultraboost Light", desc: "Ultra responsive cushioning", price: 189.99, seller: "RunFast", image: "👟", condition: "new", size: "43", material: "primeknit", rating: 0, number_of_reviewers: 0 },
    { category: "shoes", name: "New Balance Fresh Foam X", desc: "Plush comfort for long runs", price: 159.99, seller: "RunFast", image: "👟", condition: "new", size: "41", material: "synthetic mesh", rating: 0, number_of_reviewers: 0 },
    { category: "tent", name: "MSR Hubba Hubba 2-Person", desc: "Ultralight backpacking tent", price: 479.99, seller: "CampWorld", image: "⛺", condition: "new", rating: 0, number_of_reviewers: 0 },
    { category: "tent", name: "REI Half Dome SL 3+", desc: "Spacious 3-season tent", price: 349.99, seller: "CampWorld", image: "⛺", condition: "new", rating: 0, number_of_reviewers: 0 },
    { category: "tent", name: "Big Agnes Copper Spur HV UL2", desc: "Award-winning ultralight tent", price: 449.99, seller: "CampWorld", image: "⛺", condition: "new", rating: 0, number_of_reviewers: 0 },
];

export async function GET() {
    const db = await getDb();

    // Seed admin user
    const adminExists = await db.collection("users").findOne({ username: "testadmin" });
    if (!adminExists) {
        const hashed = await bcrypt.hash("test", 10);
        await db.collection("users").insertOne({ username: "testadmin", email: "testadmin", password: hashed, role: "admin" });
    }

    // Seed items only if collection is empty
    const itemCount = await db.collection("items").countDocuments();
    if (itemCount === 0) {
        await db.collection("items").insertMany(SAMPLE_ITEMS);
        return NextResponse.json({ status: "ok", message: `Seeded ${SAMPLE_ITEMS.length} items and admin user` }, { status: 201 });
    }

    return NextResponse.json({ status: "ok", message: `Already seeded. ${itemCount} items exist.` });
}
