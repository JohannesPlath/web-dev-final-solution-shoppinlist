import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemDTO } from './item-DTO';
import { BoughtByDTO } from '../dto/boughtByDTO';

@Controller('items')
export class ItemsController {


  constructor(private itemsService: ItemsService) {
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.itemsService.deleteItem(id);
  }

  // @Get(':id')
  // getItemsOfList(@Param('id') id: string): Promise<ItemEntity[]> {
  //   return this.itemsService.getItemsOfList(id);
  // }

  @Post('createItem')
  createItem(@Body() listItem: ItemDTO) {
    return this.itemsService.createItem(listItem);
  }

  @Patch(':id')
  update(@Body() boughtBy: BoughtByDTO) {
    return this.itemsService.update(boughtBy);
  }

}
