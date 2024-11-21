import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateProfileDto } from './update-profile.dto';

@Injectable()
export class ResultsService {

  constructor(private readonly prisma: PrismaService) {}

  async updateUserStats(userId: number, updateData: UpdateProfileDto) {
    // Обновление данных пользователя
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        score: { increment: updateData.score ?? 0 },
        success: { increment: updateData.success ?? 0 },
        unsuccess: { increment: updateData.unsuccess ?? 0 },
      },
    });

    // Возвращаем только нужные поля пользователя
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

}


/* 
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UpdateProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    // Проверка наличия пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Обновление профиля пользователя
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        score: updateProfileDto.score !== undefined ? updateProfileDto.score : user.score,
        success: updateProfileDto.success !== undefined ? updateProfileDto.success : user.success,
        unsuccess: updateProfileDto.unsuccess !== undefined ? updateProfileDto.unsuccess : user.unsuccess,
      },
    });
  }
}

*/