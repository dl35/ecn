import { Injectable , EventEmitter } from '@angular/core';

@Injectable()
export class SharedService {
dataChange:EventEmitter<string> = new EventEmitter();

title:any;

constructor() { }


setTitle( value  ) {

    this.title = value ;
    this.dataChange.emit(this.title);
}

getTitle() {
    return this.title ;
}



}