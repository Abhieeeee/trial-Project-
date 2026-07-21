console.log("Environment keys:");
Object.keys(process.env).sort().forEach(k => {
  if (k.includes("SUPABASE") || k.includes("PORT") || k.includes("POSTGRES")) {
    console.log(`- ${k}: present, length = ${process.env[k] ? process.env[k].length : 0}`);
  }
});
