import { Injectable } from '@angular/core';
import * as Alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() {}

  confirm(message: string, okCallback: () => any) {
    Alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      } else {
      }
    });
  }

  Success(message: string) {
    Alertify.success(message);
  }

  Error(message: string) {
    Alertify.error(message);
  }

  Warning(message: string) {
    Alertify.warning(message);
  }

  Message(message: string) {
    Alertify.message(message);
  }
}
