"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const config = new swagger_1.DocumentBuilder().setTitle('Demp application')
        .setDescription('Demo application')
        .setVersion('V1')
        .addTag('books')
        .build();
    app.enableCors({
        origin: '*',
        credentials: true
    });
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'static'));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map