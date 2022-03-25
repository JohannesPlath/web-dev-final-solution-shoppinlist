import { Component, OnInit } from '@angular/core';
import { ProductGroup } from '../../models/product-group';
import { ShoppingListItem } from '../../models/interfaces/shopping-list-item';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ShoppingList } from '../../models/interfaces/shopping-list';
import { UserService } from '../../services/user.service';
import { ListService } from '../../services/lists.services';
import { MatSelectChange } from '@angular/material/select';
import { MessageService } from '../../services/message.service';

export interface ProductItemMap {
  key: string;
  values: ShoppingListItem[];
}

@Component({
  selector: 'app-company-details',
  templateUrl: './desktop-list.component.html',
  styleUrls: ['./desktop-list.component.scss'],
})

export class DesktopListComponent implements OnInit {

  productForm = this.fb.group({
    productText: [null, Validators.required],
  });


  enums: string[];
  selectedProductGroup?: string;
  counts: number[];
  productGroups: string[];
  activeProductGroup: string = '';
  items: ShoppingListItem[];
  filteredItems: Subject<ShoppingListItem[]>;
  shoppingList?: ShoppingList;
  shoppingList$?: Observable<ShoppingList>;
  listsOfUser$?: Observable<ShoppingList[]>;
  listsOfUser?: ShoppingList[];
  selection: string = '';
  noGroupSelectedMsg: string = 'you have to select a product group';
  noListSelectedMsg: string = 'you have to select a list';
  placeHolderMsg: string = '';
  listsOfOwner?: ShoppingList[];
  listsOfOwner$?: Observable<ShoppingList[]>;


  constructor(private userService: UserService,
              private shoppingListService: ListService,
              private fb: FormBuilder,
              private messageService: MessageService) {
    this.enums = Object.values(ProductGroup);
    this.filteredItems = new Subject<ShoppingListItem[]>();
    this.items = [];
    this.counts = [];
    this.productGroups = [];
    this.placeHolderMsg = this.noListSelectedMsg;

  }

  filteredOptions!: Observable<string[]>;

  ngOnInit(): void {
    this.listsOfUser$ = this.shoppingListService.getListsOfUser(this.userService.getDirectUser());
    this.listsOfUser$.subscribe(lists => this.listsOfUser = lists);
    this.shoppingListService.getActualList().subscribe({
      next: (list) => this.showList(list),
      error: (error) => console.log('CompanyDetailsComponent actual list error: ', error),
    });
    this.listsOfOwner$ = this.shoppingListService.getListsOfOwner(this.userService.getDirectUser());
    this.listsOfOwner$.subscribe(lists => this.listsOfOwner = lists);
  }

  showList(list: ShoppingList): void {
    this.placeHolderMsg = this.noGroupSelectedMsg;
    this.selection = list.title;
    this.shoppingList = list;
    this.items = list.items;
    this.counts = [];
    this.productGroups = [];
    let currentCount = 0;
    let text;

    if (this.selectedProductGroup != null) {
      currentCount = 0;
      for (const item of this.items) {
        if (item.productGroup === this.selectedProductGroup) {
          currentCount++;
        }
        this.counts.push(currentCount);
      }
      text = currentCount > 0 ? '(' + currentCount + ')' : '';
      this.productGroups.push(this.selectedProductGroup + text);
    }
    if (this.activeProductGroup !== '') {
      this.showItems(this.activeProductGroup);
    }

    for (const group of this.enums) {
      currentCount = 0;

      for (const item of this.items) {
        if (item.productGroup === group) {
          currentCount++;
        }
        this.counts.push(currentCount);
      }
      text = currentCount > 0 ? '(' + currentCount + ')' : '';
      if (group !== this.selectedProductGroup) {
        this.productGroups.push(group + text);
      }
    }
    if (this.activeProductGroup !== '') {
      this.showItems(this.activeProductGroup);
    }
  }

  showItems(group: string): void {
    const index = group.indexOf('(');
    if (index > -1) {
      group = group.slice(0, index);
    }
    this.placeHolderMsg = 'Product';
    this.activeProductGroup = group;
    const items = this.shoppingList?.items.filter(item => item.productGroup === group) || [];
    this.filteredItems.next(items);
  }

  onAddItem(): void {
    if (this.productForm.invalid) {
      return;
    }
    let product = this.productForm.controls['productText'].value;
    this.shoppingListService.updateActualListWithItem(product, this.activeProductGroup);
  }

  remove(item: ShoppingListItem): void {
    let actualList: ShoppingList = this.shoppingListService.getDirectActualList()!;
    if ((item.creator != (this.userService.getDirectUser().id)) && (!this.listsOfOwner?.includes(actualList))) {
      //console.log('(this.userService.this.listsOfOwner?.includes(actualList))', !this.listsOfOwner?.includes(actualList));
      this.messageService.info('Your not the Owner of that List and not the creator of that item. you can´t delete it. but you can buy it^^');
    } else {
      this.shoppingListService.deleteItem(item);
    }
  }

  onClickChip(item: ShoppingListItem) {
    //console.log('DesktopListComponent onClickChip: ', item);
    let isBought: boolean = !item.bought_by;
    let email = undefined;
    if (isBought) {
      email = this.userService.getDirectUser().email;
    }
    this.shoppingListService.setBoughtByUser(item, email).subscribe({
      next: value => {
        //console.log('desktopList @ onClickChip + value', value);
        this.showItems(this.activeProductGroup);
      },
      error: (error: any) => console.log('onClickChip + error: ', error),
    });
  }


  onSelectList($event: MatSelectChange): void {
    const find = this.listsOfUser?.find(list => list.title === $event.value);
    this.shoppingListService.setActualList(find!);
  }

  onSelectProductGroup($event: MatSelectChange): void {
    this.selectedProductGroup = this.enums?.find(productGroupItem => productGroupItem === $event.value);
    if (this.shoppingListService.getDirectActualList()) {
      this.showList(this.shoppingListService.getDirectActualList()!);
    }
  }
}
