import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(config.database), ShoppingListModule, ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
