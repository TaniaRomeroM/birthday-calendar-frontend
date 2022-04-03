import { Component, OnInit } from '@angular/core';
import { ProductService } from './productservice';
import { Product } from './product';

@Component({
  selector: 'app-fiestas-c',
  templateUrl: './fiestas-c.component.html',
  styleUrls: ['./fiestas-c.component.css']
})
export class FiestasCComponent implements OnInit {

  products: Product[];

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.getProductsSmall().then(data => this.products = data);
    }

}