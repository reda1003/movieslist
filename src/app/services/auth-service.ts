import { inject, Injectable } from '@angular/core';
import { Auth,user } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private  auth=inject(Auth);
  user$:Observable<any>=user(this.auth)
  get CurrentUser(){
    return this.auth.currentUser
  }

  signin(email:string,mdp:string){
    return createUserWithEmailAndPassword(this.auth,email,mdp)
  }

  login(email:string,mdp:string){
    return signInWithEmailAndPassword(this.auth,email,mdp)
  }
  logout(){
    return signOut(this.auth)
  }

}
