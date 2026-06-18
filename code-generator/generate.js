// code-generator/generate.js
const crypto = require('crypto');
const readline = require('readline');

const SECRET_KEY = 'TAILOR_OFFLINE_SECRET_2026-Taleeb';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateCode(appId, credits) {
  // 1. Generate exactly 3 characters for the nonce
  const nonce = crypto.randomBytes(2).toString('hex').toUpperCase().substring(0, 3);
  
  // 2. Create the payload
  const payload = `${appId}:${credits}:${nonce}`;
  
  // 3. Hash it
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(payload);
  
  // 4. Extract exactly 4 characters for the signature
  const signature = hmac.digest('hex').substring(0, 4).toUpperCase();
  
  // 5. Assemble compacted code: e.g., 50-X9AA4B2
  return `${credits}-${nonce}${signature}`;
}

console.log("===================================");
console.log("🧵 TAILOR APP - CREDIT GENERATOR 🧵");
console.log("===================================\n");

rl.question("Enter the 6-character App ID (e.g., A8F2K9): ", (appIdStr) => {
  rl.question("Enter the amount of Credits (e.g., 50): ", (creditsStr) => {
    
    const credits = parseInt(creditsStr, 10);
    const appId = appIdStr.trim().toUpperCase();

    if (isNaN(credits) || credits <= 0) {
      console.log("\n❌ Error: Credits must be a positive number.");
      rl.close();
      return;
    }

    const finalCode = generateCode(appId, credits);
    
    console.log("\n✅ Code Generated Successfully!");
    console.log("--------------------------------------------------");
    console.log(`Give this code to the tailor:  ${finalCode}`);
    console.log("--------------------------------------------------");
    console.log(`(This code will only work for App ID: ${appId})`);
    
    rl.close();
  });
});