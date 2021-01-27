import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";
import { ChatModule } from './chat/chat.module';

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
        ChatModule,

    ]
})
export class AppModule {
}
