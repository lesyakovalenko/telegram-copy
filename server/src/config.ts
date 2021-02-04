export default () => ({
  port: parseInt(process.env.PORT, 10) || 8005,
  db_path: process.env.DB_PATH,
  jwt_secret: process.env.JWT_SECRET,
});
