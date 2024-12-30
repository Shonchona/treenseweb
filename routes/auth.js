const express = require("express");
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

// Supabase setup
const supabaseUrl = "https://zjvbmahavecgovtgjkch.supabase.co"; // Replace with your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdmJtYWhhdmVjZ292dGdqa2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMDM0MDQsImV4cCI6MjA0ODY3OTQwNH0.s6D59MWDEeEAKUnAco7_RSoLjbkRbivqhJaMmVpttpQ"; // Replace with your API Key
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * User Signup Route
 */
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data, error } = await supabase.from("users").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

/**
 * User Login Route
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// //fetching classification
// router.get("/classifications", async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from("plant_classifications")
//       .select("*");
//     if (error) {
//       throw error;
//     }
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching classifications", error);
//     res.status(500).send("Error fetching classifications");
//   }
// });

// //fetch the summary for overview
// router.get("/summary", async (req, res) => {
//   try {
//     const { data: totalCountData, error: totalCountError } = await supabase
//       .from("plant_classifications")
//       .select("*", { count: "exact" });
//     const { data: healthyCountData, error: healthyCountError } = await supabase
//       .from("plant_classifications")
//       .select("*", { count: "exact" })
//       .eq("classification", "Healthy");
//     const { data: unhealthyCountData, error: unhealthyCountError } =
//       await supabase
//         .from("plant_classifications")
//         .select("*", { count: "exact" })
//         .eq("classification", "Unhealthy");
//     if (totalCountError || healthyCountError || unhealthyCountError) {
//       throw new Error("Error fetching summary data");
//     }
//     const summary = {
//       total: totalCountData.length,
//       healthy: healthyCountData.length,
//       unhealthy: unhealthyCountData.length,
//     };
//     res.json(summary);
//   } catch (error) {
//     console.error("Error fetching summary", error);
//     res.status(500).send("Error fetching summary");
//   }
// });

router.get("/classifications", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plant_classifications")
      .select("*");
    if (error) {
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching classifications", error);
    res.status(500).send("Error fetching classifications");
  }
});
router.get("/summary", async (req, res) => {
  try {
    const { data: totalCountData, error: totalCountError } = await supabase
      .from("plant_classifications")
      .select("*", { count: "exact" });
    const { data: healthyCountData, error: healthyCountError } = await supabase
      .from("plant_classifications")
      .select("*", { count: "exact" })
      .eq("classification", "Healthy");
    const { data: unhealthyCountData, error: unhealthyCountError } =
      await supabase
        .from("plant_classifications")
        .select("*", { count: "exact" })
        .eq("classification", "Unhealthy");
    if (totalCountError || healthyCountError || unhealthyCountError) {
      throw new Error("Error fetching summary data");
    }
    const summary = {
      total: totalCountData.length,
      healthy: healthyCountData.length,
      unhealthy: unhealthyCountData.length,
    };
    res.json(summary);
  } catch (error) {
    console.error("Error fetching summary", error);
    res.status(500).send("Error fetching summary");
  }
});

// profile settings
router.post("/update-profile", async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated and the userId is in the request
  
  try {
    // Update user profile in Supabase
    const { data, error } = await supabase
      .from("users")
      .update({ first_name: username, email: email })
      .eq("id", userId);

    if (error) throw error;

    res.status(200).json({ message: "Profile updated successfully", data });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

router.post("/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated and the userId is in the request

  try {
    // Fetch the user's current hashed password from Supabase
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("password")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;

    // Compare current password with the stored password hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const { data, error } = await supabase
      .from("users")
      .update({ password: hashedNewPassword })
      .eq("id", userId);

    if (error) throw error;

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password", error: err.message });
  }
});

router.delete("/delete-account", async (req, res) => {
  const userId = req.user.id; // Assuming the user is authenticated and the userId is in the request

  try {
    // Delete user account from Supabase
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) throw error;

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting account", error: err.message });
  }
});

// Route to get user profile info
router.get("/profile", async (req, res) => {
  const userId = req.user.id; // Assuming the user is authenticated and the userId is in the request

  try {
    // Fetch user profile from Supabase based on userId
    const { data: user, error } = await supabase
      .from("users")
      .select("first_name, last_name, email")  // Select the necessary columns
      .eq("id", userId)  // Ensure that the query is filtered by the authenticated user's ID
      .single();  // Use single to return a single row, since the ID is unique

    if (error) {
      throw error;
    }

    // Send the user data in the response
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user profile", error: err.message });
  }
});



module.exports = router;
