import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { LogInDTO } from './logInDTO';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {
  }

  @Get(':allUser')
  getAllUser() {
    return this.userService.getAllUser();
  }

  @Get(':mail')
  getUserByMail(@Param('mail') mail: string) {
    //console.log('@ Get getUserByMail @ user.controller.ts + mail: ', mail);
    return this.userService.getUserIdByMail(mail);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    //console.log('toDelete @ user.controller.ts : ', id);
    return this.userService.delete(id);
  }

  @Post('create')
  create(@Body() user: UserEntity) {
    //console.log('UserController create', user);
    return this.userService.create(user);
  }

  @Post('login')
  login(@Body() user: LogInDTO) {
    //console.log('UserController login', user);
    return this.userService.logIn(user);
  }


}
