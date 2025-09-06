const bcrypt = require("bcrypt");

async function hashPassword() {
  const plainPassword = "manager123"; // you can change this
  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log("Hashed password:", hashed);
}

hashPassword();
