const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

const mockUsers = [
  { email: "testuser@example.com", password: "password123", userId: 123 },
  { email: "admin@admin.com", password: "admin123", userId: 1, isAdmin: true }
];

let properties = [
  {
    id: 1,
    title: "Modern Apartment in Downtown",
    description: "A beautiful modern apartment located in the heart of the city.",
    price: 1200,
    image: "/api/images/property1.jpg"
  },
  {
    id: 2,
    title: "Cozy Country House",
    description: "Enjoy the serenity of the countryside in this cozy house.",
    price: 850,
    image: "/api/images/property2.jpg"
  },
  {
    id: 3,
    title: "Luxury Villa with Pool",
    description: "A stunning villa with a private pool and breathtaking views.",
    price: 5000,
    image: "/api/images/property3.jpg"
  },
  {
    id: 4,
    title: "Spacious Loft in the City",
    description: "A modern, open-concept loft with expansive windows and city views.",
    price: 2500,
    image: "/api/images/property4.jpg"
  },
  {
    id: 5,
    title: "Beachfront Bungalow",
    description: "A charming bungalow right on the beach, perfect for a relaxing getaway.",
    price: 3000,
    image: "/api/images/property5.jpg"
  },
  {
    id: 6,
    title: "Mountain Retreat Cabin",
    description: "A cozy cabin in the mountains, ideal for a peaceful escape.",
    price: 2000,
    image: "/api/images/property6.jpg"
  },
  {
    id: 7,
    title: "Urban Penthouse with Skyline Views",
    description: "A luxurious penthouse offering sweeping views of the city skyline.",
    price: 4500,
    image: "/api/images/property7.jpg"
  },
  {
    id: 8,
    title: "Charming Cottage in the Forest",
    description: "A quaint cottage surrounded by nature, perfect for outdoor lovers.",
    price: 1500,
    image: "/api/images/property8.jpg"
  },
  {
    id: 9,
    title: "Minimalist Apartment with Modern Amenities",
    description: "A sleek, stylish apartment in a prime location, offering all modern conveniences.",
    price: 2200,
    image: "/api/images/property9.jpg"
  }
];

let userCarts = {};

app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const cart = userCarts[userId] || [];
  res.status(200).json(cart);
});

app.post('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const property = req.body;

  if (!userCarts[userId]) {
    userCarts[userId] = [];
  }

  const cart = userCarts[userId];
  if (!cart.find((item) => item.id === property.id)) {
    cart.push(property);
    res.status(201).json({ message: 'Property added to cart successfully.' });
  } else {
    res.status(400).json({ error: 'Property already exists in the cart.' });
  }
});

app.delete('/api/cart/:userId/:propertyId', (req, res) => {
  const { userId, propertyId } = req.params;

  if (userCarts[userId]) {
    userCarts[userId] = userCarts[userId].filter(
      (item) => item.id !== parseInt(propertyId)
    );
    res.status(200).json({ message: 'Property removed from cart.' });
  } else {
    res.status(404).json({ error: 'Cart not found.' });
  }
});

app.delete('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  userCarts[userId] = [];
  res.status(200).json({ message: 'Cart cleared successfully.' });
});

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;

  mockUsers.push({ email, password, userId: Date.now() });
  res.status(201).json({ message: "User registered successfully.", userId: Date.now() });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = mockUsers.find(user => user.email === email && user.password === password);

  if (user) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
    return res.status(200).json({
      message: "Login successful",
      token: token,
      userId: user.userId,
      isAdmin: user.isAdmin || false
    });
  } else {
    return res.status(401).json({ error: "Invalid email or password." });
  }
});

app.get("/api/verify", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing." });
  }

  res.status(200).json({ message: "Token is valid.", userId: 123 });
});

app.get("/api/properties", (req, res) => {
  res.status(200).json(properties);
});

app.get("/api/properties/:id", (req, res) => {
  const property = properties.find(p => p.id === parseInt(req.params.id));
  if (property) {
    res.status(200).json(property);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

app.post("/api/properties", (req, res) => {
  const { title, description, price, image } = req.body;
  const newProperty = {
    id: properties.length + 1,
    title,
    description,
    price,
    image
  };
  properties.push(newProperty);
  res.status(201).json({ message: "Property added successfully.", propertyId: newProperty.id });
});

app.put("/api/properties/:id", (req, res) => {
  const { title, description, price, image } = req.body;
  const property = properties.find(p => p.id === parseInt(req.params.id));
  if (property) {
    property.title = title;
    property.description = description;
    property.price = price;
    property.image = image;
    res.status(200).json({ message: "Property updated successfully." });
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

app.delete("/api/properties/:id", (req, res) => {
  const propertyIndex = properties.findIndex(p => p.id === parseInt(req.params.id));
  if (propertyIndex !== -1) {
    properties.splice(propertyIndex, 1);
    res.status(200).json({ message: "Property deleted successfully." });
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
