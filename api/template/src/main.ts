import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { ApiModule } from "./api/api.module";
import secrets from "./config/secrets";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  const documentationOptions = new DocumentBuilder()
    .setTitle(`${secrets.PRODUCT_NAME}-API`)
    .setDescription("API BASE DOCUMENTATION")
    .setVersion("1.0")
    .addTag("API")
    .build();

  const document = SwaggerModule.createDocument(app, documentationOptions, {});

  SwaggerModule.setup('/docs', app, document);

  const port = 8080;
  await app.listen(port);

  Logger.log(
    `🚀 Api is running on: http://localhost:${port}`,
    secrets.PRODUCT_NAME
  );
}

bootstrap();
