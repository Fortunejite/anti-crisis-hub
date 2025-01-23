import express from "express";
import routes from "@/routes/index"
import authRoutes from "@/routes/auth.routes"
import resourceRoutes from "@/routes/resources.routes"
import requestRoutes from "@/routes/request.routes"
import errorHandler from "./middlewares/errorHandler";
import { auth } from "./middlewares/authorization";
import { Request, Response, NextFunction } from "express";
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL in production
  credentials: true, // If you are using cookies or Authorization headers
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", routes);
app.use("/api/v1/resources", auth, resourceRoutes);
app.use("/api/v1/requests", auth, requestRoutes);

app.use((req, res,) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
