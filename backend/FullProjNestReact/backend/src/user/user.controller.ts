import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async register(@Body() body) {
    const { email, password, name } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
      name,
    });

    return { id: user.id, email: user.email, name: user.name };
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getInfo(@Request() req) {
    const userId = req.user.userId; // ID пользователя извлекается из декодированного токена
    const user = await this.userService.findUserById(userId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('AllUsers') 
  async getUsers(@Query('name') name: string) { 
    return this.userService.findUserByName(name);
  }
}
