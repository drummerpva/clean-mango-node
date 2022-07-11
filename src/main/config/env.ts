export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27018/jest",
  port: process.env.PORT || 3000,
};
