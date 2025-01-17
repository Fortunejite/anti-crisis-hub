import app from "./app";
import dotenv from 'dotenv'
import dbConnect from "./configs/db";

dotenv.config()

const PORT = process.env.PORT || 5000;

dbConnect()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
