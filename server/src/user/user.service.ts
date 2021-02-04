import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import normalize from 'normalize-package-data';

@Injectable()
export class UserService {
  private userModel: Model<User>;

  constructor(@InjectModel('User') userModel: Model<User>) {
    this.userModel = userModel;
  }

  async create(userDto: CreateUserDto) {
    const { nickName, email, password } = userDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userModel.create({
      nickName,
      email,
      password: hashedPassword,
    });
  }

  async findUserByEmail(email) {
    return this.userModel.findOne({ email });
  }

  async findUserByIdWithJoinChatList(userId) {
    return this.userModel.findOne({ _id: userId }, '_id nickName').populate({
      path: 'joinedChatRooms',
      populate: { path: 'owner connectedUsers', select: '_id nickName' },
    });
  }

  async findUsersList(condition?) {
    return condition
      ? await this.userModel.find(condition)
      : await this.userModel.find();
  }

  async findUsersListExId(userId: string) {
    return this.userModel.find({
      _id: { $ne: userId },
    });
  }

  async updateAvatar(avatar, userId) {
    const user = await this.userModel.findOne({ _id: userId });
    user.avatar = normalize(avatar.path);
    return await user.save();
  }

  async findUserByCondition(condition) {
    return this.userModel.findOne(condition);
  }

  async addJoinChat(userId, chatRoomId) {
    const user = await this.userModel.findOne({ _id: userId });
    user.joinedChatRooms.push(chatRoomId);
    return user.save();
  }

  // async addJoinChatManyUsers(users, chatRoomId: string){
  //     let filter = users.map((item)=> {
  //         return {_id: item}
  //     })
  //     this.userModel.updateMany({$or: filter},
  //         {
  //             $push: {joinedChatRooms: chatRoomId}
  //         })
  // }
}
