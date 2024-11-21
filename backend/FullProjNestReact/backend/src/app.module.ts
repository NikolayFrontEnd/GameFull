import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { ResultsModule } from './results/results.module';
import { SocketService } from './socket/socket.service';


@Module({
  imports: [UserModule,AuthModule, ResultsModule],
  controllers: [AppController],
  providers: [AppService,PrismaService, SocketService],
})
export class AppModule {}
