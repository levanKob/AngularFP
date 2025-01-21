const express = require("express");
const fs = require("fs");
const cors = require("cors");  // Import the CORS package
const app = express();
const PORT = 3000;

// Enable CORS for all origins (or you can specify only localhost:4200 for more security)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Mock user data for login
const mockUsers = [
  { email: "testuser@example.com", password: "password123", userId: 123 }
];

// Register endpoint
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;

  // You would typically save this to a database, but here we'll just respond with success
  mockUsers.push({ email, password, userId: Date.now() });  // Add a new user with a unique userId
  res.status(201).json({ message: "User registered successfully.", userId: Date.now() });
});

// Login endpoint with email-based authentication
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists and the password is correct
  const user = mockUsers.find(user => user.email === email && user.password === password);

  if (user) {
    // Mocking a JWT token (you can replace this with an actual JWT token generation method)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; 
    return res.status(200).json({
      message: "Login successful",
      token: token,
      userId: user.userId
    });
  } else {
    return res.status(401).json({ error: "Invalid email or password." });
  }
});

// Verify endpoint to check the validity of the token
app.get("/api/verify", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing." });
  }

  // In a real scenario, you would decode and verify the token here
  res.status(200).json({ message: "Token is valid.", userId: 123 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
