import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{
  @Input() products: Product[] = []
  @Output() onSearch = new EventEmitter<Product[]>();
  productList: Product[] = []

  ngOnInit(): void {
    this.productList = this.products
    this.searchProducts('')
  }

  searchProducts(searchText: string): void {
    this.productList = this.products.filter(
      (f: Product) => f.name
        .toLowerCase()
        .includes(
            searchText.toLowerCase()
      ))
      this.onSearch.emit(this.productList)
  }

  searchClear(searchObject: any): void {
    searchObject.value = ''
    this.searchProducts('')
  }  

}

