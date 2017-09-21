import { Component } from '@angular/core';
import { SharedService } from './services/shared.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Application ecn';

constructor(private sharedservice: SharedService) {
        // issue is here, the _configService.getConfig() get an empty object 
        // but I had filled it just before
        //this.title = sharedservice.getTitle();
    }

ngOnInit() { 
    this.sharedservice.dataChange.subscribe( data =>  this.title=data ) ;
         
  }

}
