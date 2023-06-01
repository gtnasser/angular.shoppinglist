# Shopping List

Este tutorial é para criar uma aplicação para visualizar e pesquisar em uma Lista de Compras.
É um projeto simples desenvolvido por mim, usando apenas Angular, com o objetivo de mostrar a troca de dados entre componentes, explorando os conceitos de **property binding** e **event binding**.
Vamos criar uma aplicação com um componente que recebe uma lista de produtos, exibe essa lista, pode pesquisar produtos nesta lista, e retorna o resultado a cada execução da pesquisa para que seja exibido pela aplicação.

Este projeto pode ser clonado de [github.com/gtnasser/angular.shoppinglist](https://github.com/gtnasser/angular.shoppinglist) ou executado em [*****]().


## 0. Pré-requisitos

[Node.js](nodejs.org)
Baixar a versão LTS para o seu sistema operacional.

[Angular](https://angular.io/)
Para instalar o Angular CLI, abra uma janela do terminal e execute:
```shell
npm install -g @angular/cli
```
Para definir a identidade padrão da sua conta, execute:
```shell
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```
Omitir --global para definir a identidade somente neste repositório.

[Visual Studio Code](https://code.visualstudio.com/) ou um editor de código de sua preferência.

## 1. Criar  o projeto

```shell
ng new angular.shoppinglist
cd new angular.shoppinglist
code .
```
Para executar o projeto e abrir o navegador (default http://localhost:4200), execute: 
```shell
ng server --open
```
O navegador será atualizado toda vez que um documento do projeto for salvo.

## 2. Toolbar

Vamos criar uma toolbar básica: logo, título da aplicação, e um atalho para o repositório deste projeto.
Assim vamos dar uma cara bonitinha pro nosso projeto. 

Substituir o conteúdo de **app.component.html** por:
```html
<div class="toolbar">
  <img id="logo" src="../assets/cart-shopping.svg" alt="logo">
  <span>SHOPPING LIST</span>
  <a target="_blank" rel="noopener" href="https://github.com/gtnasser" title="Github">
    <img id="avatar" src="../assets/me.png" alt="Me"/>
  </a>
</div>
<div class="content">
</div>
```

Baixei para a pasta /src/assets o meu avatar do github e do site [FontAwesome](https://fontawesome.com/) bixei o ícone [cart-shopping](https://fontawesome.com/icons/cart-shopping), de [uso livre](https://fontawesome.com/license/free). 

E para  finalizar, incluir em **app.component.css**:
```css
:host {
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, Verdana; font-size: 14px;
}
.toolbar {
position: fixed; top: 0;
left: 0; right: 0; height: 60px;
display: flex; align-items: center;
background-color: #1976d2; color: white; font-weight: 600;
}
.toolbar  >  #logo {
margin: 0 10px; height: 24px;
}
.toolbar > a {
margin-left: auto; margin-right: 10px;
}
.toolbar  >  a  >  #avatar {
height: 36px;
}
.toolbar  >  #me  img:hover {
opacity: 0.8;
}
.content {
margin-top: 70px;
}
```
![Passo #2](https://raw.githubusercontent.com/gtnasser/angular.shoppinglist/main/step2.png)

## 3. Itens da lista de compras

Vamos definir o modelo de dados através de uma interface. 
```shell
ng generate interface interfaces/product
```
Incluir em **products.ts**:
```javascript
export interface Product {
  name: string,
  quantity: number,
  unit: string,
  price: number
}
```
Os produtos da lista deveriam ser sempre disponibilizados e persistidos através de um serviço, **mas para simplificar este projeto**, vamos criar um array contendo a lista de produtos. 
Vamos importar a interface e criar o array em  **app-components.ts**:
```javascript
import { Product } from './interfaces/product';
@Component({...})
export class AppComponent {
  title = 'angular.shoppinglist'

  allProducts: Product[] = [
    {
      name: "Tomate",
      quantity: 2.5,
      unit: "kg",
      price: 7
    },
    ...
    {
      name: "Leite",
      quantity: 0,
      unit: "lt",
      price: 5
    }
  ]
}
```

## 4. Lista de compras

Vamos criar um componente específico para visualizar a lista de compras, para realizar a pesquisa e mostrar o uma lista de produtos selecionados.
```shell
ng generate component components/product-list
```
Para manipular a lista de produtos, este componente precisa receber essa lista de alguma maneira, então vamos passar a lista através de uma propriedade. Para isso vamos usar o decorator **@Input** e manipular essa lista no evento **OnInit()** do componente. Como a pesquisa vai gerar uma nova lista de produtos, vamos criar uma variável para armazená-la e ela será inicializada com a lista completa de produtos recebida pelo componente. 
Importamos  a interface e as classes necessárias em **product-list.components.ts**:
```javascript
  import { Component, Input, OnInit} from '@angular/core';
  import { Product } from 'src/app/interfaces/product';
  ...
  export class ProductListComponent implements OnInit {
    @Input() products: Product[] = []
    productList: Product[] = []
    ngOnInit(): void {
      this.productList= this.products
    }
}
```
Vamos criar a visualização da lista de produtos em **product-list.components.html**:
```html
<div class="content">
  <section>
    Lista de Compras:
    <ul>
      <li *ngFor="let product of productList">{{product.name}} ({{product.quantity}} {{ product.unit}} x ${{ product.price | number: '1.2-2' }})</li>
    </ul>
  </section>
</div>
```
![Passo #4](https://raw.githubusercontent.com/gtnasser/angular.shoppinglist/main/step4.png)

## 5. Barra de pesquisa

Queremos ter as funcionalidades para pesquisar os produtos, e limpar a pesquisa e ver todos os produtos novamente. Então vamos criar o campo de texto e botões, e vincular as respectivas rotinas ao evento do clique de cada botão. Para referenciar um objeto do DOM no código é necessário que ele esteja identificado através de uma tag #, então identificaremos o campo de pesquisa com a tag **#search**, para poder utilizá-lo e utilizar as suas propriedades como parâmetro nos eventos associados aos botões. 

Incluir os elementos da barra de pesquisa em **product-list.components.html**:
```html
  <p class="searchbar">
    <label for="product-search">Buscar produtos:</label><br>
    <input id="product-search" #search placeholder="Digite parte do nome do produto">
    <button (click)="searchProducts(search.value)">Buscar</button>
    <button (click)="searchClear(search)">Ver todos</button>
  </p>
```
Incluir as rotinas de pesquisa e limpeza do campo de pesquisa em **product-list.components.ts**:
```javascript
    searchProducts(searchText: string): void {
    this.productList = this.products.filter(
      (f: Product) => f.name
        .toLowerCase()
        .includes(
            searchText.toLowerCase()
      ))
  }
  searchClear(searchObject: any): void {
    searchObject.value = ''
    this.searchProducts('')
  }
```
![Passo #5](https://raw.githubusercontent.com/gtnasser/angular.shoppinglist/main/step5.png)

## 6. Produtos selecionados

Também queremos mostrar a quantidade de itens e valor total do resultado da pesquisa. Então vamos retornar os dados da pesquisa (realizado no objeto filho **ProductListComponent**) para o objeto pai (**AppComponent**) toda vez que a pesquisa for realizada. Vamos criar um evento de saída do objeto (decorator **Output**), que retornará os dados através de um evento disparado a cada execução da pesquisa.
Incluir as definições e a chamada do evento em **product-list.components.ts**:
```javascript
  import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

  @Output() onSearch = new EventEmitter<Product[]>();

  searchProducts(searchText: string): void {
    this.searchResult = this.products.filter(
      (f: Product) => f.name
        .toLowerCase()
        .includes(
            searchText.toLowerCase()
      ))
    this.onSearch.emit(this.productList);
  }
```
O Angular referencia o objeto do evento pela tag **$event**, em **app.component.html**:
```html
<div class="content">
  <app-product-list [products]="productList"
    (onSearch)="updateSelected($event)"></app-product-list>
  <span>Total selecionado: {{ totalQty }} itens, ${{ totalAmount | number: '1.2-2' }} </span>
</div>
```
Vamos calcular o valor total e a quantidade de produtos selecionados pela pesquisa, em **app.component.ts**:
```javascript
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
```
Vamos iniciar o objeto filho já executando uma pesquisa, retornando a lista completa de produtos, e trazendo o resultado da pesquisa no objeto pai, em ****:
``` javascript
  ngOnInit(): void {
    this.productList = this.products
    this.searchProducts('')
  }
```
![Passo #6](https://raw.githubusercontent.com/gtnasser/angular.shoppinglist/main/step6.png)
