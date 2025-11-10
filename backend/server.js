require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path"); // For serving static files
const multer = require("multer");
const { Pool } = require("pg");
const authenticateToken = require("./middleware/authenticateToken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { Parser } = require("json2csv");

const cron = require("node-cron");
const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 5000;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Changed to 587 for better deliverability
  secure: false, // false for 587
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Make sure this is an App Password, not regular password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//app.use("/certificates", express.static(path.join(__dirname, "certificates")));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Check database connection
pool
  .connect()
  .then(() => console.log(" Connected to PostgreSQL"))
  .catch((err) => console.error(" Database connection error:", err));

// 📌 Get all branches
app.get("/branches", async (req, res) => {
  try {
    const result = await pool.query("SELECT branch_id, name FROM branches");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password, branch_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = "student";
  const code = Math.floor(100000 + Math.random() * 900000);

  try {
    // Check if email already exists BEFORE inserting
    const existingUser = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message:
          "This email is already registered. Please use a different email or try logging in.",
      });
    }

    await pool.query(
      "INSERT INTO users (name, email, password, role, branch_id, is_verified) VALUES ($1, $2, $3, $4, $5, $6)",
      [name, email, hashedPassword, role, branch_id, false]
    );

    await pool.query(
      "INSERT INTO verification_codes (email, code) VALUES ($1, $2)",
      [email, code]
    );

    const mailOptions = {
      from: `"First Safety Driving School" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Account Verification Code - First Safety Driving School",
      text: `Hello ${name},

Thank you for registering with First Safety Driving School.

Your verification code is: ${code}

Please enter this code in the verification form to complete your registration.

This code will expire in 10 minutes for security purposes.

If you did not create an account, please disregard this message.

Best regards,
First Safety Driving School Team`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Account Verification</h2>
            
            <p style="color: #374151; font-size: 16px;">Hello ${name},</p>
            
            <p style="color: #374151; font-size: 16px;">
              Thank you for registering with First Safety Driving School.
            </p>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">Your verification code is:</p>
              <p style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; margin: 0;">${code}</p>
            </div>
            
            <p style="color: #374151; font-size: 16px;">
              Please enter this code in the verification form to complete your registration.
            </p>
            
            <p style="color: #6b7280; font-size: 14px;">
              This code will expire in 10 minutes for security purposes.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #6b7280; font-size: 14px;">
              If you did not create an account, please disregard this message.
            </p>
            
            <p style="color: #374151; font-size: 16px;">
              Best regards,<br>
              <strong>First Safety Driving School Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res
          .status(500)
          .json({ message: "Error sending verification email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({
          message:
            "Registration successful! Please check your email for the verification code. Don't forget to check your spam folder if you don't see it in your inbox.",
        });
      }
    });
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL unique violation (backup check)
      return res.status(400).json({
        message:
          "This email is already registered. Please use a different email or try logging in.",
      });
    }
    console.error("Database error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});
// Verify
app.post("/verify", async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM verification_codes WHERE email=$1 AND code=$2",
      [email, code]
    );

    if (result.rows.length > 0) {
      await pool.query("UPDATE users SET is_verified=true WHERE email=$1", [
        email,
      ]);
      await pool.query("DELETE FROM verification_codes WHERE email=$1", [
        email,
      ]); // optional cleanup
      res.json({ message: "Account verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid verification code" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Updated login endpoint with verification check
app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    let result;
    const isEmail = identifier.includes("@");

    if (isEmail) {
      result = await pool.query("SELECT * FROM users WHERE email = $1", [
        identifier,
      ]);
    } else {
      result = await pool.query("SELECT * FROM users WHERE username = $1", [
        identifier,
      ]);
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // ✅ CHECK IF USER IS VERIFIED (especially for students)
    if (user.role === "student" && !user.is_verified) {
      return res.status(400).json({
        error: "Please verify your email first before logging in.",
        type: "unverified",
        email: user.email,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Create token with branch_id
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
        branch_id: user.branch_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch_id: user.branch_id,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Updated check-user endpoint to include verification status
app.post("/check-user", async (req, res) => {
  const { identifier } = req.body;

  try {
    let result;
    const isEmail = identifier.includes("@");

    if (isEmail) {
      result = await pool.query(
        "SELECT role, is_verified, email FROM users WHERE email = $1",
        [identifier]
      );
    } else {
      result = await pool.query(
        "SELECT role, is_verified, email FROM users WHERE username = $1",
        [identifier]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    return res.json({
      role: user.role,
      is_verified: user.is_verified,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Add resend verification code endpoint
app.post("/resend-code", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists and is not verified
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND is_verified = false",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        error: "User not found or already verified",
      });
    }

    const user = userResult.rows[0];
    const code = Math.floor(100000 + Math.random() * 900000);

    // Delete existing verification codes for this email
    await pool.query("DELETE FROM verification_codes WHERE email = $1", [
      email,
    ]);

    // Insert new verification code
    await pool.query(
      "INSERT INTO verification_codes (email, code) VALUES ($1, $2)",
      [email, code]
    );

    // Send email with new code
    const mailOptions = {
      from: `"First Safety Driving School" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "New Verification Code - First Safety Driving School",
      text: `Hello ${user.name},

Here is your new verification code: ${code}

This code will expire in 10 minutes.

Best regards,
First Safety Driving School Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Verification Code</h2>
            
            <p style="color: #374151; font-size: 16px;">Hello ${user.name},</p>
            
            <p style="color: #374151; font-size: 16px;">
              Here is your new verification code:
            </p>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <p style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; margin: 0;">${code}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              This code will expire in 10 minutes for security purposes.
            </p>
            
            <p style="color: #374151; font-size: 16px;">
              Best regards,<br>
              <strong>First Safety Driving School Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res
          .status(500)
          .json({ error: "Error sending verification email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "New verification code sent successfully!" });
      }
    });
  } catch (error) {
    console.error("Resend code error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all courses (with optional branch filter)
app.get("/courses", async (req, res) => {
  try {
    const { branch_id, include_unavailable } = req.query;

    let query = `
      SELECT c.*, b.name as branch_name 
      FROM courses c
      LEFT JOIN branches b ON c.branch_id = b.branch_id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Filter by branch if specified
    if (branch_id) {
      query += ` AND c.branch_id = $${paramCount}`;
      params.push(branch_id);
      paramCount++;
    }

    // Filter by availability
    // Default behavior: only show available courses (is_available = true OR is_available IS NULL for backward compatibility)
    if (include_unavailable === "true") {
      // Show ALL courses (available and unavailable)
      // No filter needed
    } else {
      // Only show available courses
      query += ` AND (c.is_available = true OR c.is_available IS NULL)`;
    }

    query += " ORDER BY c.course_id DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Get student profile with branch info
app.get("/api/student-profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.branch_id, b.name as branch_name
       FROM users u
       LEFT JOIN branches b ON u.branch_id = b.branch_id
       WHERE u.user_id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST - Add new course
app.post("/courses", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      codeName,
      type,
      mode,
      description,
      price,
      branch_id,
      vehicle_category, // ✅ Added
      required_schedules,
      schedule_config,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query(
      `INSERT INTO courses (
        name, codename, type, mode, description, price, image, branch_id,
        vehicle_category, required_schedules, schedule_config
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        name,
        codeName,
        type,
        mode,
        description,
        price,
        imagePath,
        branch_id,
        vehicle_category || null,
        required_schedules || 1,
        schedule_config ||
          JSON.stringify([{ day: 1, hours: 4, time: "flexible" }]),
        true,
      ]
    );

    res.json({ message: "Course added!", imageUrl: imagePath });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
});

// PATCH - Toggle course availability
app.patch("/courses/:id/availability", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    // Check if course exists
    const course = await pool.query(
      "SELECT * FROM courses WHERE course_id = $1",
      [id]
    );

    if (!course.rows.length) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Update availability status
    await pool.query(
      "UPDATE courses SET is_available = $1 WHERE course_id = $2",
      [is_available, id]
    );

    const status = is_available ? "available" : "unavailable";
    res.json({
      message: `Course marked as ${status}!`,
      is_available,
    });
  } catch (error) {
    console.error("Error updating course availability:", error);
    res.status(500).json({ error: "Failed to update course availability" });
  }
});

// PUT -
app.put("/courses/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      codeName,
      type,
      mode,
      description,
      price,
      branch_id,
      vehicle_category,
      required_schedules,
      schedule_config,
    } = req.body;

    // Get current course data
    const course = await pool.query(
      "SELECT * FROM courses WHERE course_id = $1",
      [id]
    );

    if (!course.rows.length) {
      return res.status(404).json({ error: "Course not found" });
    }

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : course.rows[0].image;

    await pool.query(
      `UPDATE courses 
       SET name=$1, codename=$2, type=$3, mode=$4, description=$5, 
           price=$6, image=$7, branch_id=$8,
           vehicle_category=$9, required_schedules=$10, schedule_config=$11
       WHERE course_id=$12`,
      [
        name,
        codeName,
        type,
        mode,
        description,
        price,
        imagePath,
        branch_id,
        vehicle_category || null,
        required_schedules || 1,
        schedule_config ||
          JSON.stringify([{ day: 1, hours: 4, time: "flexible" }]),
        id,
      ]
    );

    res.json({ message: "Course updated!", imageUrl: imagePath });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
});

// Delete course (unchanged)
app.delete("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM courses WHERE course_id = $1", [id]);
    res.json({ message: "Course deleted!" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
});

app.post(
  "/enroll",
  authenticateToken,
  upload.single("proof_image"),
  async (req, res) => {
    const {
      course_id,
      schedule_id,
      schedule_ids,
      address,
      contact_number,
      gcash_reference_number,
      birthday,
      age,
      nationality,
      civil_status,
      gender,
      is_pregnant,
      is_pwd,
      payment_type,
      amount_paid,
      vehicle_category,
      vehicle_type,
    } = req.body;

    const user_id = req.user.userId;

    const proof_of_payment = req.file ? req.file.filename : null;

    // Validate required fields
    if (
      !course_id ||
      !address ||
      !contact_number ||
      !birthday ||
      !age ||
      !nationality ||
      !civil_status ||
      !gender
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!gcash_reference_number || !proof_of_payment) {
      return res.status(400).json({ error: "Payment details are required" });
    }

    if (!payment_type || !amount_paid) {
      return res
        .status(400)
        .json({ error: "Payment type and amount are required" });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Get course info
      const courseRes = await client.query(
        `SELECT name, price, branch_id, vehicle_category, type FROM courses WHERE course_id = $1`,
        [course_id]
      );
      if (courseRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Course not found." });
      }

      const courseName = courseRes.rows[0].name.toLowerCase();
      const coursePrice = parseFloat(courseRes.rows[0].price);
      const courseBranchId = courseRes.rows[0].branch_id;
      const courseVehicleCategory = courseRes.rows[0].vehicle_category;
      const courseVehicleType = courseRes.rows[0].type;

      // Calculate expected amount with PWD discount
      const isPWD = is_pwd === "true";
      const discountedPrice = isPWD ? coursePrice * 0.8 : coursePrice;
      const expectedAmount =
        payment_type === "full" ? discountedPrice : discountedPrice * 0.5;
      const paidAmount = parseFloat(amount_paid);

      if (Math.abs(paidAmount - expectedAmount) > 0.01) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: `Invalid payment amount. Expected: ₱${expectedAmount.toFixed(
            2
          )}, Got: ₱${paidAmount.toFixed(2)}`,
        });
      }

      const payment_status = payment_type === "full" ? "paid" : "partial";

      // Determine course type
      const isOnlineTheoretical = courseName.includes("online theoretical");
      const isTheoretical =
        courseName.includes("theoretical") && !courseName.includes("online");
      const isPractical = !isTheoretical && !isOnlineTheoretical;

      // 🔎 ONLINE THEORETICAL - No vehicle or schedule needed
      if (isOnlineTheoretical) {
        const result = await client.query(
          `INSERT INTO enrollments (
            user_id, course_id, address, contact_number, 
            gcash_reference_number, proof_of_payment, enrollment_date,
            birthday, age, nationality, civil_status, gender, is_pregnant,
            is_pwd, payment_status, status, amount_paid
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11, $12, $13, $14, 'pending', $15) 
          RETURNING *`,
          [
            user_id,
            course_id,
            address,
            contact_number,
            gcash_reference_number,
            proof_of_payment,
            birthday,
            age,
            nationality,
            civil_status,
            gender,
            is_pregnant === "true" ? true : false,
            isPWD,
            payment_status,
            paidAmount,
          ]
        );

        await client.query("COMMIT");
        return res.json({
          message:
            "✅ Enrollment submitted successfully! Waiting for admin approval.",
          enrollment: result.rows[0],
        });
      }

      // 🚗 PRACTICAL COURSES - Need vehicle availability check
      if (isPractical && schedule_ids) {
        const scheduleIdsArray = JSON.parse(schedule_ids);

        if (!Array.isArray(scheduleIdsArray) || scheduleIdsArray.length === 0) {
          await client.query("ROLLBACK");
          return res
            .status(400)
            .json({ error: "Invalid schedule_ids format." });
        }

        // Get total vehicles available for this course type
        const vehicleCountRes = await client.query(
          `SELECT COALESCE(SUM(total_units), 0) as total_vehicles
            FROM vehicle_units
            WHERE branch_id = $1 
            AND vehicle_category = $2 
            AND type = $3`,
          [
            courseBranchId,
            courseVehicleCategory || vehicle_category,
            courseVehicleType || vehicle_type,
          ]
        );

        const totalVehicles = parseInt(vehicleCountRes.rows[0].total_vehicles);

        if (totalVehicles === 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            error: `No ${courseVehicleType || vehicle_type} ${
              courseVehicleCategory || vehicle_category
            } vehicles available at this branch`,
          });
        }

        // ✅ CHECK EACH SCHEDULE for vehicle availability
        for (const sid of scheduleIdsArray) {
          const scheduleRes = await client.query(
            `SELECT schedule_id, date, start_time, end_time, slots FROM schedules 
             WHERE schedule_id = $1 FOR UPDATE`,
            [sid]
          );

          if (scheduleRes.rows.length === 0) {
            await client.query("ROLLBACK");
            return res
              .status(404)
              .json({ error: `Schedule ${sid} not found.` });
          }

          const schedule = scheduleRes.rows[0];

          if (schedule.slots <= 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({
              error: `Schedule on ${schedule.date} has no available slots.`,
            });
          }

          const conflictQuery = await client.query(
            `SELECT COUNT(DISTINCT e.enrollment_id) as booked_count
              FROM enrollments e
              JOIN enrollment_schedules es ON e.enrollment_id = es.enrollment_id
              JOIN schedules s ON es.schedule_id = s.schedule_id
              WHERE e.vehicle_category = $1
              AND e.vehicle_type = $2
              AND s.branch_id = $3
              AND e.status IN ('pending', 'approved', 'active', 'ongoing')
              AND s.date = $4
              AND (
                (s.start_time, s.end_time) OVERLAPS ($5::time, $6::time)
              )`,
            [
              courseVehicleCategory || vehicle_category,
              courseVehicleType || vehicle_type,
              courseBranchId,
              schedule.date,
              schedule.start_time,
              schedule.end_time,
            ]
          );
          const bookedVehicles = parseInt(conflictQuery.rows[0].booked_count);
          const availableVehicles = totalVehicles - bookedVehicles;

          console.log(`📊 Vehicle Check:`, {
            schedule_id: sid,
            date: schedule.date,
            time: `${schedule.start_time}-${schedule.end_time}`,
            total: totalVehicles,
            booked: bookedVehicles,
            available: availableVehicles,
          });

          if (availableVehicles <= 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({
              error: `No vehicles available for schedule on ${schedule.date} at ${schedule.start_time}-${schedule.end_time}.`,
            });
          }
        }

        // ✅ All schedules have available vehicles - proceed with enrollment
        const enrollmentResult = await client.query(
          `INSERT INTO enrollments (
            user_id, course_id, address, contact_number, 
            gcash_reference_number, proof_of_payment, enrollment_date,
            birthday, age, nationality, civil_status, gender, is_pregnant,
            is_pwd, payment_status, status, amount_paid,
            vehicle_category, vehicle_type
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11, $12, $13, $14, 'pending', $15, $16, $17) 
          RETURNING *`,
          [
            user_id,
            course_id,
            address,
            contact_number,
            gcash_reference_number,
            proof_of_payment,
            birthday,
            age,
            nationality,
            civil_status,
            gender,
            is_pregnant === "true" ? true : false,
            isPWD,
            payment_status,
            paidAmount,
            courseVehicleCategory || vehicle_category,
            courseVehicleType || vehicle_type,
          ]
        );

        const enrollment_id = enrollmentResult.rows[0].enrollment_id;

        // Create enrollment_schedules entries
        for (let i = 0; i < scheduleIdsArray.length; i++) {
          const sid = scheduleIdsArray[i];

          await client.query(
            `INSERT INTO enrollment_schedules (enrollment_id, schedule_id, day_number)
             VALUES ($1, $2, $3)`,
            [enrollment_id, sid, i + 1]
          );

          await client.query(
            `UPDATE schedules SET slots = slots - 1 WHERE schedule_id = $1`,
            [sid]
          );
        }

        await client.query("COMMIT");

        return res.json({
          message:
            "✅ Enrollment submitted successfully! Waiting for admin approval.",
          enrollment: enrollmentResult.rows[0],
          schedules_count: scheduleIdsArray.length,
        });
      }

      // 🟢 THEORETICAL COURSES with schedule_ids (multiple schedules)
      if (isTheoretical && schedule_ids) {
        const scheduleIdsArray = JSON.parse(schedule_ids);

        if (!Array.isArray(scheduleIdsArray) || scheduleIdsArray.length === 0) {
          await client.query("ROLLBACK");
          return res
            .status(400)
            .json({ error: "Invalid schedule_ids format." });
        }

        // Validate all schedules exist and have slots
        for (const sid of scheduleIdsArray) {
          const scheduleRes = await client.query(
            `SELECT schedule_id, slots FROM schedules 
             WHERE schedule_id = $1 FOR UPDATE`,
            [sid]
          );

          if (scheduleRes.rows.length === 0) {
            await client.query("ROLLBACK");
            return res
              .status(404)
              .json({ error: `Schedule ${sid} not found.` });
          }

          if (scheduleRes.rows[0].slots <= 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({
              error: `Schedule ${sid} has no available slots.`,
            });
          }
        }

        // Create enrollment
        const enrollmentResult = await client.query(
          `INSERT INTO enrollments (
            user_id, course_id, address, contact_number, 
            gcash_reference_number, proof_of_payment, enrollment_date,
            birthday, age, nationality, civil_status, gender, is_pregnant,
            is_pwd, payment_status, status, amount_paid
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11, $12, $13, $14, 'pending', $15) 
          RETURNING *`,
          [
            user_id,
            course_id,
            address,
            contact_number,
            gcash_reference_number,
            proof_of_payment,
            birthday,
            age,
            nationality,
            civil_status,
            gender,
            is_pregnant === "true" ? true : false,
            isPWD,
            payment_status,
            paidAmount,
          ]
        );

        const enrollment_id = enrollmentResult.rows[0].enrollment_id;

        // Create enrollment_schedules entries and update slots
        for (let i = 0; i < scheduleIdsArray.length; i++) {
          const sid = scheduleIdsArray[i];

          await client.query(
            `INSERT INTO enrollment_schedules (enrollment_id, schedule_id, day_number)
             VALUES ($1, $2, $3)`,
            [enrollment_id, sid, i + 1]
          );

          await client.query(
            `UPDATE schedules SET slots = slots - 1 WHERE schedule_id = $1`,
            [sid]
          );
        }

        await client.query("COMMIT");

        return res.json({
          message:
            "✅ Enrollment submitted successfully! Waiting for admin approval.",
          enrollment: enrollmentResult.rows[0],
          schedules_count: scheduleIdsArray.length,
        });
      }

      // 🟢 THEORETICAL COURSES with single schedule_id (legacy/single schedule)
      if (isTheoretical && schedule_id) {
        const scheduleInfo = await client.query(
          `SELECT schedule_id, slots, is_theoretical, group_id FROM schedules 
           WHERE schedule_id = $1 FOR UPDATE`,
          [schedule_id]
        );

        if (scheduleInfo.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({ error: "Schedule not found." });
        }

        const { slots, is_theoretical, group_id } = scheduleInfo.rows[0];

        if (slots <= 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "No available slots." });
        }

        // Check existing enrollment
        let existingEnrollment;
        if (is_theoretical && group_id) {
          existingEnrollment = await client.query(
            `SELECT e.* FROM enrollments e 
             JOIN schedules s ON e.schedule_id = s.schedule_id 
             WHERE e.user_id = $1 AND e.course_id = $2 AND s.group_id = $3`,
            [user_id, course_id, group_id]
          );
        } else {
          existingEnrollment = await client.query(
            `SELECT * FROM enrollments WHERE user_id = $1 AND schedule_id = $2`,
            [user_id, schedule_id]
          );
        }

        if (existingEnrollment.rows.length > 0) {
          await client.query("ROLLBACK");
          return res
            .status(400)
            .json({ error: "You are already enrolled in this schedule." });
        }

        // Insert enrollment
        const result = await client.query(
          `INSERT INTO enrollments (
            user_id, course_id, schedule_id, address, contact_number, 
            gcash_reference_number, proof_of_payment, enrollment_date,
            birthday, age, nationality, civil_status, gender, is_pregnant,
            is_pwd, payment_status, status, amount_paid
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10, $11, $12, $13, $14, $15, 'pending', $16) 
          RETURNING *`,
          [
            user_id,
            course_id,
            schedule_id,
            address,
            contact_number,
            gcash_reference_number,
            proof_of_payment,
            birthday,
            age,
            nationality,
            civil_status,
            gender,
            is_pregnant === "true" ? true : false,
            isPWD,
            payment_status,
            paidAmount,
          ]
        );

        // Update slots
        if (is_theoretical && group_id) {
          await client.query(
            `UPDATE schedules SET slots = slots - 1 WHERE group_id = $1`,
            [group_id]
          );
        } else {
          await client.query(
            `UPDATE schedules SET slots = slots - 1 WHERE schedule_id = $1`,
            [schedule_id]
          );
        }

        await client.query("COMMIT");

        return res.json({
          message:
            "✅ Enrollment submitted successfully! Waiting for admin approval.",
          enrollment: result.rows[0],
        });
      }

      // ❌ No valid schedule information provided
      await client.query("ROLLBACK");
      return res.status(400).json({
        error:
          "Schedule information is required. Please provide either schedule_id or schedule_ids.",
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("❌ Error inserting enrollment:", err);
      res.status(500).json({ error: "Enrollment failed. Please try again." });
    } finally {
      client.release();
    }
  }
);
// Get all enrollments for the authenticated user
app.get("/enrollments", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    // First, get all enrollments
    const enrollmentsResult = await pool.query(
      `
      SELECT 
        e.enrollment_id,
        e.course_id,
        e.schedule_id,
        e.payment_status,
        e.status,
        e.has_feedback,
        e.instructor_id,
        c.name AS course_name,
        c.image AS course_image
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.user_id = $1
      ORDER BY e.enrollment_date DESC
      `,
      [userId]
    );

    // For each enrollment, fetch schedule details
    const enrollmentsWithSchedules = await Promise.all(
      enrollmentsResult.rows.map(async (enrollment) => {
        let scheduleData = null;
        let multipleSchedules = [];

        // Check if single schedule (theoretical courses)
        if (enrollment.schedule_id) {
          const scheduleResult = await pool.query(
            `
            SELECT 
              date AS start_date,
              start_time,
              end_time,
              is_theoretical
            FROM schedules
            WHERE schedule_id = $1
            `,
            [enrollment.schedule_id]
          );

          if (scheduleResult.rows.length > 0) {
            scheduleData = scheduleResult.rows[0];
          }
        } else {
          // Check for multiple schedules (practical courses)
          const multiScheduleResult = await pool.query(
            `
            SELECT 
              s.date AS start_date,
              s.start_time,
              s.end_time,
              s.is_theoretical,
              es.day_number
            FROM enrollment_schedules es
            JOIN schedules s ON es.schedule_id = s.schedule_id
            WHERE es.enrollment_id = $1
            ORDER BY es.day_number ASC
            `,
            [enrollment.enrollment_id]
          );

          multipleSchedules = multiScheduleResult.rows;
        }

        // Get instructor name if assigned
        let instructorName = null;
        if (enrollment.instructor_id) {
          const instructorResult = await pool.query(
            `SELECT name FROM users WHERE user_id = $1`,
            [enrollment.instructor_id]
          );
          if (instructorResult.rows.length > 0) {
            instructorName = instructorResult.rows[0].name;
          }
        }

        return {
          ...enrollment,
          start_date: scheduleData?.start_date || null,
          start_time: scheduleData?.start_time || null,
          end_time: scheduleData?.end_time || null,
          is_theoretical: scheduleData?.is_theoretical || false,
          instructor_name: instructorName,
          multiple_schedules:
            multipleSchedules.length > 0 ? multipleSchedules : null,
        };
      })
    );

    res.json(enrollmentsWithSchedules);
  } catch (err) {
    console.error("Error fetching enrollments:", err);
    res.status(500).json({ error: "Failed to load enrollments" });
  }
});
app.get("/api/check-active-enrollment", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      `SELECT * FROM enrollments 
       WHERE user_id = $1 AND status NOT IN ('passed/completed')`,
      [userId]
    );

    if (result.rows.length > 0) {
      return res.json({ hasActive: true });
    }

    res.json({ hasActive: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/admin/enrollments", authenticateToken, async (req, res) => {
  const adminBranchId = req.user.branch_id;

  try {
    // First, get basic enrollment data
    const result = await pool.query(
      `
      SELECT
        e.enrollment_id,
        e.enrollment_date,
        e.schedule_id,
        e.address,
        e.contact_number,
        e.gcash_reference_number,
        e.proof_of_payment,
        e.payment_status,
        e.amount_paid,
        c.course_id,
        c.name       AS course_name,
        c.price      AS course_price,
        c.image      AS course_image,     
        s.date       AS start_date,
        s.start_time,
        s.end_time,
        s.is_theoretical,
        u.user_id,
        u.name       AS student_name,
        u.username   AS student_username,
        e.instructor_id,
        ins.name     AS instructor_name,
        e.status
      FROM enrollments e
      JOIN courses c   ON e.course_id   = c.course_id
      JOIN users u     ON e.user_id     = u.user_id
      LEFT JOIN schedules s ON e.schedule_id = s.schedule_id   
      LEFT JOIN users ins   ON e.instructor_id = ins.user_id   
      WHERE (
          (s.branch_id = $1) OR
          (c.name = 'ONLINE THEORETICAL DRIVING COURSE' AND e.schedule_id IS NULL AND u.branch_id = $1) OR
          (e.schedule_id IS NULL AND u.branch_id = $1)
      )
      ORDER BY e.enrollment_date DESC
      `,
      [adminBranchId]
    );

    // For each enrollment, check if it has multiple schedules
    const enrollmentsWithSchedules = await Promise.all(
      result.rows.map(async (enrollment) => {
        // Check for multiple schedules in enrollment_schedules table
        const multiScheduleResult = await pool.query(
          `
          SELECT 
            s.schedule_id,
            s.date AS start_date,
            s.start_time,
            s.end_time,
            s.is_theoretical,
            es.day_number,
            s.branch_id
          FROM enrollment_schedules es
          JOIN schedules s ON es.schedule_id = s.schedule_id
          WHERE es.enrollment_id = $1 AND s.branch_id = $2
          ORDER BY es.day_number ASC
          `,
          [enrollment.enrollment_id, adminBranchId]
        );

        // If multiple schedules exist, use the first one for start_date/time
        if (multiScheduleResult.rows.length > 0) {
          const firstSchedule = multiScheduleResult.rows[0];
          enrollment.start_date = firstSchedule.start_date;
          enrollment.start_time = firstSchedule.start_time;
          enrollment.end_time = firstSchedule.end_time;
          enrollment.is_theoretical = firstSchedule.is_theoretical;
          enrollment.multiple_schedules = multiScheduleResult.rows;
        }

        return enrollment;
      })
    );

    res.json(enrollmentsWithSchedules);
  } catch (err) {
    console.error("❌ Error fetching enrollments:", err);
    res.status(500).json({ error: "Could not fetch enrollments" });
  }
});

//add admin/instructor account
app.post("/api/accounts", async (req, res) => {
  const { name, username, password, role, branch_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      "INSERT INTO users (name, username, password, role, branch_id) VALUES ($1, $2, $3, $4, $5)",
      [name, username, hashedPassword, role, branch_id]
    );
    res.json({ message: "✅ Account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Database error" });
  }
});

// Get all accounts
app.get("/api/accounts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.user_id AS id, u.name, u.username, u.role, u.branch_id, b.name AS branch_name
      FROM users u
      LEFT JOIN branches b ON u.branch_id = b.branch_id
      ORDER BY u.user_id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ error: "❌ Failed to fetch accounts" });
  }
});

// PUT (Update account)
app.put("/api/accounts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, username, password, role, branch_id } = req.body;

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
      await pool.query(
        `UPDATE users
         SET name = $1, username = $2, password = $3, role = $4, branch_id = $5
         WHERE user_id = $6`,
        [name, username, hashedPassword, role, branch_id, id]
      );
    } else {
      await pool.query(
        `UPDATE users
         SET name = $1, username = $2, role = $3, branch_id = $4
         WHERE user_id = $5`,
        [name, username, role, branch_id, id]
      );
    }

    res.json({ message: "✅ Account updated successfully" });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ error: "❌ Failed to update account" });
  }
});

// DELETE account
app.delete("/api/accounts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM users WHERE user_id = $1`, [id]);
    res.json({ message: "✅ Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "❌ Failed to delete account" });
  }
});

// Add new schedule
app.post("/api/schedules", authenticateToken, async (req, res) => {
  const { date, start_time, end_time, is_theoretical, slots } = req.body;

  const created_by = req.user.userId;
  const branch_id = req.user.branch_id;

  try {
    if (!date || !start_time || !end_time || !slots) {
      return res.status(400).json({ error: "❌ All fields are required." });
    }

    const scheduleDate = new Date(date);
    if (isNaN(scheduleDate)) {
      return res.status(400).json({ error: "❌ Invalid date format." });
    }

    const formattedDate = scheduleDate.toISOString().split("T")[0];

    // Insert single schedule (admin will create Day 2 separately)
    await pool.query(
      `INSERT INTO schedules 
        (branch_id, date, start_time, end_time, slots, is_theoretical, created_by)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7)`,
      [
        branch_id,
        formattedDate,
        start_time,
        end_time,
        slots,
        is_theoretical,
        created_by,
      ]
    );

    res.status(201).json({ message: "✅ Schedule added successfully" });
  } catch (error) {
    console.error("Error adding schedule:", error);
    res.status(500).json({ error: "❌ Failed to add schedule" });
  }
});

// Delete schedule endpoint
app.delete(
  "/api/schedules/:scheduleId",
  authenticateToken,
  async (req, res) => {
    const { scheduleId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
      // Only admins can delete schedules
      if (userRole !== "administrative_staff") {
        return res
          .status(403)
          .json({ error: " Only admins can delete schedules" });
      }

      // Check if schedule exists
      const scheduleCheck = await pool.query(
        "SELECT * FROM schedules WHERE schedule_id = $1",
        [scheduleId]
      );

      if (scheduleCheck.rows.length === 0) {
        return res.status(404).json({ error: "❌ Schedule not found" });
      }

      // Delete related bookings first (if you want to cascade)
      await pool.query("DELETE FROM enrollments WHERE schedule_id = $1", [
        scheduleId,
      ]);

      // Delete the schedule
      await pool.query("DELETE FROM schedules WHERE schedule_id = $1", [
        scheduleId,
      ]);

      res.status(200).json({ message: "✅ Schedule deleted successfully" });
    } catch (error) {
      console.error("Error deleting schedule:", error);
      res.status(500).json({ error: "❌ Failed to delete schedule" });
    }
  }
);

// Get all schedules
app.get("/api/schedules", authenticateToken, async (req, res) => {
  const branch_id = req.user.branch_id;
  const { view } = req.query; // Add query param to choose view type

  try {
    const { rows: schedules } = await pool.query(
      "SELECT * FROM schedules WHERE branch_id = $1 ORDER BY date, start_time",
      [branch_id]
    );

    // If view=individual, return raw schedules for enrollment
    if (view === "individual") {
      const result = schedules.map((sched) => ({
        schedule_id: sched.schedule_id,
        branch_id: sched.branch_id,
        start_date: sched.date,
        end_date: sched.date,
        start_time: sched.start_time,
        end_time: sched.end_time,
        slots: sched.slots,
        is_theoretical: sched.is_theoretical,
        created_by: sched.created_by,
        created_at: sched.created_at,
      }));
      return res.json(result);
    }

    // Default: Group consecutive theoretical schedules for admin display
    const grouped = [];
    const used = new Set();

    schedules.forEach((sched, index) => {
      if (used.has(index)) return;

      if (sched.is_theoretical) {
        // Look for next day theoretical schedule
        const currentDate = new Date(sched.date);
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = nextDay.toISOString().split("T")[0];

        // Find matching next day theoretical schedule
        const nextDayIndex = schedules.findIndex(
          (s, i) =>
            i > index &&
            !used.has(i) &&
            s.is_theoretical &&
            s.date === nextDayStr &&
            s.start_time === sched.start_time &&
            s.branch_id === sched.branch_id &&
            s.slots === sched.slots
        );

        if (nextDayIndex !== -1) {
          // Found consecutive pair - group as one
          used.add(index);
          used.add(nextDayIndex);

          grouped.push({
            schedule_id: sched.schedule_id,
            day2_schedule_id: schedules[nextDayIndex].schedule_id,
            branch_id: sched.branch_id,
            start_date: sched.date,
            end_date: schedules[nextDayIndex].date,
            start_time: sched.start_time,
            end_time: sched.end_time,
            day2_end_time: schedules[nextDayIndex].end_time,
            slots: sched.slots,
            is_theoretical: true,
            created_by: sched.created_by,
            created_at: sched.created_at,
          });
        } else {
          // No consecutive pair - show as single day (incomplete)
          used.add(index);
          grouped.push({
            schedule_id: sched.schedule_id,
            branch_id: sched.branch_id,
            start_date: sched.date,
            end_date: sched.date,
            start_time: sched.start_time,
            end_time: sched.end_time,
            slots: sched.slots,
            is_theoretical: true,
            created_by: sched.created_by,
            created_at: sched.created_at,
            is_incomplete: true,
          });
        }
      } else {
        // Practical course - single day
        used.add(index);
        grouped.push({
          schedule_id: sched.schedule_id,
          branch_id: sched.branch_id,
          start_date: sched.date,
          end_date: sched.date,
          start_time: sched.start_time,
          end_time: sched.end_time,
          slots: sched.slots,
          is_theoretical: false,
          created_by: sched.created_by,
          created_at: sched.created_at,
        });
      }
    });

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "❌ Failed to fetch schedules" });
  }
});

app.get("/courses/:course_id", authenticateToken, async (req, res) => {
  try {
    const { course_id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM courses WHERE course_id = $1",
      [course_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});
// Get all instructors for the authenticated user's branch
app.get("/api/instructors", authenticateToken, async (req, res) => {
  const { branch_id } = req.user; // gets from decoded JWT

  try {
    const result = await pool.query(
      "SELECT user_id, name FROM users WHERE role = 'instructor' AND branch_id = $1",
      [branch_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ error: "❌ Database error" });
  }
});

/// Assign instructor to enrollment (manual by admin)
app.patch(
  "/api/admin/enrollments/:id/assign-instructor",
  authenticateToken,
  async (req, res) => {
    const enrollmentId = req.params.id;
    const { instructor_id } = req.body;

    if (!instructor_id) {
      return res.status(400).json({ message: "Instructor ID is required." });
    }

    try {
      const check = await pool.query(
        "SELECT instructor_id FROM enrollments WHERE enrollment_id = $1",
        [enrollmentId]
      );

      if (check.rows.length === 0) {
        return res.status(404).json({ message: "Enrollment not found." });
      }

      const currentInstructorId = check.rows[0].instructor_id;

      // Allow reassignment - update instructor regardless if one is already assigned
      await pool.query(
        "UPDATE enrollments SET instructor_id = $1 WHERE enrollment_id = $2",
        [instructor_id, enrollmentId]
      );

      const message = currentInstructorId
        ? "✅ Instructor reassigned successfully."
        : "✅ Instructor assigned to enrollment successfully.";

      res.json({ message });
    } catch (err) {
      console.error("❌ Error assigning instructor:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.get("/api/instructor/enrollments", authenticateToken, async (req, res) => {
  const instructorId = req.user.userId;

  try {
    // Get all enrollments assigned to this instructor
    const result = await pool.query(
      `
      SELECT 
        e.enrollment_id,
        e.schedule_id,
        e.course_id,
        c.name AS course_name,
        u.name AS student_name,
        u.email AS student_email,
        e.status
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN users u ON e.user_id = u.user_id
      WHERE e.instructor_id = $1
      ORDER BY e.enrollment_date DESC
      `,
      [instructorId]
    );

    // For each enrollment, get schedule details
    const enrollmentsWithSchedules = await Promise.all(
      result.rows.map(async (enrollment) => {
        const isTheoretical = enrollment.course_name
          .toLowerCase()
          .includes("theoretical");

        // Check if single schedule (theoretical courses)
        if (enrollment.schedule_id) {
          const scheduleResult = await pool.query(
            `
            SELECT 
              date AS start_date,
              start_time,
              end_time
            FROM schedules
            WHERE schedule_id = $1
            `,
            [enrollment.schedule_id]
          );

          if (scheduleResult.rows.length > 0) {
            enrollment.start_date = scheduleResult.rows[0].start_date;
            enrollment.start_time = scheduleResult.rows[0].start_time;
            enrollment.end_time = scheduleResult.rows[0].end_time;

            // Add end_date for theoretical courses (next day)
            if (isTheoretical) {
              const startDate = new Date(scheduleResult.rows[0].start_date);
              startDate.setDate(startDate.getDate() + 1);
              enrollment.end_date = startDate.toISOString().split("T")[0];
            }
          }
        } else {
          // Check for multiple schedules (practical courses)
          const multiScheduleResult = await pool.query(
            `
            SELECT 
              s.date AS start_date,
              s.start_time,
              s.end_time,
              es.day_number
            FROM enrollment_schedules es
            JOIN schedules s ON es.schedule_id = s.schedule_id
            WHERE es.enrollment_id = $1
            ORDER BY es.day_number ASC
            `,
            [enrollment.enrollment_id]
          );

          if (multiScheduleResult.rows.length > 0) {
            // Use first schedule for main display
            const firstSchedule = multiScheduleResult.rows[0];
            enrollment.start_date = firstSchedule.start_date;
            enrollment.start_time = firstSchedule.start_time;
            enrollment.end_time = firstSchedule.end_time;
            enrollment.multiple_schedules = multiScheduleResult.rows;
          }
        }

        return enrollment;
      })
    );

    res.json(enrollmentsWithSchedules);
  } catch (err) {
    console.error("❌ Error fetching instructor enrollments:", err);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

// Route to update enrollment status
app.put(
  "/api/instructor/enrollments/:enrollmentId/status",
  authenticateToken,
  async (req, res) => {
    const { enrollmentId } = req.params;
    const { status } = req.body;
    const instructorId = req.user.userId;

    try {
      // Verify that this enrollment belongs to the instructor
      const checkResult = await pool.query(
        "SELECT enrollment_id FROM enrollments WHERE enrollment_id = $1 AND instructor_id = $2",
        [enrollmentId, instructorId]
      );

      if (checkResult.rows.length === 0) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this enrollment" });
      }

      // Update the status
      const result = await pool.query(
        "UPDATE enrollments SET status = $1 WHERE enrollment_id = $2 RETURNING *",
        [status, enrollmentId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Enrollment not found" });
      }

      res.json({
        message: "Status updated successfully",
        enrollment: result.rows[0],
      });
    } catch (err) {
      console.error("❌ Error updating enrollment status:", err);
      res.status(500).json({ error: "Failed to update status" });
    }
  }
);

// Add this endpoint for admin to update enrollment status (for online theoretical courses)
app.put(
  "/api/admin/enrollments/:enrollmentId/status",
  authenticateToken,
  async (req, res) => {
    const { enrollmentId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    try {
      // Verify that user is an admin
      const userCheck = await pool.query(
        "SELECT role FROM users WHERE user_id = $1",
        [userId]
      );

      if (
        userCheck.rows.length === 0 ||
        userCheck.rows[0].role !== "administrative_staff"
      ) {
        return res
          .status(403)
          .json({ error: "Unauthorized. Admin access required." });
      }

      // Validate status
      const validStatuses = ["approved", "passed/completed", "failed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      // Update the status
      const result = await pool.query(
        "UPDATE enrollments SET status = $1 WHERE enrollment_id = $2 RETURNING *",
        [status, enrollmentId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Enrollment not found" });
      }

      res.json({
        message: "Status updated successfully",
        enrollment: result.rows[0],
      });
    } catch (err) {
      console.error("❌ Error updating enrollment status:", err);
      res.status(500).json({ error: "Failed to update status" });
    }
  }
);
/*
// Route to generate certificate for completed enrollments
app.post(
  "/api/enrollments/:id/generate-certificate",
  authenticateToken,
  async (req, res) => {
    const enrollmentId = req.params.id;

    try {
      const result = await pool.query(
        `
      SELECT e.status, u.name AS student_name, c.name AS course_name
      FROM enrollments e
      JOIN users u ON e.user_id = u.user_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.enrollment_id = $1
    `,
        [enrollmentId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Enrollment not found." });
      }

      const { status, student_name, course_name } = result.rows[0];

      if (status !== "Completed" && status !== "passed/completed") {
        return res
          .status(400)
          .json({ message: "Student has not yet completed the course." });
      }

      const certificatesDir = path.join(__dirname, "certificates");
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      // Driving School Certificate Design - Red Dominant Theme
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margins: { top: 40, bottom: 40, left: 40, right: 40 },
      });

      const fileName = `${student_name.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}-Driving-Certificate-${Date.now()}.pdf`;
      const filePath = path.join(certificatesDir, fileName);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Page dimensions for landscape A4
      const pageWidth = 802; // 842 - 40 margin each side
      const pageHeight = 555; // 595 - 40 margin each side

      // Clean white background - no gradient
      doc.fillColor("#FFFFFF");
      doc.rect(0, 0, pageWidth + 80, pageHeight + 80).fill();

      // Add driving school logo as blurry background
      try {
        // Try multiple possible paths
        const possibleLogoPaths = [
          path.join(__dirname, "assets", "logo.jpg"),
          path.join(__dirname, "assets", "logo.png"),
          path.join(__dirname, "assets", "logo.jpeg"),
          path.join(__dirname, "logo.jpg"),
          path.join(__dirname, "logo.png"),
          path.join(process.cwd(), "assets", "logo.jpg"),
          path.join(process.cwd(), "assets", "logo.png"),
        ];

        let logoPath = null;
        let foundLogo = false;

        // Check each possible path
        for (const testPath of possibleLogoPaths) {
          console.log("🔍 Checking logo path:", testPath);
          if (fs.existsSync(testPath)) {
            logoPath = testPath;
            foundLogo = true;
            console.log("✅ Logo found at:", testPath);
            break;
          }
        }

        if (foundLogo && logoPath) {
          // Calculate logo position for perfect centering
          const logoSize = 180; // Slightly smaller for better proportion
          const logoX = (pageWidth + 80) / 2 - logoSize / 2; // Perfect center
          const logoY = (pageHeight + 80) / 2 - logoSize / 2; // Perfect center

          // Add logo with subtle opacity for watermark effect
          console.log("📷 Adding centered logo to certificate...");
          doc.opacity(0.12); // Very subtle watermark
          doc.image(logoPath, logoX, logoY, {
            width: logoSize,
            height: logoSize,
            fit: [logoSize, logoSize],
            align: "center",
            valign: "center",
          });
          doc.opacity(1); // Reset opacity
          console.log("✅ Logo successfully centered on certificate");
        } else {
          console.log("❌ Logo not found in any of the expected locations");
          console.log("📁 Current working directory:", process.cwd());
          console.log("📁 __dirname:", __dirname);

          // List files in assets folder for debugging
          const assetsDir = path.join(__dirname, "assets");
          if (fs.existsSync(assetsDir)) {
            const files = fs.readdirSync(assetsDir);
            console.log("📂 Files in assets folder:", files);
          } else {
            console.log("📂 Assets folder doesn't exist at:", assetsDir);
          }

          // Clean centered logo placeholder
          const logoX = (pageWidth + 80) / 2; // Perfect center
          const logoY = (pageHeight + 80) / 2; // Perfect center

          // Simple, clean centered logo placeholder
          doc.fillColor("#DC143C").opacity(0.08);
          doc.fontSize(48).font("Helvetica-Bold");
          doc.text("LOGO", logoX - 48, logoY - 15, {
            align: "center",
            width: 96,
          });
          doc.opacity(1);
        }
      } catch (logoError) {
        console.error("❌ Error loading logo:", logoError.message);
        console.log("📁 Current working directory:", process.cwd());
        console.log("📁 __dirname:", __dirname);

        // Clean centered fallback design
        const logoX = (pageWidth + 80) / 2; // Perfect center
        const logoY = (pageHeight + 80) / 2; // Perfect center

        // Simple clean centered placeholder
        doc.fillColor("#DC143C").opacity(0.06);
        doc.fontSize(36).font("Helvetica-Bold");
        doc.text("LOGO", logoX - 36, logoY - 12, {
          align: "center",
          width: 72,
        });
        doc.opacity(1);
      }

      // Clean elegant borders
      doc
        .strokeColor("#8B0000")
        .lineWidth(6)
        .rect(20, 20, pageWidth - 40, pageHeight - 40)
        .stroke();

      doc
        .strokeColor("#228B22")
        .lineWidth(2)
        .rect(30, 30, pageWidth - 60, pageHeight - 60)
        .stroke();

      doc
        .strokeColor("#FFD700")
        .lineWidth(1)
        .rect(35, 35, pageWidth - 70, pageHeight - 70)
        .stroke();

      // Header section with driving school name
      doc.fillColor("#8B0000").fontSize(18).font("Helvetica-Bold");
      doc.text("PREMIUM DRIVING SCHOOL", 50, 60, {
        align: "center",
        width: pageWidth - 100,
      });

      // Certificate title
      doc.fillColor("#DC143C").fontSize(42).font("Helvetica-Bold");
      doc.text("CERTIFICATE", 50, 100, {
        align: "center",
        width: pageWidth - 100,
      });

      doc.fontSize(24).fillColor("#8B0000");
      doc.text("OF COMPLETION", 50, 145, {
        align: "center",
        width: pageWidth - 100,
      });

      // Clean decorative line under title
      doc
        .strokeColor("#FFD700")
        .lineWidth(3)
        .moveTo(pageWidth / 2 - 100, 175)
        .lineTo(pageWidth / 2 + 100, 175)
        .stroke();

      // Certificate body text
      doc.fillColor("#2C2C2C").fontSize(16).font("Helvetica");
      doc.text("This certifies that", 50, 205, {
        align: "center",
        width: pageWidth - 100,
      });

      // Student name with elegant styling - Red theme
      doc.fillColor("#8B0000").fontSize(32).font("Helvetica-Bold");
      const nameText = student_name.toUpperCase();
      doc.text(nameText, 50, 240, {
        align: "center",
        width: pageWidth - 100,
      });

      // Elegant underline for name - Yellow gold
      const nameWidth = doc.widthOfString(nameText, { fontSize: 32 });
      const nameX = (pageWidth - nameWidth) / 2;
      doc
        .strokeColor("#FFD700")
        .lineWidth(3)
        .moveTo(nameX - 30, 280)
        .lineTo(nameX + nameWidth + 30, 280)
        .stroke();

      // Course completion description
      doc.fillColor("#2C2C2C").fontSize(16).font("Helvetica");
      doc.text(
        "has successfully completed the comprehensive driving training program",
        50,
        305,
        {
          align: "center",
          width: pageWidth - 100,
        }
      );

      // Course name with emphasis - Green theme
      doc.fillColor("#228B22").fontSize(22).font("Helvetica-BoldOblique");
      doc.text(`"${course_name}"`, 50, 335, {
        align: "center",
        width: pageWidth - 100,
      });

      // Achievement statement
      doc.fillColor("#2C2C2C").fontSize(14).font("Helvetica");
      doc.text(
        "demonstrating proficiency in road safety and meeting all required driving competencies",
        50,
        370,
        {
          align: "center",
          width: pageWidth - 100,
        }
      );

      // Date section
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      doc.fillColor("#8B0000").fontSize(14).font("Helvetica-Bold");
      doc.text(`Completed on ${currentDate}`, 50, 400, {
        align: "center",
        width: pageWidth - 100,
      });

      // Certificate ID (for authenticity)
      const certId = `DS-${Date.now().toString().slice(-8)}`;
      doc.fillColor("#696969").fontSize(10).font("Helvetica");
      doc.text(`Certificate ID: ${certId}`, 50, 420, {
        align: "center",
        width: pageWidth - 100,
      });

      // Professional signature section
      const sigY = 460;

      // Left signature area - Red
      doc
        .strokeColor("#8B0000")
        .lineWidth(2)
        .moveTo(120, sigY)
        .lineTo(280, sigY)
        .stroke();

      // Right signature area - Green
      doc
        .strokeColor("#228B22")
        .lineWidth(2)
        .moveTo(pageWidth - 280, sigY)
        .lineTo(pageWidth - 120, sigY)
        .stroke();

      // Signature labels
      doc.fontSize(11).fillColor("#2C2C2C").font("Helvetica-Bold");
      doc.text("Driving Instructor", 120, sigY + 10, {
        width: 160,
        align: "center",
      });
      doc.text("School Director", pageWidth - 280, sigY + 10, {
        width: 160,
        align: "center",
      });

      // Clean corner elements - simple circles only
      // Top-left corner - Red
      doc.fillColor("#DC143C");
      doc.circle(55, 55, 6).fill();

      // Top-right corner - Yellow
      doc.fillColor("#FFD700");
      doc.circle(pageWidth - 55, 55, 6).fill();

      // Bottom-left corner - Green
      doc.fillColor("#32CD32");
      doc.circle(55, pageHeight - 55, 6).fill();

      // Bottom-right corner - Red
      doc.fillColor("#DC143C");
      doc.circle(pageWidth - 55, pageHeight - 55, 6).fill();

      // Clean bottom decoration - remove messy road lines
      // Simple dot pattern
      doc.fillColor("#FFD700").fontSize(12);
      const dotY = pageHeight - 30;
      for (let i = 0; i < 8; i++) {
        const x = 150 + i * 75;
        if (x < pageWidth - 150) {
          doc.text("•", x, dotY);
        }
      }

      // Clean professional seal
      const sealX = pageWidth - 100;
      const sealY = 350;
      const sealRadius = 35;

      // Simple clean circles
      doc.strokeColor("#8B0000").lineWidth(2);
      doc.circle(sealX, sealY, sealRadius).stroke();

      doc.strokeColor("#FFD700").lineWidth(1);
      doc.circle(sealX, sealY, sealRadius - 8).stroke();

      // Clean seal text
      doc.fillColor("#8B0000").fontSize(7).font("Helvetica-Bold");
      doc.text("CERTIFIED", sealX - 20, sealY - 8, {
        width: 40,
        align: "center",
      });
      doc.text("DRIVING", sealX - 20, sealY + 2, {
        width: 40,
        align: "center",
      });
      doc.text("SCHOOL", sealX - 20, sealY + 12, {
        width: 40,
        align: "center",
      });

      doc.end();

      stream.on("finish", () => {
        const fileUrl = `/certificates/${fileName}`;
        res.json({
          message: "Driving school certificate generated successfully",
          file: filePath,
          downloadUrl: fileUrl,
          fileName: fileName,
          certificateId: certId,
        });
      });

      stream.on("error", (err) => {
        console.error("❌ Error writing certificate file:", err);
        res.status(500).json({ error: "Could not write certificate file" });
      });
    } catch (err) {
      console.error("❌ Error generating certificate:", err);
      res.status(500).json({ error: "Could not generate certificate" });
    }
  }
);
*/
// PATCH /api/admin/enrollments/:id/amount-paid
app.patch(
  "/api/admin/enrollments/:id/amount-paid",
  authenticateToken,
  async (req, res) => {
    const enrollmentId = req.params.id;
    const { amount_paid } = req.body;

    if (amount_paid === undefined) {
      return res.status(400).json({ message: "Amount paid is required." });
    }

    try {
      await pool.query(
        "UPDATE enrollments SET amount_paid = $1 WHERE enrollment_id = $2",
        [amount_paid, enrollmentId]
      );
      res.json({ message: "✅ Amount paid updated successfully." });
    } catch (err) {
      console.error("❌ Error updating amount paid:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PATCH /api/admin/enrollments/:id/payment-status
app.patch(
  "/api/admin/enrollments/:id/payment-status",
  authenticateToken,
  async (req, res) => {
    const enrollmentId = req.params.id;
    const { payment_status } = req.body;

    if (!payment_status) {
      return res.status(400).json({ message: "Payment status is required." });
    }

    try {
      await pool.query(
        "UPDATE enrollments SET payment_status = $1 WHERE enrollment_id = $2",
        [payment_status, enrollmentId]
      );
      res.json({ message: "✅ Payment status updated successfully." });
    } catch (err) {
      console.error("❌ Error updating payment status:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

//manager post announcemnets
app.post("/announcements", async (req, res) => {
  const { title, content, branch_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO announcements (title, content, branch_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [title, content, branch_id || null]
    );

    res.json({
      message: "✅ Announcement posted successfully!",
      announcement: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error posting announcement:", err);
    res.status(500).json({ error: "Failed to post announcement." });
  }
});

app.get("/announcements", async (req, res) => {
  const { branch_id } = req.query;

  try {
    let result;
    if (branch_id) {
      result = await pool.query(
        `SELECT a.*, b.name AS branch_name FROM announcements a
         LEFT JOIN branches b ON a.branch_id = b.branch_id
         WHERE a.branch_id = $1 OR a.branch_id IS NULL
         ORDER BY a.created_at DESC`,
        [branch_id]
      );
    } else {
      // Kung walang branch_id, kunin lahat ng announcement
      result = await pool.query(
        `SELECT a.*, b.name AS branch_name FROM announcements a
         LEFT JOIN branches b ON a.branch_id = b.branch_id
         ORDER BY a.created_at DESC`
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching announcements:", err);
    res.status(500).json({ error: "Failed to fetch announcements." });
  }
});

app.delete("/announcements/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM announcements WHERE announcement_id = $1 RETURNING announcement_id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Announcement not found." });
    }

    res.json({ message: "✅ Announcement deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting announcement:", err);
    res.status(500).json({ error: "Failed to delete announcement." });
  }
});

app.put("/announcements/:id", async (req, res) => {
  const { title, content, branch_id } = req.body;
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE announcements SET title = $1, content = $2, branch_id = $3 WHERE announcement_id = $4`,
      [title, content, branch_id, id]
    );
    res.json({ message: "Announcement updated" });
  } catch (err) {
    console.error("Error updating announcement:", err);
    res.status(500).json({ error: "Failed to update announcement" });
  }
});

// Update the API endpoint to accept instructor_rating
app.post("/api/feedback/:enrollmentId", async (req, res) => {
  const { enrollmentId } = req.params;

  console.log("Received feedback submission:");
  console.log("Enrollment ID:", enrollmentId);
  console.log("Request body:", req.body);

  const {
    instructor_rating, // NEW: Add this
    training_course_q1,
    training_course_q2,
    training_course_q3,
    training_course_q4,
    training_course_q5,
    instructor_evaluation_q1,
    instructor_evaluation_q2,
    instructor_evaluation_q3,
    instructor_evaluation_q4,
    instructor_evaluation_q5,
    admin_staff_q1,
    admin_staff_q2,
    admin_staff_q3,
    classroom_q1,
    classroom_q2,
    classroom_q3,
    classroom_q4,
    classroom_q5,
    vehicle_q1,
    vehicle_q2,
    vehicle_q3,
    instructor_comments,
    comments,
  } = req.body;

  // Validate required fields
  if (!enrollmentId) {
    return res.status(400).json({ error: "Enrollment ID is required" });
  }

  // NEW: Validate instructor rating
  if (!instructor_rating || instructor_rating < 1 || instructor_rating > 5) {
    return res
      .status(400)
      .json({ error: "Valid instructor rating (1-5) is required" });
  }

  try {
    // Check if enrollment exists
    const enrollmentCheck = await pool.query(
      "SELECT enrollment_id FROM enrollments WHERE enrollment_id = $1",
      [enrollmentId]
    );

    if (enrollmentCheck.rows.length === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Check if feedback already exists
    const existingFeedback = await pool.query(
      "SELECT feedback_id FROM feedback WHERE enrollment_id = $1",
      [enrollmentId]
    );

    if (existingFeedback.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Feedback already submitted for this enrollment" });
    }

    // Updated SQL with instructor_rating
    const result = await pool.query(
      `INSERT INTO feedback (
    enrollment_id,
    instructor_rating,
    training_course_q1, training_course_q2, training_course_q3, training_course_q4, training_course_q5,
    instructor_q1, instructor_q2, instructor_q3, instructor_q4, instructor_q5,
    admin_q1, admin_q2, admin_q3,
    classroom_q1, classroom_q2, classroom_q3, classroom_q4, classroom_q5,
    vehicle_q1, vehicle_q2, vehicle_q3,
    instructor_comments,
    comments
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7,
    $8, $9, $10, $11, $12,
    $13, $14, $15,
    $16, $17, $18, $19, $20,
    $21, $22, $23,
    $24, $25
  )
  RETURNING feedback_id`,
      [
        enrollmentId,
        instructor_rating, // NEW: Add this parameter
        training_course_q1,
        training_course_q2,
        training_course_q3,
        training_course_q4,
        training_course_q5,
        instructor_evaluation_q1,
        instructor_evaluation_q2,
        instructor_evaluation_q3,
        instructor_evaluation_q4,
        instructor_evaluation_q5,
        admin_staff_q1,
        admin_staff_q2,
        admin_staff_q3,
        classroom_q1,
        classroom_q2,
        classroom_q3,
        classroom_q4,
        classroom_q5,
        vehicle_q1,
        vehicle_q2,
        vehicle_q3,
        instructor_comments,
        comments,
      ]
    );

    await pool.query(
      "UPDATE enrollments SET has_feedback = TRUE WHERE enrollment_id = $1",
      [enrollmentId]
    );

    console.log("Feedback inserted successfully:", result.rows[0]);
    return res.status(200).json({
      message: "Feedback submitted successfully!",
      feedback_id: result.rows[0].feedback_id,
    });
  } catch (err) {
    console.error("Error submitting feedback:", err);

    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "Feedback already exists for this enrollment" });
    }

    if (err.code === "23503") {
      return res.status(400).json({ error: "Invalid enrollment ID" });
    }

    if (err.code === "23502") {
      return res.status(400).json({ error: "Missing required feedback data" });
    }

    res.status(500).json({
      error: "Failed to submit feedback",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Feature/Unfeature feedback route
app.put("/api/feedback/:id/feature", async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    const result = await pool.query(
      "UPDATE feedback SET featured = $1 WHERE feedback_id = $2",
      [featured, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating featured status:", error);
    res.status(500).json({ error: "Failed to update featured status" });
  }
});

// Get featured testimonials route
app.get("/api/testimonials", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.feedback_id,
        u.name as student_name,
        f.comments,
        f.created_at
      FROM feedback f
      JOIN enrollments e ON f.enrollment_id = e.enrollment_id
      JOIN users u ON e.user_id = u.user_id
      WHERE f.featured = TRUE AND f.comments IS NOT NULL AND f.comments != ''
      ORDER BY f.created_at DESC
      LIMIT 6
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Email not found." });
    }

    const user = rows[0];
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Update reset_code in users table
    await pool.query("UPDATE users SET reset_code = $1 WHERE email = $2", [
      code,
      email,
    ]);

    // Email details
    const mailOptions = {
      from: `"First Safety Driving School" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password Code - First Safety Driving School",
      text: `Hello ${user.name},

You have requested to reset your password.

Your password reset code is: ${code}

Please enter this code in the reset password form to set a new password.

This code will expire soon for your security.

If you did not request this, please ignore this message.

Best regards,
First Safety Driving School Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #374151; font-size: 16px;">Hello ${user.name},</p>
            
            <p style="color: #374151; font-size: 16px;">
              You have requested to reset your password for your First Safety Driving School account.
            </p>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">Your password reset code is:</p>
              <p style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 4px; margin: 0;">${code}</p>
            </div>
            
            <p style="color: #374151; font-size: 16px;">
              Please enter this code in the reset password form to set your new password.
            </p>
            
            <p style="color: #6b7280; font-size: 14px;">
              This code will expire in 10 minutes for security purposes.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            
            <p style="color: #6b7280; font-size: 14px;">
              If you did not request a password reset, please ignore this message or contact support if you have concerns.
            </p>
            
            <p style="color: #374151; font-size: 16px;">
              Best regards,<br>
              <strong>First Safety Driving School Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ error: "Error sending reset email." });
      } else {
        console.log("Reset email sent:", info.response);
        res.json({
          message:
            "A password reset code has been sent to your email. Check your inbox or spam folder.",
        });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND reset_code = $2",
      [email, code]
    );
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid code or email." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1, reset_code = NULL WHERE email = $2",
      [hashedPassword, email]
    );

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

//manager route to get all feedbacks
app.get("/api/feedback", async (req, res) => {
  const { branch_id, month, year } = req.query;

  try {
    // Build the WHERE clause dynamically
    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (branch_id) {
      conditions.push(`u.branch_id = $${paramCount}`);
      params.push(branch_id);
      paramCount++;
    }

    if (month) {
      conditions.push(`EXTRACT(MONTH FROM f.created_at) = $${paramCount}`);
      params.push(parseInt(month));
      paramCount++;
    }

    if (year) {
      conditions.push(`EXTRACT(YEAR FROM f.created_at) = $${paramCount}`);
      params.push(parseInt(year));
      paramCount++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `
      SELECT 
        f.feedback_id,
        f.enrollment_id,
        f.featured,
        f.instructor_rating,
        u.name AS student_name,
        i.name AS instructor_name,
        c.name AS course_name,
        f.training_course_q1, f.training_course_q2, f.training_course_q3, f.training_course_q4, f.training_course_q5,
        f.instructor_q1, f.instructor_q2, f.instructor_q3, f.instructor_q4, f.instructor_q5,
        f.admin_q1, f.admin_q2, f.admin_q3,
        f.classroom_q1, f.classroom_q2, f.classroom_q3, f.classroom_q4, f.classroom_q5,
        f.vehicle_q1, f.vehicle_q2, f.vehicle_q3,
        f.instructor_comments, f.comments,
        f.created_at
      FROM feedback f
      JOIN enrollments e ON f.enrollment_id = e.enrollment_id
      JOIN users u ON e.user_id = u.user_id
      JOIN users i ON e.instructor_id = i.user_id
      JOIN courses c ON e.course_id = c.course_id
      ${whereClause}
      ORDER BY f.created_at DESC
      `,
      params
    );

    // Ensure featured is always a boolean
    const processedResults = result.rows.map((row) => ({
      ...row,
      featured: Boolean(row.featured),
    }));

    res.json(processedResults);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

//admin route to get feedback by branch
app.get("/api/admin/feedback", authenticateToken, async (req, res) => {
  const { branch_id } = req.user;
  const { month, year } = req.query;

  try {
    let query = `
      SELECT 
        f.feedback_id,
        f.enrollment_id,
        f.instructor_rating,
        s.name AS student_name,
        i.name AS instructor_name,
        c.name AS course_name,
        f.training_course_q1, f.training_course_q2, f.training_course_q3, f.training_course_q4, f.training_course_q5,
        f.instructor_q1, f.instructor_q2, f.instructor_q3, f.instructor_q4, f.instructor_q5,
        f.admin_q1, f.admin_q2, f.admin_q3,
        f.classroom_q1, f.classroom_q2, f.classroom_q3, f.classroom_q4, f.classroom_q5,
        f.vehicle_q1, f.vehicle_q2, f.vehicle_q3,
        f.instructor_comments, f.comments,
        f.created_at
      FROM feedback f
      JOIN enrollments e ON f.enrollment_id = e.enrollment_id
      JOIN users s ON e.user_id = s.user_id
      JOIN users i ON e.instructor_id = i.user_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE s.branch_id = $1
    `;

    const params = [branch_id];
    let paramIndex = 2;

    // Add month filter if provided
    if (month) {
      query += ` AND EXTRACT(MONTH FROM f.created_at) = $${paramIndex}`;
      params.push(parseInt(month));
      paramIndex++;
    }

    // Add year filter if provided
    if (year) {
      query += ` AND EXTRACT(YEAR FROM f.created_at) = $${paramIndex}`;
      params.push(parseInt(year));
      paramIndex++;
    }

    query += ` ORDER BY f.created_at DESC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

//instructor route to get feedback of their students
app.get("/api/instructor/feedback", authenticateToken, async (req, res) => {
  const instructorId = req.user.userId;
  const { month, year } = req.query;

  try {
    let query = `
      SELECT 
        f.feedback_id,
        f.enrollment_id,
        f.instructor_rating,
        s.name AS student_name,
        c.name AS course_name,
        f.training_course_q1, f.training_course_q2, f.training_course_q3, f.training_course_q4, f.training_course_q5,
        f.instructor_q1, f.instructor_q2, f.instructor_q3, f.instructor_q4, f.instructor_q5,
        f.admin_q1, f.admin_q2, f.admin_q3,
        f.classroom_q1, f.classroom_q2, f.classroom_q3, f.classroom_q4, f.classroom_q5,
        f.vehicle_q1, f.vehicle_q2, f.vehicle_q3,
        f.instructor_comments, f.comments,
        f.created_at
      FROM feedback f
      JOIN enrollments e ON f.enrollment_id = e.enrollment_id
      JOIN users s ON e.user_id = s.user_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.instructor_id = $1
    `;

    const params = [instructorId];
    let paramIndex = 2;

    // Add month filter if provided
    if (month) {
      query += ` AND EXTRACT(MONTH FROM f.created_at) = $${paramIndex}`;
      params.push(parseInt(month));
      paramIndex++;
    }

    // Add year filter if provided
    if (year) {
      query += ` AND EXTRACT(YEAR FROM f.created_at) = $${paramIndex}`;
      params.push(parseInt(year));
      paramIndex++;
    }

    query += ` ORDER BY f.created_at DESC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching instructor feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});
//student route to get their own feedback
app.get("/api/student/feedback", authenticateToken, async (req, res) => {
  const studentId = req.user.userId;
  try {
    const result = await pool.query(
      `
      SELECT 
        f.feedback_id,
        f.enrollment_id,
        c.name AS course_name,
        f.training_course_q1, f.training_course_q2, f.training_course_q3, f.training_course_q4, f.training_course_q5,
        f.instructor_q1, f.instructor_q2, f.instructor_q3, f.instructor_q4, f.instructor_q5,
        f.admin_q1, f.admin_q2, f.admin_q3,
        f.classroom_q1, f.classroom_q2, f.classroom_q3, f.classroom_q4, f.classroom_q5,
        f.vehicle_q1, f.vehicle_q2, f.vehicle_q3,
        f.instructor_comments, f.comments,
        f.created_at
      FROM feedback f
      JOIN enrollments e ON f.enrollment_id = e.enrollment_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.user_id = $1
      ORDER BY f.created_at DESC
    `,
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching student feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

//instructor route to post maintenance request
app.post("/api/instructor/maintenance", authenticateToken, async (req, res) => {
  const instructorId = req.user.userId;
  const { vehicle_name, description } = req.body;

  try {
    await pool.query(
      `INSERT INTO maintenance_reports (instructor_id, vehicle_name, description) 
       VALUES ($1, $2, $3)`,
      [instructorId, vehicle_name, description]
    );

    res.status(201).json({ message: "Maintenance report submitted." });
  } catch (err) {
    console.error("Error submitting maintenance:", err);
    res.status(500).json({ error: "Failed to submit maintenance report" });
  }
});

//instructor route to get maintenance reports
app.get("/api/instructor/maintenance", authenticateToken, async (req, res) => {
  const instructorId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM maintenance_reports WHERE instructor_id = $1 ORDER BY created_at DESC`,
      [instructorId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

//admin route to get all maintenance reports
app.get("/api/admin/maintenance", authenticateToken, async (req, res) => {
  const branchId = req.user.branch_id; // nakuha sa token (from admin user)

  try {
    const result = await pool.query(
      `
      SELECT mr.*,
      u.name AS instructor_name
      FROM maintenance_reports mr
      JOIN users u ON mr.instructor_id = u.user_id
      WHERE u.branch_id = $1
      ORDER BY mr.created_at DESC
      `,
      [branchId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

app.put("/api/admin/maintenance/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, price } = req.body;

  const finalPrice = price === "" ? null : price;

  try {
    await pool.query(
      `UPDATE maintenance_reports SET status = $1, price = $2 WHERE maintenance_id = $3`,
      [status, finalPrice, id]
    );
    res.json({ message: "Report updated successfully" });
  } catch (err) {
    console.error("Error updating report:", err);
    res.status(500).json({ error: "Failed to update report" });
  }
});

app.post("/check-user", async (req, res) => {
  const { identifier } = req.body;

  try {
    const result = await pool.query(
      "SELECT role FROM users WHERE email = $1 OR username = $1",
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = result.rows[0].role;
    res.json({ role });
  } catch (error) {
    console.error("Check user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET summary counts for admin dashboard
app.get(
  "/api/admin/enrollments/summary",
  authenticateToken,
  async (req, res) => {
    const adminBranchId = req.user.branch_id;

    try {
      const result = await pool.query(
        `
  
    SELECT 
    COUNT(*) AS total_enrollments,
    COALESCE(SUM(e.amount_paid), 0) AS total_earnings,
    COUNT(*) FILTER (
        WHERE e.instructor_id IS NULL
          AND c.name NOT ILIKE 'Online Theoretical Driving Course'
    ) AS no_instructor_assigned,
    COUNT(*) FILTER (
        WHERE e.payment_status != 'Fully Paid'
    ) AS unpaid_count,
    (
        SELECT COALESCE(SUM(m.price), 0)
        FROM maintenance_reports m
        JOIN users iu ON m.instructor_id = iu.user_id
        WHERE m.status = 'Resolved'
          AND iu.branch_id = $1
          AND DATE_TRUNC('month', m.created_at) = DATE_TRUNC('month', CURRENT_DATE)
    ) AS total_expenses
    FROM enrollments e
    LEFT JOIN schedules s ON e.schedule_id = s.schedule_id
    JOIN users u ON e.user_id = u.user_id
    JOIN courses c ON e.course_id = c.course_id
    WHERE (s.branch_id = $1 OR u.branch_id = $1)
      AND DATE_TRUNC('month', e.enrollment_date) = DATE_TRUNC('month', CURRENT_DATE);



      `,
        [adminBranchId]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// GET SUMMARY FOR MANAGER DASHBOARD (CURRENT MONTH + Online TDC + Maintenance Price)
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const query = `
      WITH enrollment_stats AS (
        SELECT
          COUNT(*) AS total_enrollments,
          SUM(CASE WHEN c.name ILIKE '%ONLINE THEORETICAL DRIVING COURSE%' THEN 1 ELSE 0 END) AS total_online_tdc,
          SUM(CASE WHEN c.name ILIKE '%THEORETICAL DRIVING COURSE%' 
                   AND c.name NOT ILIKE '%ONLINE%' THEN 1 ELSE 0 END) AS total_tdc,
          SUM(CASE WHEN c.name NOT ILIKE '%THEORETICAL DRIVING COURSE%' THEN 1 ELSE 0 END) AS total_pdc,
          COALESCE(SUM(e.amount_paid), 0) AS total_earnings
        FROM enrollments e
        JOIN courses c ON e.course_id = c.course_id
        WHERE DATE_TRUNC('month', e.enrollment_date) = DATE_TRUNC('month', CURRENT_DATE)
      ),
      maintenance_stats AS (
        SELECT COALESCE(SUM(price), 0) AS total_maintenance_price
        FROM maintenance_reports
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
      )
      SELECT *
      FROM enrollment_stats, maintenance_stats;
    `;

    const { rows } = await pool.query(query);
    const stats = rows[0];

    res.json({
      total_enrollments: parseInt(stats.total_enrollments, 10),
      total_online_tdc: parseInt(stats.total_online_tdc, 10),
      total_tdc: parseInt(stats.total_tdc, 10),
      total_pdc: parseInt(stats.total_pdc, 10),
      total_earnings: parseFloat(stats.total_earnings),
      total_maintenance_price: parseFloat(stats.total_maintenance_price),
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get student records per branch
app.get("/api/admin/student-records", authenticateToken, async (req, res) => {
  const adminBranchId = req.user.branch_id;

  try {
    const result = await pool.query(
      `
      SELECT 
        u.user_id,
        u.name AS student_name,
        u.email,
        e.contact_number,
        e.address,
        e.birthday,
        e.age,
        e.civil_status,
        e.nationality,
        COALESCE(e.gender, 'N/A') AS gender,
        e.is_pregnant,
        e.is_pwd,
        e.enrollment_date,
        e.payment_status,
        e.amount_paid,
        c.name AS course_name,
        b.name AS branch_name
      FROM enrollments e
      JOIN users u ON e.user_id = u.user_id
      JOIN courses c ON e.course_id = c.course_id
      JOIN branches b ON u.branch_id = b.branch_id
      WHERE u.branch_id = $1
      ORDER BY e.enrollment_date DESC
      `,
      [adminBranchId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching student records:", err);
    res.status(500).json({ error: "Failed to fetch student records" });
  }
});

app.get("/api/manager/student-records", async (req, res) => {
  try {
    const { branch_id, month, year } = req.query;
    let query = `
      SELECT
        u.user_id,
        u.name AS student_name,
        u.email,
        e.contact_number,
        e.address,
        b.name AS branch_name,
        c.name AS course_name,
        e.enrollment_date,
        e.amount_paid,
        e.payment_status,
        e.birthday,
        e.age,
        e.civil_status,
        e.nationality
      FROM enrollments e
      JOIN users u ON e.user_id = u.user_id
      JOIN branches b ON u.branch_id = b.branch_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE 1=1
    `;

    let params = [];
    let idx = 1;

    if (branch_id) {
      query += ` AND u.branch_id = $${idx++}`;
      params.push(parseInt(branch_id));
    }
    if (month) {
      query += ` AND EXTRACT(MONTH FROM e.enrollment_date) = $${idx++}`;
      params.push(parseInt(month));
    }
    if (year) {
      query += ` AND EXTRACT(YEAR FROM e.enrollment_date) = $${idx++}`;
      params.push(parseInt(year));
    }

    query += ` ORDER BY e.enrollment_date DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching student records:", err);
    res.status(500).json({ error: "Failed to fetch student records" });
  }
});

// 📌 Fetch Branches
app.get("/api/branches/records", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT branch_id, name FROM branches ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching branches:", err);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
});

//  Fetch Available Years
app.get("/api/manager/years", async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT EXTRACT(YEAR FROM enrollment_date)::INT AS year
      FROM enrollments
      ORDER BY year DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows.map((r) => r.year));
  } catch (err) {
    console.error("❌ Error fetching years:", err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
});

// get all branches (for dropdown filter)
app.get("/api/branches/records", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT branch_id, name FROM branches ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching branches:", err);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
});

// GET analytics data for manager dashboard

app.get("/api/analytics", async (req, res) => {
  try {
    const { branch_id, year, month } = req.query;

    // Build dynamic WHERE clauses and parameters
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Branch filter
    if (branch_id) {
      whereConditions.push(`u.branch_id = $${paramIndex}`);
      queryParams.push(branch_id);
      paramIndex++;
    }

    // Year filter
    if (year) {
      whereConditions.push(
        `EXTRACT(YEAR FROM e.enrollment_date) = $${paramIndex}`
      );
      queryParams.push(year);
      paramIndex++;
    }

    // Month filter
    if (month) {
      whereConditions.push(
        `EXTRACT(MONTH FROM e.enrollment_date) = $${paramIndex}`
      );
      queryParams.push(month);
      paramIndex++;
    }

    // Create WHERE clause
    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";
    const whereClauseWithAnd =
      whereConditions.length > 0 ? `AND ${whereConditions.join(" AND ")}` : "";

    // Helper function to build payment status WHERE clause
    const buildPaymentWhereClause = () => {
      const paymentConditions = ["e.payment_status = 'Fully Paid'"];
      if (whereConditions.length > 0) {
        paymentConditions.push(...whereConditions);
      }
      return `WHERE ${paymentConditions.join(" AND ")}`;
    };

    // Build WHERE clause for maintenance reports
    const buildMaintenanceWhereClause = () => {
      let maintenanceConditions = [];
      let maintenanceParams = [];
      let maintenanceParamIndex = 1;

      if (branch_id) {
        maintenanceConditions.push(`u.branch_id = $${maintenanceParamIndex}`);
        maintenanceParams.push(branch_id);
        maintenanceParamIndex++;
      }

      if (year) {
        maintenanceConditions.push(
          `EXTRACT(YEAR FROM mr.created_at) = $${maintenanceParamIndex}`
        );
        maintenanceParams.push(year);
        maintenanceParamIndex++;
      }

      if (month) {
        maintenanceConditions.push(
          `EXTRACT(MONTH FROM mr.created_at) = $${maintenanceParamIndex}`
        );
        maintenanceParams.push(month);
        maintenanceParamIndex++;
      }

      const whereClause =
        maintenanceConditions.length > 0
          ? `WHERE ${maintenanceConditions.join(" AND ")}`
          : "";

      return { whereClause, params: maintenanceParams };
    };

    // Enrollment trends per month (with filters)
    const trendsQuery = `
      SELECT 
        TO_CHAR(e.enrollment_date, 'YYYY-MM') AS month, 
        COUNT(*) AS enrollments
      FROM enrollments e
      JOIN users u ON e.user_id = u.user_id
      ${whereClause}
      GROUP BY TO_CHAR(e.enrollment_date, 'YYYY-MM')
      ORDER BY month;
    `;
    const trendsResult = await pool.query(trendsQuery, queryParams);
    const enrollmentTrends = trendsResult.rows;

    // Students per course (with filters)
    const coursesQuery = `
      SELECT c.name AS "courseName", COUNT(e.enrollment_id) AS students
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN users u ON e.user_id = u.user_id
      ${whereClause}
      GROUP BY c.name
      ORDER BY c.name
    `;
    const coursesResult = await pool.query(coursesQuery, queryParams);
    const courseStats = coursesResult.rows;

    // Top 5 most enrolled courses (with filters)
    const topCoursesQuery = `
      SELECT c.name AS "courseName", COUNT(e.enrollment_id) AS students
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN users u ON e.user_id = u.user_id
      ${whereClause}
      GROUP BY c.name
      ORDER BY students DESC
      LIMIT 5
    `;
    const topCoursesResult = await pool.query(topCoursesQuery, queryParams);
    const topCourses = topCoursesResult.rows;

    // Least enrolled courses (with filters)
    const leastCoursesQuery = `
      SELECT c.name AS "courseName", COUNT(e.enrollment_id) AS students
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN users u ON e.user_id = u.user_id
      ${whereClause}
      GROUP BY c.name
      ORDER BY students ASC
      LIMIT 5
    `;
    const leastCoursesResult = await pool.query(leastCoursesQuery, queryParams);
    const leastCourses = leastCoursesResult.rows;

    // Revenue per course (with filters) - separate params for payment status queries
    const revenueParams = [...queryParams]; // Copy existing params for revenue queries

    const revenuePerCourseQuery = `
      SELECT c.name AS "courseName", COALESCE(SUM(e.amount_paid), 0) AS revenue
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN users u ON e.user_id = u.user_id
      ${buildPaymentWhereClause()}
      GROUP BY c.name
      ORDER BY revenue DESC
    `;
    const revenuePerCourseResult = await pool.query(
      revenuePerCourseQuery,
      revenueParams
    );
    const revenuePerCourse = revenuePerCourseResult.rows;

    // Monthly revenue trend (with filters)
    const monthlyRevenueQuery = `
      SELECT TO_CHAR(e.enrollment_date, 'YYYY-MM') AS month, COALESCE(SUM(e.amount_paid), 0) AS revenue
      FROM enrollments e
      JOIN users u ON e.user_id = u.user_id
      ${buildPaymentWhereClause()}
      GROUP BY month
      ORDER BY month
    `;
    const monthlyRevenueResult = await pool.query(
      monthlyRevenueQuery,
      revenueParams
    );
    const monthlyRevenue = monthlyRevenueResult.rows;

    // Total revenue (with filters)
    const totalRevenueQuery = `
      SELECT COALESCE(SUM(e.amount_paid), 0) AS total
      FROM enrollments e
      JOIN users u ON e.user_id = u.user_id
      ${buildPaymentWhereClause()}
    `;
    const totalRevenueResult = await pool.query(
      totalRevenueQuery,
      revenueParams
    );
    const totalRevenue = parseFloat(totalRevenueResult.rows[0].total) || 0;

    // === MAINTENANCE COST QUERIES ===
    const maintenanceWhere = buildMaintenanceWhereClause();

    // Total maintenance cost (with filters)
    const totalMaintenanceCostQuery = `
      SELECT COALESCE(SUM(mr.price), 0) AS total
      FROM maintenance_reports mr
      JOIN users u ON mr.instructor_id = u.user_id
      ${maintenanceWhere.whereClause}
    `;
    const totalMaintenanceCostResult = await pool.query(
      totalMaintenanceCostQuery,
      maintenanceWhere.params
    );
    const totalMaintenanceCost =
      parseFloat(totalMaintenanceCostResult.rows[0].total) || 0;

    // Maintenance cost per branch (with filters)
    const maintenanceCostPerBranchQuery = `
      SELECT 
        b.name AS "branchName", 
        COALESCE(SUM(mr.price), 0) AS cost,
        COUNT(mr.maintenance_id) AS "maintenanceCount"
      FROM maintenance_reports mr
      JOIN users u ON mr.instructor_id = u.user_id
      JOIN branches b ON u.branch_id = b.branch_id
      ${maintenanceWhere.whereClause}
      GROUP BY b.name
      ORDER BY cost DESC
    `;
    const maintenanceCostPerBranchResult = await pool.query(
      maintenanceCostPerBranchQuery,
      maintenanceWhere.params
    );
    const maintenanceCostPerBranch = maintenanceCostPerBranchResult.rows;

    // Get branch info if filtering by branch
    let branchInfo = null;
    if (branch_id) {
      const branchQuery = `SELECT name FROM branches WHERE branch_id = $1`;
      const branchResult = await pool.query(branchQuery, [branch_id]);
      branchInfo = branchResult.rows[0] || null;
    }

    // Get all branches for dropdown/filter options
    const branchesQuery = `SELECT branch_id, name FROM branches ORDER BY name`;
    const branchesResult = await pool.query(branchesQuery);
    const branches = branchesResult.rows;

    // Response data with maintenance costs
    const responseData = {
      enrollmentTrends,
      courseStats,
      totalRevenue,
      topCourses,
      leastCourses,
      revenuePerCourse,
      monthlyRevenue,
      // Maintenance data (only per branch)
      totalMaintenanceCost,
      maintenanceCostPerBranch,
      branchInfo,
      branches,
      selectedBranchId: branch_id || null,
      filters: {
        branchId: branch_id || null,
        year: year || null,
        month: month || null,
        monthName: month ? getMonthName(parseInt(month)) : null,
      },
    };

    res.json(responseData);
  } catch (err) {
    console.error("Analytics API Error:", err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
});

// Helper function to get month name
function getMonthName(monthNumber) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1] || null;
}

// Get instructors for this admin's branch
app.get("/api/admin/instructors", authenticateToken, async (req, res) => {
  try {
    const adminBranch = req.user.branch_id; // galing sa token/session

    // Debug logs
    console.log("Admin user:", req.user);
    console.log("Admin branch_id:", adminBranch);

    const result = await pool.query(
      `SELECT u.user_id AS id, 
              u.name, 
              u.username, 
              u.role, 
              u.branch_id,
              b.name AS branch_name
       FROM users u
       JOIN branches b ON u.branch_id = b.branch_id
       WHERE u.role = 'instructor' 
         AND u.branch_id = $1
       ORDER BY u.user_id ASC`,
      [adminBranch]
    );

    console.log("Found instructors:", result.rows);

    // If no instructors found, let's check if there are ANY instructors in the database
    if (result.rows.length === 0) {
      const allInstructors = await pool.query(
        `SELECT u.user_id, u.name, u.branch_id, b.name as branch_name 
         FROM users u 
         LEFT JOIN branches b ON u.branch_id = b.branch_id 
         WHERE u.role = 'instructor'`
      );
      console.log("All instructors in database:", allInstructors.rows);

      const adminBranchInfo = await pool.query(
        `SELECT branch_id, name FROM branches WHERE branch_id = $1`,
        [adminBranch]
      );
      console.log("Admin's branch info:", adminBranchInfo.rows);
    }

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching instructors:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Mark attendance (restricted by branch)
app.post(
  "/api/admin/instructors/:id/attendance",
  authenticateToken,
  async (req, res) => {
    const instructorId = req.params.id;
    const { status } = req.body;
    const adminBranch = req.user.branch_id;

    console.log(
      "Marking attendance for instructor:",
      instructorId,
      "Status:",
      status,
      "Admin branch:",
      adminBranch
    );

    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      // check muna kung yung instructor ay nasa parehong branch
      const check = await pool.query(
        `SELECT user_id, name FROM users WHERE user_id = $1 AND branch_id = $2 AND role = 'instructor'`,
        [instructorId, adminBranch]
      );

      console.log("Instructor check result:", check.rows);

      if (check.rowCount === 0) {
        return res.status(403).json({ message: "Not allowed for this branch" });
      }

      // Check if attendance already exists for today
      const existingAttendance = await pool.query(
        `SELECT * FROM instructor_attendance WHERE user_id = $1 AND date = CURRENT_DATE`,
        [instructorId]
      );

      if (existingAttendance.rowCount > 0) {
        // Update existing attendance
        await pool.query(
          `UPDATE instructor_attendance SET status = $1 WHERE user_id = $2 AND date = CURRENT_DATE`,
          [status, instructorId]
        );
        res.json({ message: "✅ Attendance updated" });
      } else {
        // Insert new attendance
        await pool.query(
          `INSERT INTO instructor_attendance (user_id, date, status)
           VALUES ($1, CURRENT_DATE, $2)`,
          [instructorId, status]
        );
        res.json({ message: "✅ Attendance recorded" });
      }
    } catch (err) {
      console.error("❌ Error recording attendance:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// Get attendance records (filtered by branch)
app.get(
  "/api/admin/instructors/attendance",
  authenticateToken,
  async (req, res) => {
    try {
      const adminBranch = req.user.branch_id;

      console.log("Fetching attendance for branch:", adminBranch);

      const result = await pool.query(
        `SELECT ia.attendance_id, 
                TO_CHAR(ia.date, 'YYYY-MM-DD') as date, 
                ia.status,
                u.user_id, 
                u.name AS instructor_name, 
                b.name AS branch_name
         FROM instructor_attendance ia
         JOIN users u ON ia.user_id = u.user_id
         JOIN branches b ON u.branch_id = b.branch_id
         WHERE u.role = 'instructor' 
           AND u.branch_id = $1
         ORDER BY ia.date DESC, u.name ASC`,
        [adminBranch]
      );

      console.log("Attendance records found:", result.rows.length);

      res.json(result.rows);
    } catch (err) {
      console.error("❌ Error fetching attendance records:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// Additional debug route
app.get("/api/admin/debug/user-info", authenticateToken, async (req, res) => {
  try {
    console.log("Token user info:", req.user);

    const adminInfo = await pool.query(
      `SELECT u.user_id, u.name, u.username, u.role, u.branch_id, b.name as branch_name
       FROM users u
       LEFT JOIN branches b ON u.branch_id = b.branch_id
       WHERE u.user_id = $1`,
      [req.user.user_id]
    );

    res.json({
      tokenInfo: req.user,
      databaseInfo: adminInfo.rows[0],
    });
  } catch (err) {
    console.error("Debug error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all branches
app.get("/api/branches", authenticateToken, async (req, res) => {
  try {
    console.log("🔍 Fetching branches...");

    const result = await pool.query(`
      SELECT branch_id as id, name
      FROM branches 
      ORDER BY name ASC
    `);

    console.log("✅ Branches fetched:", result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching branches:", error);
    res.status(500).json({
      message: "Error fetching branches",
      error: error.message,
    });
  }
});

// Get all attendance records across all branches
app.get("/api/attendance/all", authenticateToken, async (req, res) => {
  try {
    console.log("🔍 Fetching all attendance records...");

    const result = await pool.query(`
      SELECT 
        ia.attendance_id,
        TO_CHAR(ia.date, 'YYYY-MM-DD') as date,
        ia.status,
        ia.user_id,
        u.name as instructor_name,
        u.username,
        u.branch_id,
        b.name as branch_name
      FROM instructor_attendance ia
      INNER JOIN users u ON ia.user_id = u.user_id
      INNER JOIN branches b ON u.branch_id = b.branch_id
      WHERE u.role = 'instructor'
      ORDER BY ia.date DESC, b.name ASC, u.name ASC
    `);

    console.log("✅ Attendance records fetched:", result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching attendance records:", error);
    res.status(500).json({
      message: "Error fetching attendance records",
      error: error.message,
    });
  }
});

// Optional: Get today's attendance specifically
app.get("/api/attendance/today", authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    console.log("🔍 Fetching today's attendance for:", today);

    const result = await pool.query(
      `
      SELECT 
        ia.attendance_id,
        TO_CHAR(ia.date, 'YYYY-MM-DD') as date,
        ia.status,
        ia.user_id,
        u.name as instructor_name,
        u.username,
        u.branch_id,
        b.name as branch_name
      FROM instructor_attendance ia
      INNER JOIN users u ON ia.user_id = u.user_id
      INNER JOIN branches b ON u.branch_id = b.branch_id
      WHERE u.role = 'instructor' AND DATE(ia.date) = $1
      ORDER BY b.name ASC, u.name ASC
    `,
      [today]
    );

    console.log("✅ Today's attendance records fetched:", result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching today's attendance:", error);
    res.status(500).json({
      message: "Error fetching today's attendance",
      error: error.message,
    });
  }
});

// Get user profile
app.get("/api/profile", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "SELECT name, username FROM users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
app.put("/api/profile", authenticateToken, async (req, res) => {
  const { name, username } = req.body;
  const userId = req.user.userId;

  try {
    // Validate input
    if (!name || !username) {
      return res
        .status(400)
        .json({ message: "Name and username are required" });
    }

    if (username.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters long",
      });
    }

    // Check if username is already taken by another user
    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE username = $1 AND user_id != $2",
      [username, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Username is already taken",
      });
    }

    // Update the user profile
    await pool.query(
      "UPDATE users SET name = $1, username = $2 WHERE user_id = $3",
      [name, username, userId]
    );

    res.json({
      message: "Profile updated successfully",
      name,
      username,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// manager change password
app.put("/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "SELECT password FROM users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [
      hashed,
      userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/feedback/status", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Query feedback table to get enrollments na may feedback na
    const query = `
      SELECT DISTINCT enrollment_id 
      FROM feedback 
      WHERE user_id = ? OR enrollment_id IN (
        SELECT enrollment_id FROM enrollments WHERE user_id = ?
      )
    `;

    const results = await db.query(query, [userId, userId]);
    const submittedEnrollments = results.map((row) => row.enrollment_id);

    res.json({ submittedEnrollments });
  } catch (error) {
    res.status(500).json({ error: "Failed to check feedback status" });
  }
});

// 📌 Export Student Records as CSV
app.get("/api/manager/export-records", async (req, res) => {
  try {
    const { branch_id, month, year } = req.query;
    let query = `
      SELECT
        u.name AS student_name,
        u.email,
        e.contact_number,
        e.address,
        b.name AS branch_name,
        c.name AS course_name,
        e.enrollment_date,
        e.amount_paid,
        e.payment_status,
        e.birthday,
        e.age,
        e.civil_status,
        e.nationality
      FROM enrollments e
      JOIN users u ON e.user_id = u.user_id
      JOIN branches b ON u.branch_id = b.branch_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE 1=1
    `;

    let params = [];
    let idx = 1;

    if (branch_id) {
      query += ` AND u.branch_id = $${idx++}`;
      params.push(parseInt(branch_id));
    }
    if (month) {
      query += ` AND EXTRACT(MONTH FROM e.enrollment_date) = $${idx++}`;
      params.push(parseInt(month));
    }
    if (year) {
      query += ` AND EXTRACT(YEAR FROM e.enrollment_date) = $${idx++}`;
      params.push(parseInt(year));
    }

    query += ` ORDER BY e.enrollment_date DESC`;

    const result = await pool.query(query, params);

    // Map rows to format dates
    const formattedRows = result.rows.map((row) => ({
      ...row,
      enrollment_date: row.enrollment_date
        ? new Date(row.enrollment_date).toLocaleDateString("en-US")
        : "",
      birthday: row.birthday
        ? new Date(row.birthday).toLocaleDateString("en-US")
        : "",
    }));

    const fields = [
      "student_name",
      "email",
      "contact_number",
      "address",
      "branch_name",
      "course_name",
      "enrollment_date",
      "birthday",
      "age",
      "civil_status",
      "nationality",
      "amount_paid",
      "payment_status",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(formattedRows);

    res.header("Content-Type", "text/csv");
    res.attachment("student_records.csv");
    res.send(csv);
  } catch (err) {
    console.error("❌ Error exporting student records:", err);
    res.status(500).json({ error: "Failed to export student records" });
  }
});

app.delete(
  "/api/admin/enrollments/:enrollmentId",
  authenticateToken,
  async (req, res) => {
    const { enrollmentId } = req.params;
    const adminBranchId = req.user.branch_id;

    console.log("🔍 Delete request received:", {
      enrollmentId,
      adminBranchId,
      adminUser: req.user.email,
    });

    try {
      // Verify enrollment exists and belongs to admin's branch
      const checkResult = await pool.query(
        `SELECT e.enrollment_id, e.user_id, e.course_id,
              u.name AS student_name, c.name AS course_name,
              s.branch_id, u.branch_id AS student_branch_id
       FROM enrollments e
       JOIN users u ON e.user_id = u.user_id
       JOIN courses c ON e.course_id = c.course_id
       LEFT JOIN schedules s ON e.schedule_id = s.schedule_id
       WHERE e.enrollment_id = $1`,
        [enrollmentId]
      );

      console.log("📊 Enrollment check result:", checkResult.rows);

      if (checkResult.rows.length === 0) {
        console.error("❌ Enrollment not found:", enrollmentId);
        return res.status(404).json({ error: "Enrollment not found" });
      }

      const enrollment = checkResult.rows[0];

      // ✅ FIXED: Better access logic
      const hasAccess =
        // If schedule has a branch, check if it matches admin's branch
        (enrollment.branch_id !== null &&
          enrollment.branch_id === adminBranchId) ||
        // If no schedule branch (null), check if student belongs to admin's branch
        (enrollment.branch_id === null &&
          enrollment.student_branch_id === adminBranchId) ||
        // Special case for online courses
        (enrollment.course_name === "ONLINE THEORETICAL DRIVING COURSE" &&
          enrollment.student_branch_id === adminBranchId);

      console.log("🔐 Access check:", {
        enrollmentBranchId: enrollment.branch_id,
        adminBranchId,
        studentBranchId: enrollment.student_branch_id,
        courseName: enrollment.course_name,
        hasAccess,
      });

      if (!hasAccess) {
        console.error("❌ Permission denied");
        return res.status(403).json({
          error: "You don't have permission to delete this enrollment",
        });
      }

      await pool.query("BEGIN");

      const deleteResult = await pool.query(
        `DELETE FROM enrollments WHERE enrollment_id = $1 RETURNING *`,
        [enrollmentId]
      );

      console.log("🗑️ Delete result:", deleteResult.rows);

      if (deleteResult.rowCount === 0) {
        await pool.query("ROLLBACK");
        console.error("❌ Delete failed - no rows affected");
        return res
          .status(404)
          .json({ error: "Enrollment not found or already deleted" });
      }

      await pool.query("COMMIT");

      console.log(
        `✅ Enrollment deleted: ID ${enrollmentId}, Student: ${enrollment.student_name}`
      );

      res.json({
        message: "Enrollment deleted successfully",
        deleted_enrollment: {
          enrollment_id: enrollmentId,
          student_name: enrollment.student_name,
          course_name: enrollment.course_name,
        },
      });
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error("❌ Error deleting enrollment:", error);
      res.status(500).json({
        error: "Failed to delete enrollment. Please try again.",
        details: error.message,
      });
    }
  }
);

// Add this to your Express backend server
// No additional packages needed - uses native fetch

app.post("/api/generate-insights", async (req, res) => {
  try {
    const { chartType, data, context } = req.body;

    // Validate input
    if (!chartType || !data || !context) {
      return res.status(400).json({
        error: "Missing required fields: chartType, data, or context",
      });
    }

    // Create a simple, concise prompt
    const prompt = `Analyze this ${chartType} data briefly:

${JSON.stringify(data, null, 2)}

Context: ${context}

Give me 3-4 SHORT insights using simple words. Make each point 1 sentence only. Focus on what's important and what to do.`;

    // Call Google Gemini API (using gemini-2.0-flash - more stable)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 250,
            candidateCount: 1,
            stopSequences: [],
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);

      // Handle specific error cases
      if (response.status === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded. Please try again in a moment.",
        });
      }

      if (response.status === 401) {
        return res.status(500).json({
          error: "Invalid API key. Please check your Gemini API configuration.",
        });
      }

      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();

    // Log the full response for debugging
    console.log("Gemini API Response:", JSON.stringify(result, null, 2));

    // Extract the generated text with better error handling
    if (result.candidates && result.candidates.length > 0) {
      const candidate = result.candidates[0];

      // Check if content and parts exist
      if (
        candidate.content &&
        candidate.content.parts &&
        candidate.content.parts.length > 0
      ) {
        const insights = candidate.content.parts[0].text;

        res.json({
          insights,
          success: true,
        });
      } else if (candidate.finishReason === "MAX_TOKENS") {
        // Handle MAX_TOKENS error
        throw new Error(
          "Response was too long and got cut off. Please try again with a smaller dataset."
        );
      } else if (candidate.finishReason === "SAFETY") {
        // Handle safety filter
        throw new Error(
          "Content was blocked by safety filters. Please try with different data."
        );
      } else {
        console.error("No parts in response. Candidate:", candidate);
        throw new Error("No content generated - response may be empty");
      }
    } else if (result.error) {
      console.error("Gemini API returned error:", result.error);
      throw new Error(result.error.message || "Gemini API error");
    } else {
      console.error("No candidates in response:", result);
      throw new Error("No insights generated - empty response");
    }
  } catch (error) {
    console.error("Generate Insights Error:", error);
    res.status(500).json({
      error: "Failed to generate insights. Please try again.",
      details: error.message,
    });
  }
});

// Health check endpoint to test API key
app.get("/api/check-gemini", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${process.env.GEMINI_API_KEY}`
    );

    if (response.ok) {
      res.json({
        status: "Gemini API is configured correctly",
        success: true,
      });
    } else {
      res.status(500).json({
        status: "Gemini API key may be invalid",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed to connect to Gemini API",
      success: false,
      error: error.message,
    });
  }
});

// GET all vehicles (filtered by admin's branch)
app.get("/api/vehicles", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Token data:", {
      role: decoded.role,
      branch_id: decoded.branch_id,
    });

    let result;

    // Check if user is admin AND has a branch_id
    if (decoded.role === "administrative_staff" && decoded.branch_id) {
      result = await pool.query(
        "SELECT * FROM vehicle_units WHERE branch_id = $1 ORDER BY created_at DESC",
        [decoded.branch_id]
      );
    } else {
      // Manager or no branch_id = show all
      result = await pool.query(
        "SELECT * FROM vehicle_units ORDER BY created_at DESC"
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error in /api/vehicles:", error);
    res.status(500).json({ error: "❌ Database error" });
  }
});

// POST new vehicle (automatically use admin's branch)
app.post("/api/vehicles", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { car_name, vehicle_category, type, total_units } = req.body;

    // Use admin's branch_id from token
    const branch_id = decoded.branch_id;

    await pool.query(
      "INSERT INTO vehicle_units (branch_id, car_name, vehicle_category, type, total_units) VALUES ($1, $2, $3, $4, $5)",
      [branch_id, car_name, vehicle_category, type, total_units]
    );

    res.json({ message: "✅ Vehicle added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Database error" });
  }
});

// PUT update vehicle
app.put("/api/vehicles/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = req.params;
    const { car_name, vehicle_category, type, total_units } = req.body;

    // Check if vehicle belongs to admin's branch
    const checkResult = await pool.query(
      "SELECT branch_id FROM vehicle_units WHERE vehicle_id = $1",
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "❌ Vehicle not found" });
    }

    if (
      decoded.role === "admin" &&
      checkResult.rows[0].branch_id !== decoded.branch_id
    ) {
      return res.status(403).json({ error: "❌ Unauthorized" });
    }

    await pool.query(
      "UPDATE vehicle_units SET car_name = $1, vehicle_category = $2, type = $3, total_units = $4 WHERE vehicle_id = $5",
      [car_name, vehicle_category, type, total_units, id]
    );

    res.json({ message: "✅ Vehicle updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Database error" });
  }
});

// DELETE vehicle
app.delete("/api/vehicles/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = req.params;

    // Check if vehicle belongs to admin's branch
    const checkResult = await pool.query(
      "SELECT branch_id FROM vehicle_units WHERE vehicle_id = $1",
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "❌ Vehicle not found" });
    }

    if (
      decoded.role === "admin" &&
      checkResult.rows[0].branch_id !== decoded.branch_id
    ) {
      return res.status(403).json({ error: "❌ Unauthorized" });
    }

    await pool.query("DELETE FROM vehicle_units WHERE vehicle_id = $1", [id]);

    res.json({ message: "✅ Vehicle deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Database error" });
  }
});

app.get("/api/schedules/with-availability", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { course_id } = req.query;

    if (!course_id) {
      return res.status(400).json({ error: "Course ID required" });
    }

    // Get course details including mode
    const courseRes = await pool.query(
      "SELECT name, branch_id, vehicle_category, type, mode FROM courses WHERE course_id = $1",
      [course_id]
    );

    if (courseRes.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const { branch_id, vehicle_category, type, mode } = courseRes.rows[0];

    // ✅ Check if it's a theoretical course (ftof or online)
    const isTheoreticalCourse = mode === "ftof" || mode === "online";

    if (isTheoreticalCourse) {
      // For theoretical courses, return theoretical schedules without vehicle info
      const schedules = await pool.query(
        `SELECT schedule_id, date as start_date, start_time, end_time, slots, is_theoretical, branch_id
         FROM schedules 
         WHERE branch_id = $1 
         AND is_theoretical = true
         AND date >= CURRENT_DATE
         AND slots > 0
         ORDER BY date, start_time`,
        [branch_id]
      );

      // Return as-is, no vehicle availability needed for theoretical
      return res.json(schedules.rows);
    }

    // ✅ For practical courses, check vehicle availability
    if (!vehicle_category || !type) {
      return res.json([]); // Practical course needs vehicle info
    }

    // Get total vehicles available for this course type
    const vehicleCountRes = await pool.query(
      `SELECT COALESCE(SUM(total_units), 0) as total_vehicles
       FROM vehicle_units
       WHERE branch_id = $1 
       AND vehicle_category = $2 
       AND type = $3`,
      [branch_id, vehicle_category, type]
    );

    const totalVehicles = parseInt(vehicleCountRes.rows[0].total_vehicles);

    if (totalVehicles === 0) {
      return res.json([]); // No vehicles available at all
    }

    // Get all future practical schedules for this branch
    const schedulesRes = await pool.query(
      `SELECT schedule_id, date as start_date, start_time, end_time, slots, is_theoretical, branch_id
       FROM schedules 
       WHERE branch_id = $1 
       AND is_theoretical = false
       AND date >= CURRENT_DATE
       AND slots > 0
       ORDER BY date, start_time`,
      [branch_id]
    );

    const schedules = schedulesRes.rows;

    // For each schedule, check how many vehicles are already booked
    const schedulesWithAvailability = await Promise.all(
      schedules.map(async (schedule) => {
        // Count enrollments that conflict with this schedule's time
        const conflictQuery = await pool.query(
          `SELECT COUNT(DISTINCT e.enrollment_id) as booked_count
           FROM enrollments e
           JOIN enrollment_schedules es ON e.enrollment_id = es.enrollment_id
           JOIN schedules s ON es.schedule_id = s.schedule_id
           WHERE e.vehicle_category = $1
           AND e.vehicle_type = $2
           AND s.branch_id = $3
           AND e.status IN ('pending', 'active', 'ongoing')
           AND s.date = $4
           AND (
             -- Time overlap check: schedules overlap if one starts before the other ends
             (s.start_time < $6::time AND s.end_time > $5::time) OR
             (s.start_time >= $5::time AND s.start_time < $6::time)
           )`,
          [
            vehicle_category,
            type,
            branch_id,
            schedule.start_date,
            schedule.start_time,
            schedule.end_time,
          ]
        );

        const bookedVehicles = parseInt(conflictQuery.rows[0].booked_count);
        const availableVehicles = totalVehicles - bookedVehicles;

        return {
          ...schedule,
          available_vehicles: Math.max(0, availableVehicles),
          total_vehicles: totalVehicles,
        };
      })
    );

    // Filter out schedules with no available vehicles
    const availableSchedules = schedulesWithAvailability.filter(
      (s) => s.available_vehicles > 0
    );

    res.json(availableSchedules);
  } catch (error) {
    console.error("Error fetching schedules with availability:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

// Check vehicle availability for specific schedules
app.post("/api/vehicles/check-availability", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { vehicle_category, vehicle_type, schedule_ids } = req.body;

    if (
      !vehicle_category ||
      !vehicle_type ||
      !schedule_ids ||
      schedule_ids.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get schedule details
    const scheduleQuery = await pool.query(
      `SELECT schedule_id, date, start_time, end_time, branch_id 
       FROM schedules 
       WHERE schedule_id = ANY($1)`,
      [schedule_ids]
    );

    if (scheduleQuery.rows.length === 0) {
      return res.status(404).json({ error: "Schedules not found" });
    }

    const schedules = scheduleQuery.rows;
    const branchId = schedules[0].branch_id;

    // Get total vehicles of this type for the branch
    const vehicleQuery = await pool.query(
      `SELECT COUNT(*) as total_vehicles
       FROM vehicle_units
       WHERE branch_id = $1 
       AND vehicle_category = $2 
       AND type = $3`,
      [branchId, vehicle_category, vehicle_type]
    );

    const totalVehicles = parseInt(vehicleQuery.rows[0].total_vehicles);

    if (totalVehicles === 0) {
      return res.json({
        available: false,
        available_units: 0,
        message: "No vehicles of this type at this branch",
      });
    }

    // Check for conflicts with existing enrollments for each schedule
    let maxConflicts = 0;

    for (const schedule of schedules) {
      // Count enrollments that overlap with this schedule's time slot
      const conflictQuery = await pool.query(
        `SELECT COUNT(DISTINCT e.enrollment_id) as conflict_count
         FROM enrollments e
         JOIN enrollment_schedules es ON e.enrollment_id = es.enrollment_id
         JOIN schedules s ON es.schedule_id = s.schedule_id
         WHERE e.vehicle_category = $1
         AND e.vehicle_type = $2
         AND s.branch_id = $3
         AND e.status IN ('pending', 'active', 'ongoing')
         AND s.date = $4
         AND (
           s.start_time < $6::time AND s.end_time > $5::time
         )`,
        [
          vehicle_category,
          vehicle_type,
          branchId,
          schedule.date,
          schedule.start_time,
          schedule.end_time,
        ]
      );

      const conflicts = parseInt(conflictQuery.rows[0].conflict_count);
      maxConflicts = Math.max(maxConflicts, conflicts);
    }

    const availableUnits = totalVehicles - maxConflicts;

    res.json({
      available: availableUnits > 0,
      available_units: Math.max(0, availableUnits),
      total_units: totalVehicles,
      current_bookings: maxConflicts,
    });
  } catch (error) {
    console.error("Error checking vehicle availability:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

// Create backups folder
const backupsDir = path.join(__dirname, "backups");
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// Test connection
pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully");
  }
});

// Backup settings
let backupSettings = {
  enabled: false,
  frequency: "daily",
  lastBackup: null,
};

let activeCronJobs = {};

// MAIN BACKUP FUNCTION

const createBackup = async () => {
  const client = await pool.connect();

  try {
    console.log(`\n[${new Date().toISOString()}] 🔄 Starting backup...`);

    let sqlDump = "";

    // Header
    sqlDump += `-- ========================================\n`;
    sqlDump += `-- PostgreSQL Database Backup\n`;
    sqlDump += `-- Database: ${process.env.DB_NAME}\n`;
    sqlDump += `-- Created: ${new Date().toISOString()}\n`;
    sqlDump += `-- ========================================\n\n`;

    // Settings
    sqlDump += `SET statement_timeout = 0;\n`;
    sqlDump += `SET lock_timeout = 0;\n`;
    sqlDump += `SET client_encoding = 'UTF8';\n`;
    sqlDump += `SET standard_conforming_strings = on;\n`;
    sqlDump += `SET check_function_bodies = false;\n`;
    sqlDump += `SET xmloption = content;\n`;
    sqlDump += `SET client_min_messages = warning;\n`;
    sqlDump += `SET row_security = off;\n\n`;

    // Get all tables
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log(`   📊 Found ${tablesResult.rows.length} tables`);

    // Get all foreign keys FIRST
    const fkResult = await client.query(`
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    `);

    const foreignKeys = {};
    fkResult.rows.forEach((fk) => {
      if (!foreignKeys[fk.table_name]) foreignKeys[fk.table_name] = [];
      foreignKeys[fk.table_name].push(fk);
    });

    // STEP 1: CREATE TABLES (without FK)
    sqlDump += `-- ========================================\n`;
    sqlDump += `-- TABLE STRUCTURES\n`;
    sqlDump += `-- ========================================\n\n`;

    for (const { tablename } of tablesResult.rows) {
      console.log(`   📦 Structure: ${tablename}`);

      // Drop table
      sqlDump += `DROP TABLE IF EXISTS "${tablename}" CASCADE;\n`;

      // Get columns
      const colsResult = await client.query(
        `
        SELECT 
          column_name, 
          data_type,
          character_maximum_length,
          numeric_precision,
          numeric_scale,
          is_nullable,
          column_default,
          udt_name
        FROM information_schema.columns
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `,
        [tablename]
      );

      // Get primary keys
      const pkResult = await client.query(
        `
        SELECT a.attname
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary
      `,
        [tablename]
      );

      const primaryKeys = pkResult.rows.map((r) => r.attname);

      // Create table
      sqlDump += `CREATE TABLE "${tablename}" (\n`;

      const columnDefs = colsResult.rows.map((col) => {
        let def = `    "${col.column_name}" `;

        // Handle data types
        if (col.column_default && col.column_default.includes("nextval")) {
          // Serial types
          if (col.data_type === "integer") def += "SERIAL";
          else if (col.data_type === "bigint") def += "BIGSERIAL";
          else if (col.data_type === "smallint") def += "SMALLSERIAL";
        } else {
          // Regular types
          if (col.data_type === "character varying") {
            def += col.character_maximum_length
              ? `VARCHAR(${col.character_maximum_length})`
              : "VARCHAR";
          } else if (col.data_type === "character") {
            def += col.character_maximum_length
              ? `CHAR(${col.character_maximum_length})`
              : "CHAR";
          } else if (col.data_type === "numeric" && col.numeric_precision) {
            def += `NUMERIC(${col.numeric_precision},${
              col.numeric_scale || 0
            })`;
          } else if (col.data_type === "USER-DEFINED") {
            def += col.udt_name.toUpperCase();
          } else {
            def += col.data_type.toUpperCase();
          }

          // Default value (skip serial defaults)
          if (col.column_default && !col.column_default.includes("nextval")) {
            def += ` DEFAULT ${col.column_default}`;
          }
        }

        // NOT NULL
        if (col.is_nullable === "NO") {
          def += " NOT NULL";
        }

        return def;
      });

      sqlDump += columnDefs.join(",\n");

      // Primary key
      if (primaryKeys.length > 0) {
        sqlDump += `,\n    PRIMARY KEY ("${primaryKeys.join('", "')}")`;
      }

      sqlDump += `\n);\n\n`;
    }

    // STEP 2: INSERT DATA

    sqlDump += `\n-- ========================================\n`;
    sqlDump += `-- TABLE DATA\n`;
    sqlDump += `-- ========================================\n\n`;

    for (const { tablename } of tablesResult.rows) {
      const dataResult = await client.query(`SELECT * FROM "${tablename}"`);

      if (dataResult.rows.length > 0) {
        console.log(
          `   💾 Data: ${tablename} (${dataResult.rows.length} rows)`
        );

        sqlDump += `-- Data for ${tablename}\n`;

        for (const row of dataResult.rows) {
          const columns = Object.keys(row);
          const values = columns.map((col) => {
            const val = row[col];

            if (val === null) return "NULL";
            if (typeof val === "boolean") return val ? "true" : "false";
            if (typeof val === "number") return val;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            if (typeof val === "object") {
              const jsonStr = JSON.stringify(val)
                .replace(/\\/g, "\\\\")
                .replace(/'/g, "''");
              return `'${jsonStr}'::jsonb`;
            }
            if (typeof val === "string") {
              const escaped = val.replace(/\\/g, "\\\\").replace(/'/g, "''");
              return `'${escaped}'`;
            }
            return `'${val}'`;
          });

          sqlDump += `INSERT INTO "${tablename}" ("${columns.join(
            '", "'
          )}") VALUES (${values.join(", ")});\n`;
        }

        sqlDump += `\n`;
      }
    }

    // STEP 3: ADD FOREIGN KEYS
    if (Object.keys(foreignKeys).length > 0) {
      sqlDump += `\n-- ========================================\n`;
      sqlDump += `-- FOREIGN KEY CONSTRAINTS\n`;
      sqlDump += `-- ========================================\n\n`;

      for (const [tableName, fks] of Object.entries(foreignKeys)) {
        for (const fk of fks) {
          sqlDump += `ALTER TABLE "${tableName}"\n`;
          sqlDump += `    ADD CONSTRAINT "${fk.constraint_name}"\n`;
          sqlDump += `    FOREIGN KEY ("${fk.column_name}")\n`;
          sqlDump += `    REFERENCES "${fk.foreign_table_name}" ("${fk.foreign_column_name}");\n\n`;
        }
      }
    }

    sqlDump += `\n-- Backup completed successfully\n`;

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(backupsDir, `backup_${timestamp}.sql`);

    fs.writeFileSync(backupFile, sqlDump, "utf8");

    const fileSize = (fs.statSync(backupFile).size / 1024).toFixed(2);
    console.log(`[${new Date().toISOString()}] ✅ Backup SUCCESS!`);
    console.log(`   📄 File: ${backupFile}`);
    console.log(`   📊 Size: ${fileSize} KB`);
    console.log(`   📋 Tables: ${tablesResult.rows.length}\n`);

    backupSettings.lastBackup = new Date();
    cleanOldBackups(7);

    return backupFile;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Backup FAILED:`, error);
    throw error;
  } finally {
    client.release();
  }
};

// CLEAN OLD BACKUPS

const cleanOldBackups = (keepCount = 7) => {
  try {
    const files = fs.readdirSync(backupsDir);

    const backupFiles = files
      .filter((file) => file.endsWith(".sql"))
      .map((file) => ({
        name: file,
        path: path.join(backupsDir, file),
        time: fs.statSync(path.join(backupsDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    if (backupFiles.length > keepCount) {
      backupFiles.slice(keepCount).forEach((file) => {
        fs.unlinkSync(file.path);
        console.log(`   🗑️ Deleted old backup: ${file.name}`);
      });
    }
  } catch (error) {
    console.error("Error cleaning backups:", error.message);
  }
};

// CRON SCHEDULER

const updateCronJobs = () => {
  Object.values(activeCronJobs).forEach((job) => {
    if (job) job.stop();
  });
  activeCronJobs = {};

  if (!backupSettings.enabled) {
    console.log("❌ Automatic backups disabled");
    return;
  }

  const schedules = {
    hourly: "0 * * * *",
    every6hours: "0 */6 * * *",
    daily: "0 2 * * *",
    weekly: "0 3 * * 0",
    monthly: "0 4 1 * *",
  };

  const schedule = schedules[backupSettings.frequency];
  if (schedule) {
    activeCronJobs[backupSettings.frequency] = cron.schedule(schedule, () => {
      console.log(`\n🔄 [AUTO BACKUP - ${backupSettings.frequency}]`);
      createBackup().catch((err) => console.error("Auto backup failed:", err));
    });
    console.log(`✅ Auto backup enabled: ${backupSettings.frequency}`);
  }
};

// GET backup settings
app.get("/api/backup/settings", authenticateToken, (req, res) => {
  res.json(backupSettings);
});

// UPDATE backup settings
app.put("/api/backup/settings", authenticateToken, (req, res) => {
  try {
    const { enabled, frequency } = req.body;

    if (typeof enabled !== "undefined") {
      backupSettings.enabled = enabled;
    }

    if (frequency) {
      backupSettings.frequency = frequency;
    }

    updateCronJobs();

    res.json({
      message: "Settings updated",
      settings: backupSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

// MANUAL backup
app.post("/api/backup", authenticateToken, async (req, res) => {
  try {
    console.log("\n🔄 Manual backup requested by user");
    const backupFile = await createBackup();

    const fileContent = fs.readFileSync(backupFile, "utf8");

    res.setHeader("Content-Type", "application/sql; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="backup_${
        new Date().toISOString().split("T")[0]
      }.sql"`
    );
    res.send(fileContent);
  } catch (error) {
    console.error("❌ Manual backup error:", error);
    res.status(500).json({
      message: "Backup failed",
      error: error.message,
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
