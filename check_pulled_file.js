const fs = require("fs");
if (fs.existsSync(".env.vercel.pulled")) {
  const content = fs.readFileSync(".env.vercel.pulled", "utf-8");
  console.log("File content length:", content.length);
  const lines = content.split("\n");
  for (let i = 0; i < Math.min(lines.length, 25); i++) {
    const line = lines[i];
    // Print the key and the value length/type without leaking the secret to the log if it's sensitive
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim();
      console.log(`Line ${i + 1}: ${key} = (length: ${val.length}, starts with: ${val.substring(0, 15)})`);
    } else {
      console.log(`Line ${i + 1}: ${line}`);
    }
  }
} else {
  console.log("File .env.vercel.pulled does not exist.");
}
