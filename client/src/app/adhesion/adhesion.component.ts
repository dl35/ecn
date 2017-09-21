import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adhesion',
  templateUrl: './adhesion.component.html',
  styleUrls: ['./adhesion.component.css']
})
export class AdhesionComponent implements OnInit {

  id: number;
  sub:any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = +params['id']; // (+) converts string 'id' to a number
    });

console.log( this.id );

  }

    ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
