import { Component, Inject, OnInit } from '@angular/core';
import { ShoppingList } from '../../models/interfaces/shopping-list';
import { ListService } from '../../services/lists.services';
import { ProductGroup } from '../../models/product-group';
import { ShoppingListItem } from '../../models/interfaces/shopping-list-item';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CountdownTimer, CountdownTimerHandler } from '../../utils/countdown-timer';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { MessageService } from '../../services/message.service';

export interface ProductItemMap {
  key: string;
  values: ShoppingListItem[];
}

@Component({
  selector: 'app-shopping-list',
  templateUrl: './mobile-list.component.html',
  styleUrls: ['./mobile-list.component.scss'],
})

export class MobileListComponent implements OnInit, CountdownTimerHandler {

  groupOfProducts: string[];
  selectedProductGroup?: string;
  productForm = this.fb.group({
    productText: [null, Validators.required],
    selectedProductGroup: [null, Validators.required],
  });

  shoppingList?: ShoppingList;
  shoppingList$?: Observable<ShoppingList>;
  productGroups: ProductGroup[] = [];
  productItemMaps$: BehaviorSubject<ProductItemMap[]>;
  productItemMaps: ProductItemMap[] = [];
  timer: CountdownTimer;
  selectedItem!: ShoppingListItem;
  listsOfUser$?: Observable<ShoppingList[]>;
  listsOfUser?: ShoppingList[];
  listsOfOwner?: ShoppingList[];
  listsOfOwner$?: Observable<ShoppingList[]>;
  initialSelection: string = '';

  constructor(
    private userService: UserService,
    private shoppingListService: ListService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.timer = new CountdownTimer(this, 1);
    this.groupOfProducts = Object.values(ProductGroup);
    this.productItemMaps$ = new BehaviorSubject<ProductItemMap[]>(this.buildInitialProductGroup());
  }

  ngOnInit(): void {
    this.listsOfUser$ = this.shoppingListService.getListsOfUser(this.userService.getDirectUser());
    this.listsOfUser$.subscribe(lists => this.listsOfUser = lists);
    this.shoppingListService.getActualList().subscribe({
      next: (list) => this.showList(list),
    });
    this.listsOfOwner$ = this.shoppingListService.getListsOfOwner(this.userService.getDirectUser());
    this.listsOfOwner$.subscribe(lists => this.listsOfOwner = lists);
  }

  private showList(list: ShoppingList): void {
    this.shoppingList = list;
    this.initialSelection = list.title;
    this.addItemsToProductGroup();
  }

  private buildInitialProductGroup(): ProductItemMap[] {
    let result: ProductItemMap[] = [];
    if (this.selectedProductGroup != null) {
      result.push({ key: this.selectedProductGroup, values: [] });
    }
    for (let i = 0; i < this.groupOfProducts.length; i++) {
      if (this.selectedProductGroup != this.groupOfProducts[i]) {
        result.push({ key: this.groupOfProducts[i], values: [] });
      }
    }
    return result;
  }

  private addItemsToProductGroup(): void {
    const productItems: ProductItemMap[] = this.buildInitialProductGroup();
    const items = this.shoppingList!.items;

    for (const shoppingItem of items) {
      const productItemMap = productItems.find((current) => current.key === shoppingItem.productGroup);
      if (productItemMap) {
        productItemMap.values.push(shoppingItem);
      }
    }
    this.productItemMaps = productItems;
    this.productItemMaps$.next(productItems);
  }

  onAddItem(): void {
    if (this.productForm.invalid) {
      return;
    }
    let product = this.productForm.controls['productText'].value;
    let group = this.productForm.controls['selectedProductGroup'].value;
    this.shoppingListService.updateActualListWithItem(product, group);
  }

  onChangeBoughtBy(shoppingItem: ShoppingListItem): void {
    let isBought: boolean = !shoppingItem.bought_by;
    let email = undefined;
    if (isBought) {
      email = this.userService.getDirectUser().email;
    }
    this.shoppingListService.setBoughtByUser(shoppingItem, email).subscribe({
      next: value => this.updateProduct(value),
    });
  }

  onSelectList($event: MatSelectChange): void {
    const find = this.listsOfUser?.find(list => list.title === $event.value);
    this.shoppingListService.setActualList(find!);
  }

  private updateProduct(item: ShoppingListItem): void {
    const category: string = item.productGroup;
    const productItemMap = this.productItemMaps.find(map => map.key === category);
    const index = productItemMap!.values.findIndex(listItem => item.id === listItem.id);
    productItemMap!.values[index] = item;
    this.productItemMaps$.next(this.productItemMaps);
  }

  private removeProduct(item: ShoppingListItem): void {
    const category: string = item.productGroup;
    const productItemMap = this.productItemMaps.find(map => map.key === category);
    productItemMap!.values = productItemMap!.values.filter(listItem => item.id !== listItem.id);
    this.productItemMaps$.next(this.productItemMaps);
  }

  // dialog event handling

  timerComplete(): void {
    this.openDialog();
  }

  onEnter(item: ShoppingListItem): void {
    this.selectedItem = item;
    this.timer.start();
  }


  onLeave(): void {
    //console.log('Timer Stopped @ : ');
    this.timer.stop();
  }

  private openDialog(): void {
    this.dialog.open(DeleteItemDialog, {
      data: {
        selectedProduct: this.selectedItem.product,
      },
    }).afterClosed().subscribe((res) => {
      let actualList: ShoppingList = this.shoppingListService.getDirectActualList()!;
      if (res === 'delete') {
        if ((this.selectedItem.creator != (this.userService.getDirectUser().id)) && (!this.listsOfOwner?.includes(actualList))) {
          //console.log('(this.userService.this.listsOfOwner?.includes(actualList))', !this.listsOfOwner?.includes(actualList));
          this.messageService.info('Your not the Owner of that List and not the creator of that item. you can´t delete it. but you can buy it^^');

        } else {
          this.shoppingListService.deleteItem(this.selectedItem).subscribe({
            next: item => this.removeProduct(item),
          });
        }
      }
    });
  }

  onSelectProductGroup($event: MatSelectChange): void {
    this.selectedProductGroup = this.groupOfProducts?.find(productGroupItem => productGroupItem === $event.value);
    if (this.shoppingListService.getDirectActualList()) {
      this.showList(this.shoppingListService.getDirectActualList()!);
    }
  }
}

// mat-dialog

export interface DialogData {
  selectedProduct: string;
}

@Component({
  selector: 'delete-item-dialog',
  template: `
    <h1 mat-dialog-title>Delete Item</h1>
    <div mat-dialog-content>
      {{ data.selectedProduct }} ?
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button mat-dialog-close='0'>Cancel</button>
      <button mat-raised-button mat-dialog-close='delete' class='mat-primary'>Ok</button>
    </div>
  `,
})

export class DeleteItemDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
}
