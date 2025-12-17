import app from "./app";
import env from "./config/env";

const PORT = env.PORT || 5000;

let server: any;

const startServer = async () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
