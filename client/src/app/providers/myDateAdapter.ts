
import {NativeDateAdapter}  from '@angular/material'; 

/*
export class myDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      return new Date(Number(str[2]), Number(str[1])-1, Number(str[0]), 12);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}
*/

export const APP_DATE_FORMATS =
{
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'numeric' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};




export class myDateAdapter extends NativeDateAdapter {
  
/*
  parse(value: any): Date | null {
    
        if ((typeof value === 'string') && (value.indexOf('.') > -1)) {
          const str = value.split('.');
    
          const year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
    
          return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
      }
    
      // retirar quando for feito o merge da data por mmalerba
      format(date: Date, displayFormat: Object): string {
        date = new Date(Date.UTC(
          date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
          date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
        displayFormat = Object.assign({}, displayFormat, { timeZone: 'utc' });
    
    
        const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
        return dtf.format(date).replace(/[\u200e\u200f]/g, '');
      }*/

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('-') > -1)) {
          const str = value.split('-');
          const dayArray = str[2].split('T');
    
          const year = Number(str[0]);
          const month = Number(str[1]) - 1;
          const day = Number(dayArray[0]);
    
          return new Date(year, month, day);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
      }



      format(date: Date, displayFormat: Object): string {
  
        //  if (displayFormat === 'input') {
           // console.log("ici" , date );
              const day = date.getDay();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
        //  } else {

         //console.log( date );
        //     return date.toDateString();
             
        //  }
      }
  }

/*
  export const APP_DATE_FORMATS =
  {
      parse: {
          dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
      },
      display: {
          dateInput: 'input',
          monthYearLabel: { year: 'numeric', month: 'numeric' },
          dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
          monthYearA11yLabel: { year: 'numeric', month: 'long' },
      }
  };*/