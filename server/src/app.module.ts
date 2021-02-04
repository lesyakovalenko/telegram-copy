import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import config from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
const configService = new ConfigService();
console.log(configService.get('db_path'));
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    MongooseModule.forRoot(configService.get('db_path'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    UserModule,
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}
