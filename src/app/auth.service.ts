import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState : any = null

  constructor(private afAuth: AngularFireAuth, private router : Router) { 
    this.afAuth.authState.subscribe(
      auth => this.authState = auth
    )
  }

  get isUserAnonymousLoggedIn() : boolean{
    return (this.authState !== null) ? this.authState.isAnonymous : false
  }

  get currentUserId() : string {
    return (this.authState !== null) ? this.authState.uid : ''
  }

  get currentUserName() : string{
    return this.authState['email']
  }

  get customUserName() : string {
    var capitalize = false
    var data = ''
    for (let char of this.currentUserName){
      if (char == '@' || char == '.'){
        capitalize = true
        continue
      }
      if (capitalize){
        data += char.toUpperCase()
        capitalize = false
        continue
      }
      data += char
    }
    return data

  }

  get currentUser(): any {
    return (this.authState !== null) ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    if ((this.authState !== null) && (!this.isUserAnonymousLoggedIn)) {
      return true
    } else {
      return false
    }
  }
  
  signUpWithEmail(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/'])
  }
}
