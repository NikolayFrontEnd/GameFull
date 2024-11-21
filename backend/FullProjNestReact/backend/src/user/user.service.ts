import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
  // Create a new user
  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }
  // Find a user by email
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        score: true,
        success: true,
        unsuccess: true,
      },
    });
  }

  async findUserByName(userName: string) {
    const users = await this.prisma.user.findMany({
      where: { name: userName },
      select: {
        name: true,
        id: true,
        score: true,
        success: true,
        unsuccess: true,
      },
    });
  
    if (users.length === 0) {
      return { message: "Пользователи с таким именем не найдены" };
    }
  
    return users;
  }
   }