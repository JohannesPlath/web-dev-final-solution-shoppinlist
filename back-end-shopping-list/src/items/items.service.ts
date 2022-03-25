import { Injectable } from '@nestjs/common';
import { ItemDTO } from './item-DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './items.entity';
import { Repository } from 'typeorm';
import { BoughtByDTO } from '../dto/boughtByDTO';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {
  }

  async deleteItem(id) {
    //console.log('ItemsService @ deleteItem() + id', id);
    const actItem: ItemEntity = await this.itemRepository.findOne(id);
    //console.log('ItemsService @ deleteItem() + actItem', actItem);
    await this.itemRepository.delete(id);
    return actItem;
  }


  async createItem(listItem: ItemDTO) {
    //console.log('item.service createItem: ', listItem);
    /*const existingList = await this.itemRepository.findOne(this.findItemByName(listItem.product, listItem.creator));
    if (existingList) {
      //console.log('item.service cant create a new Item caused by exiting name: ', listItem.product);
      return new Promise(function(resolve) {
        if (existingList) {
          resolve(null);
        }
      });
    } else {*/
    //console.log('item.service created a new Item ');
    return this.itemRepository.save(listItem);
    //}
  }

  async update(boughtBy: BoughtByDTO) {
    const item: ItemEntity = await this.itemRepository.findOne(this.findItemByID(boughtBy.itemID));
    item.bought_by = boughtBy.email || null; // undefined does not change db
    //console.log('ItemsService update: ', itemEntity);
    // return await this.itemRepository.save(item);
    return await this.itemRepository.save(item);
  }


  // Helper
  findItemByID(itemID: string) {
    return {
      where: { id: itemID },
    };
  }

  /* findItemByName(itemName: string, creator: string) {
     return {
       where: { product: itemName, creator: creator },
     };
   }*/

}
