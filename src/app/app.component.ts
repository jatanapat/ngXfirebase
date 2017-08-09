import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: Observable<firebase.User>;
  items: FirebaseListObservable<any[]>;
  msgVal: string = '';
  error: any;

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {
    this.items = af.list('/messages', {
      query: {
        limitToLast: 50
      }
    });

    this.user = this.afAuth.authState;
  }

  registerUser(email, password) {
    console.log(email);
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  register(event, name, email, password) {
    event.preventDefault();
    this.registerUser(email, password)
    .then((user) => {
      this.saveUserInfoFromForm(user.uid, name, email)
      .catch((err) => {
        this.error = err;
      });
    })
    .catch((error) => {
      this.error = error;
      console.log(this.error);
    });
  }

  saveUserInfoFromForm(uid, name, email) {
    return this.af.database.ref('registeredUsers/' + uid).set({
      name: name,
      email: email,
    });
  }

  login(event, email, password){
    event.preventDefault();
    this.loginWithEmail(email, password)
      .catch((error: any) => {
        if (error) {
          this.error = error;
          console.log(this.error);
        }
      });
  }

  loginWithEmail(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  loginAnonymously() {
    this.afAuth.auth.signInAnonymously();
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  Send(desc: string) {
    this.items.push({ message: desc });
    this.msgVal = '';
  }

}
