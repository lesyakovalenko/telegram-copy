import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import {CreateUserDto} from "./dto/create.user.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User} from "./interfaces/user.interface";
import normalize from "normalize-package-data";

@Injectable()
export class UserService {
    private userModel: Model<User>;


    constructor(@InjectModel('User') userModel: Model<User>) {
        this.userModel = userModel;
    }

    async create(userDto: CreateUserDto) {
        const {nickName, email, password} = userDto;
        const hashedPassword = await bcrypt.hash(password, 10)

        const createUser = await this.userModel.create({
            nickName,
            email,
            password: hashedPassword
        });
        return createUser;
    }

    async findUserByEmail(email) {
        let user = await this.userModel.findOne({email});
        return user;
    }

    async findUserByIdWithJoinChatList(userId) {
        let user = await this.userModel.findOne({_id: userId}, '_id nickName')
            .populate({
                    path: 'joinedChatRooms',
                    populate: {path: 'owner connectedUsers', select: '_id nickName'},
                },
            );
        return user;
    }

    async findUsersList(condition?) {
        let usersList = condition ? await this.userModel.find(condition) : await this.userModel.find();
        return usersList;
    }

    async findUsersListExId(userId: string) {
        let list = await this.userModel.find({
            _id: {$ne: userId}
        })
        return list
    }

    async updateAvatar(avatar, userId) {
        const user = await this.userModel.findOne({_id: userId})
        user.avatar = normalize(avatar.path)
        return await user.save()
    }

    async findUserByCondition(condition) {
        return await this.userModel.findOne(condition);
    }

    async addJoinChat(userId, chatRoomId) {
        const user = await this.userModel.findOne({_id: userId})
        user.joinedChatRooms.push(chatRoomId);
        return await user.save()
    }

}
