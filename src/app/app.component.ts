import { Component } from '@angular/core';
import { Product } from './interfaces/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular.shoppinglist'

  productList: Product[] = [
    {
      name: "Tomate",
      quantity: 2.5,
      unit: "kg",
      price: 7
    },
    {
      name: "Detergente",
      quantity: 3,
      unit: "un",
      price: 2.3
    },
    {
      name: "Feijão",
      quantity: 1,
      unit: "kg",
      price: 9
    },
    {
      name: "Óleo",
      quantity: 2,
      unit: "lt",
      price: 3.5
    },
    {
      name: "Leite",
      quantity: 0,
      unit: "lt",
      price: 5
    }
  ]

  searchList: Product[] = []
  totalQty: number = 0;
  totalAmount: number = 0;

  updateSelected(newList: Product[]) {
    this.searchList = newList;
    
    this.totalQty = this.searchList.filter(
      (f: Product) => f.quantity > 0
    ).length

    this.totalAmount = this.searchList.reduce(
      (accum, item) => accum + Math.round(item.quantity * item.price * 100) / 100,
      0
    )

  }

}
