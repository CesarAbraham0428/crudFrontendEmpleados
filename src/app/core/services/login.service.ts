import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private role: string = 'recursos humanos'; 
  
  getRole() {
    return this.role;
  }

  constructor() { }

}
