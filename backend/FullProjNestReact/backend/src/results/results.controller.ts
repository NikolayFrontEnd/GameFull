import { Controller, Post, UseGuards,Request,Body, Patch } from '@nestjs/common';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from './update-profile.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('update') // Изменено с Post на Patch
  async updateResults(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.userId;
    const updatedUser = await this.resultsService.updateUserStats(userId, updateProfileDto);
    return updatedUser;
  }
}


/* 
import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { UpdateProfileService } from './updateProfile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Предполагается, что вы используете JWT аутентификацию
import { Request } from 'express';

@Controller('updateProfile')
export class UpdateProfileController {
  constructor(private readonly updateProfileService: UpdateProfileService) {}

  @UseGuards(JwtAuthGuard) // Защита маршрута с помощью JWT
  @Post()
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() request: Request,
  ) {
    const userId = request.user.id; // Предполагается, что идентификатор пользователя хранится в токене

    return this.updateProfileService.updateProfile(userId, updateProfileDto);
  }
}

*/