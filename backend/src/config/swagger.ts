import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { Application } from "express";
import path from "path";

export const setupSwagger = (app: Application) => {
  const swaggerPath = path.join(process.cwd(), "docs", "openapi.yaml");

  const swaggerDocument = YAML.load(swaggerPath);

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};
