import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    require("dotenv").config()
    const app = await NestFactory.create(AppModule, {
        cors: true,
        bodyParser: true
    });
    const options = new DocumentBuilder()
        .setTitle('Telegram copy')
        .setDescription('The telegram copy API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
    app.enableCors({
        credentials: true
    })
    await app.listen(3000, "127.0.0.1");
}

bootstrap().then((message) => {
    console.log('Server start successful', message)
}).catch((e) => {
    console.log(e)
})
