const bcrypt = require("bcryptjs");

const hashedPassword = "$2b$10$8eS5QJcAwqnb2.DFbKcUXexrxUTRKOvhDDjTsshXLv3cM03KFAc.."

// Replace with the actual password you used while registering admin
const inputPassword = "12345678"
// Compare the input password with the hashed password
bcrypt.compare(inputPassword, hashedPassword).then((match) => {
  console.log(match ? "✅ Password Matches" : "❌ Password Incorrect");
});


