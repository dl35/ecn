import { Component, OnInit } from '@angular/core';
import { EngagementService } from '../services/engagement.service';
import { SharedService } from '../services/shared.service';



@Component({
  selector: 'app-engagement',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {

  compets :any ;
  test:any;
 
  constructor(private engservice : EngagementService , private shservice: SharedService   ) { }


  ngOnInit() {
      
    this.shservice.setTitle("Compétitions") ;

    this.test=this.shservice.getTitle();
   this.engservice.get().subscribe (
                 response => this.compets =  response   , 
                  error => { console.log( error) ;}
                                   )

            }





}
