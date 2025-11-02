// backupScheduler.js
const cron = require("node-cron");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Create backups folder if it doesn't exist
const backupsDir = path.join(__dirname, "backups");
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// Database configuration from environment variables
const dbConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "your_database",
  password: process.env.DB_PASSWORD || "your_password",
  port: process.env.DB_PORT || 5432,
};

// Function to create backup
const createBackup = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(backupsDir, `backup_${timestamp}.sql`);

  const pgDumpCommand = `PGPASSWORD="${dbConfig.password}" pg_dump -U ${dbConfig.user} -h ${dbConfig.host} -p ${dbConfig.port} ${dbConfig.database} > ${backupFile}`;

  console.log(`[${new Date().toISOString()}] Starting database backup...`);

  exec(pgDumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`[${new Date().toISOString()}] Backup FAILED:`, error);
      return;
    }

    console.log(`[${new Date().toISOString()}] Backup SUCCESS: ${backupFile}`);

    // Clean old backups (keep only last 7 backups)
    cleanOldBackups(7);
  });
};

// Function to clean old backups
const cleanOldBackups = (keepCount = 7) => {
  fs.readdir(backupsDir, (err, files) => {
    if (err) {
      console.error("Error reading backups directory:", err);
      return;
    }

    // Filter only .sql files and sort by date (newest first)
    const backupFiles = files
      .filter((file) => file.endsWith(".sql"))
      .map((file) => ({
        name: file,
        path: path.join(backupsDir, file),
        time: fs.statSync(path.join(backupsDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    // Delete old backups
    if (backupFiles.length > keepCount) {
      backupFiles.slice(keepCount).forEach((file) => {
        fs.unlinkSync(file.path);
        console.log(
          `[${new Date().toISOString()}] Deleted old backup: ${file.name}`
        );
      });
    }
  });
};

// ============================================
// CRON SCHEDULES (Choose one or multiple)
// ============================================

// Option 1: Every day at 2:00 AM
cron.schedule("0 2 * * *", () => {
  console.log("[DAILY BACKUP] Running scheduled backup...");
  createBackup();
});

// Option 2: Every Sunday at 3:00 AM (Weekly)
cron.schedule("0 3 * * 0", () => {
  console.log("[WEEKLY BACKUP] Running scheduled backup...");
  createBackup();
});

// Option 3: First day of every month at 4:00 AM
cron.schedule("0 4 1 * *", () => {
  console.log("[MONTHLY BACKUP] Running scheduled backup...");
  createBackup();
});

// Option 4: Every 6 hours
cron.schedule("0 */6 * * *", () => {
  console.log("[6-HOUR BACKUP] Running scheduled backup...");
  createBackup();
});

// Option 5: Every hour
cron.schedule("0 * * * *", () => {
  console.log("[HOURLY BACKUP] Running scheduled backup...");
  createBackup();
});

// Temporary for testing
cron.schedule("* * * * *", () => {
  console.log("[TEST BACKUP] Running...");
  createBackup();
});

console.log("✅ Automatic backup scheduler initialized");
console.log("📅 Schedules:");
console.log("   - Daily: 2:00 AM");
console.log("   - Weekly: Sunday 3:00 AM");
console.log("   - Monthly: 1st day at 4:00 AM");
console.log("   - Every 6 hours");

module.exports = { createBackup, cleanOldBackups };
