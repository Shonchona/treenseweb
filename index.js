const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();  // Load environment variables

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Supabase initialization using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
