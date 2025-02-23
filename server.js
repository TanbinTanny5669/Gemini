require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// **MySQL Connection**
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "user_auth"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// **User Registration**
app.post("/registration", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (result.length > 0) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
            [first_name, last_name, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error" });
                res.json({ message: "User registered successfully" });
            }
        );
    });
});

// **Login User and Log Activity**
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        // **Insert login record into login_logs table**
        db.query("INSERT INTO login_logs (user_id, email) VALUES (?, ?)", 
            [user.id, user.email], 
            (err) => {
                if (err) return res.status(500).json({ message: "Failed to log login attempt" });
                res.json({ message: "Login successful", user: { id: user.id, first_name: user.first_name, email: user.email } });
            }
        );
    });
});

// **Start Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


/* require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "user_auth"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// **Register User**
app.post("/registration", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Check if email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (result.length > 0) return res.status(400).json({ message: "Email already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into DB
        db.query("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
            [first_name, last_name, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error" });
                res.json({ message: "User registered successfully" });
            }
        );
    });
});

// **Login User**
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (result.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        res.json({ message: "Login successful", user: { id: user.id, first_name: user.first_name, email: user.email } });
    });
});

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
 */
