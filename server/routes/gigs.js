// routes/gigs.js
import express from "express";
const router = express.Router();

const gigs = [
  {
    _id: "1",
    title: "Build your responsive website",
    description: "HTML, CSS, JS, React work",
    price: 2000,
    category: "web-development",
    createdAt: new Date(),
    image: "https://via.placeholder.com/300x200"
  },
  {
    _id: "2",
    title: "Design awesome logo",
    description: "Professional logo design for startups",
    price: 1500,
    category: "graphic-design",
    createdAt: new Date(),
    image: "https://via.placeholder.com/300x200"
  }
  // add more dummy gigs as needed
];

router.get("/", (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = gigs.filter((g) => g.category === category);
    res.json(filtered);
  } else {
    res.json(gigs);
  }
});

export default router;
