exports = async function(userData) {
  const users = context.services.get("mongodb-atlas").db("trading-app").collection("users");
  
  const newUser = {
    ...userData,
    createdAt: new Date(),
    lastLogin: new Date()
  };
  
  const result = await users.insertOne(newUser);
  return result;
};