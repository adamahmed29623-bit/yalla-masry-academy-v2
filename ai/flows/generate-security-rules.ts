export async function generateSecurityRules(context: string) {
  // منطق توليد القواعد بناءً على السياق
  const defaultRules = {
    allowAccess: true,
    role: "student",
    lastUpdated: new Date().toISOString()
  };
  
  return defaultRules;
}
