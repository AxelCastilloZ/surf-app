import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { DashboardUser } from './entities/dashboard-user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DashboardUser])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
