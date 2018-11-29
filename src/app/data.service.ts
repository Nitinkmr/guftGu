import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  isNewUser = true;
  email = '';
  password = '';
  errorMessage = '';
  error: { name: string, message: string } = { name: '', message: '' };
  resetPassword = false;

  chats : Observable<any[]>

  constructor(public authService: AuthService, private router: Router,public db : AngularFireDatabase) { }

  checkUserInfo() {
    if (this.authService.isUserEmailLoggedIn) {
      this.router.navigate(['/user'])
    }
  }
 
  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }
 
  changeForm() {
    this.isNewUser = !this.isNewUser
  }
 
  onSignUp(): void {
    this.clearErrorMessage()
 
    if (this.validateForm(this.email, this.password)) {
      this.authService.signUpWithEmail(this.email, this.password)
        .then(() => {
          this.router.navigate(['/user'])
        }).catch(_error => {
          this.error = _error
          this.router.navigate(['/'])
        })
    }
  }
 
  onLoginEmail(): void {
    this.clearErrorMessage()
 
    if (this.validateForm(this.email, this.password)) {
      this.authService.loginWithEmail(this.email, this.password)
        .then(() => this.router.navigate(['/user']))
        .catch(_error => {
          this.error = _error
          this.router.navigate(['/'])
        })
    }
  }
 
  validateForm(email: string, password: string): boolean {
    if (email.length === 0) {
      this.errorMessage = 'Please enter Email!'
      return false
    }
 
    if (password.length === 0) {
      this.errorMessage = 'Please enter Password!'
      return false
    }
 
    if (password.length < 6) {
      this.errorMessage = 'Password should be at least 6 characters!'
      return false
    }
 
    this.errorMessage = ''
 
    return true
  }
 
  isValidMailFormat(email: string) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
 
    if ((email.length === 0) && (!EMAIL_REGEXP.test(email))) {
      return false;
    }
 
    return true;
  }

  logout(){
    this.authService.signOut()
  }

  getUsers(email : string){
    return this.db.list('/'+this.authService.customName(this.authService.currentUserName)+'/').valueChanges()
  }

  getMessages(selectedUser : string){
    return this.db.list('/'+this.authService.customName(this.authService.currentUserName)+'/'+selectedUser+'/messages').valueChanges()
  }
}
