import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private role: string = 'empleado'; 
  
  getRole() {
    return this.role;
  }

  constructor() { }

}
