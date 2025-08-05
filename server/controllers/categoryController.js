// controllers/categoryController.js
import Category from '../models/Category.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get category by slug or ID
export const getCategoryByIdentifier = async (req, res) => {
  const { identifier } = req.params;
  try {
    const category = await Category.findOne({
      $or: [
        { slug: identifier },
        { _id: identifier }
      ]
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
