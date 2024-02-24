import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { UserSchema } from './schema/user.schemas';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    // Use MailerModule
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        auth: {
          user: 'gorayausman061@gmail.com',
          pass: 'wqgf vugp mlxd xwca'
        }
      }
    }),
    // use ConfigModule
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    // Use Passport Module
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    // Use Mongoose Module for creating Model
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
