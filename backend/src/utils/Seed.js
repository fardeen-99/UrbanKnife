import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";

import { Product } from "../models/Product.model.js";
import config from "../config/config.js";

dotenv.config();

const sellerID = new mongoose.Types.ObjectId(
  "69ecc59a85714992f2c25706"
);

const sizesArray = ["XS", "S", "M", "L", "XL", "XXL"];

const colors = [
  "Black",
  "White",
  "Blue",
  "Gray",
  "Olive",
  "Brown",
  "Cream",
];

const materials = [
  "Cotton",
  "Denim",
  "Polyester",
  "Leather",
  "Wool",
];

const maleClothes = [
  "Oversized Shirt",
  "Cargo Pant",
  "Slim Fit Jeans",
  "Hoodie",
  "Casual T-Shirt",
];

const femaleClothes = [
  "Crop Top",
  "Oversized Hoodie",
  "Baggy Jeans",
  "Dress",
  "Korean Shirt",
];

const sneakerNames = [
  "Urban Sneakers",
  "Air Runner",
  "Street Shoes",
  "Classic Sneakers",
];

const menQueries = [
  "oversized hoodie men",
  "streetwear men",
  "cargo pants men",
  "minimal tshirt men",
  "urban fashion men",
  "baggy jeans men",
  "mens shirt fashion",
  "casual wear men",
];

const womenQueries = [
  "korean fashion women",
  "oversized hoodie women",
  "streetwear women",
  "baggy jeans women",
  "crop top fashion women",
  "casual outfit women",
];

const sneakerQueries = [
  "modern sneakers",
  "street sneakers",
  "white sneakers",
  "running shoes",
  "nike style sneakers",
];

const randomItem = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const shuffleArray = arr => {
  return arr.sort(() => Math.random() - 0.5);
};

const randomPrice = () => {
  return Math.floor(Math.random() * 4000) + 999;
};

const randomSizes = () => {
  return sizesArray.map(size => ({
    size,
    stock: Math.floor(Math.random() * 100) + 1,
  }));
};

const getImages = async (query, count = 50) => {
  try {

    const response = await axios.get(
      "https://api.pexels.com/v1/search",
      {
        params: {
          query,
          per_page: count,
          page: Math.floor(Math.random() * 20) + 1,
        },

        headers: {
          Authorization: config.pexel_api_key,
        },
      }
    );

    return shuffleArray(
      response.data.photos.map(photo => ({
        url: photo.src.large2x,
      }))
    );

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    return [];
  }
};

const createProduct = ({
  title,
  genre,
  clothType,
  images,
}) => {

  const shuffledImages = shuffleArray([...images]);

  const selectedImages = shuffledImages.slice(0, 4);

  return {

    title,

    description:
      `${title} premium quality ${randomItem(materials)} fashion product.`,

    price: {
      amount: randomPrice(),
      currency: "INR",
    },

    image: selectedImages,

    category: {
      clothType,
      genre,
    },

    color: randomItem(colors),

    material: randomItem(materials),

    sizes: randomSizes(),

    variation: [
      {
        color: randomItem(colors),

        material: randomItem(materials),

        images: shuffleArray([...images]).slice(0, 4),

        sizes: randomSizes(),
      },

      {
        color: randomItem(colors),

        material: randomItem(materials),

        images: shuffleArray([...images]).slice(0, 4),

        sizes: randomSizes(),
      },
    ],

    sellerID,
  };
};

export const seedProducts = async () => {

  try {

    console.log("Deleting old products...");

    await Product.deleteMany();

    console.log("Fetching Men Images...");

    const menImagePool = [];

    for (const query of menQueries) {

      const images = await getImages(query, 20);

      menImagePool.push(...images);
    }

    console.log("Fetching Women Images...");

    const womenImagePool = [];

    for (const query of womenQueries) {

      const images = await getImages(query, 20);

      womenImagePool.push(...images);
    }

    console.log("Fetching Sneaker Images...");

    const sneakerImagePool = [];

    for (const query of sneakerQueries) {

      const images = await getImages(query, 20);

      sneakerImagePool.push(...images);
    }

    let allProducts = [];

    // MEN PRODUCTS
    for (let i = 0; i < 50; i++) {

      const cloth = randomItem(maleClothes);

      const product = createProduct({
        title: `${cloth} ${i + 1}`,
        genre: "male",
        clothType: cloth,
        images: menImagePool,
      });

      allProducts.push(product);
    }

    // WOMEN PRODUCTS
    for (let i = 0; i < 50; i++) {

      const cloth = randomItem(femaleClothes);

      const product = createProduct({
        title: `${cloth} ${i + 1}`,
        genre: "female",
        clothType: cloth,
        images: womenImagePool,
      });

      allProducts.push(product);
    }

    // SNEAKERS
    for (let i = 0; i < 50; i++) {

      const shoe = randomItem(sneakerNames);

      const product = createProduct({
        title: `${shoe} ${i + 1}`,
        genre: "sneaker",
        clothType: "Sneakers",
        images: sneakerImagePool,
      });

      allProducts.push(product);
    }

    await Product.insertMany(allProducts);

    console.log(
      `${allProducts.length} Products Seeded Successfully`
    );

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};