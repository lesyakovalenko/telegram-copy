import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        MongooseModule.forRoot(
            'mongodb://localhost:27017/telegram-copy', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            }),
        UserModule,
        AuthModule,

    ]
})
export class AppModule {
}
