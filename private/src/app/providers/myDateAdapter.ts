import {NativeDateAdapter }  from '@angular/material'; 





export const APP_DATE_FORMATS =
{
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};




export class myDateAdapter extends NativeDateAdapter {
  

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
} 


    parse(value: any): Date | null {
      
     
        if ((typeof value === 'string') && (value.indexOf('/') > -1)  ) {
          
          const str = value.split('/');
          const year = Number(str[2]);
          const month = Number(str[1]) ;
          const day = Number(str[0]);
     
          return new Date(year, month, day);
         
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
      }



      format(date: Date, displayFormat: Object): string {
 
          if (displayFormat === 'input') {
            console.log(  date.toLocaleString() ) ;


              const day = date.getDate();
              const month = date.getMonth()+1;
              const year = date.getFullYear();
              return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
         } 
         else
          {
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
          }
      }
  }

