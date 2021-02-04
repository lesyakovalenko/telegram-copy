import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user.schema';
import { MessageSchema } from '../schemas/message.schema';
import { ChatRoomSchema } from '../schemas/chatRoom.schema';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { WsJwtGuard } from '../auth/ws.jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'ChatRoom', schema: ChatRoomSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  providers: [ChatGateway, ChatService, WsJwtGuard],
  controllers: [ChatController],
})
export class ChatModule {}
