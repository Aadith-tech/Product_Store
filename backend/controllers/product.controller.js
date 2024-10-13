import Product from "../models/product.model.js";
import mongoose from "mongoose";
export const getProducts = async (req, res) => {
  try {
    const product = await Product.find({});
    return res.status(200).json({ success: true, message: product });
  } catch (err) {
    console.log(`Error in fetching product ${err.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body;

  if (!product.name || !product.price || !product.image) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields",
    });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    return res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    console.error(`Error in creating Product: ${err.message}`);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Product not found" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (err) {
    console.error(`Error in updating Product: ${err.message}`);
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Product not found" });
  }

  try {
    await Product.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting Product: ${err.message}`);
    return res.status(500).json({ success: false, message: "server error" });
  }
};
