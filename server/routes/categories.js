// routes/categories.js
import express from 'express';
const router = express.Router();
import {
  getAllCategories,
  getCategoryByIdentifier
} from '../controllers/categoryController.js';

// Static categories
const categories = [
  { id: 1, slug: "web-development", name: "Web Development" },
  { id: 2, slug: "graphic-design", name: "Graphic Design" },
  { id: 3, slug: "marketing", name: "Marketing" },
  { id: 4, slug: "writing", name: "Writing" },
  { id: 5, slug: "ai-ml", name: "AI/ML" },
];


// Get all categories
router.get("/", (req, res) => {
  res.json(categories);
});

// ✅ Get a single category by ID or slug
router.get("/:identifier", (req, res) => {
  const { identifier } = req.params;
  

  // Try finding by slug first, then fallback to numeric ID
  const category = categories.find(
    (cat) =>
      cat.slug === identifier || cat.id === Number(identifier)
  );

  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: "Category not found" });
  }
});

router.get("/", getAllCategories);
router.get("/:identifier", getCategoryByIdentifier);

export default router;
