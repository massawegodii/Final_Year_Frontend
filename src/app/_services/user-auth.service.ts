import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, switchMap } from 'rxjs';
import {
  GoogleAuthProvider,
  UserCredential,
  UserInfo,
  updateProfile,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): string[] {
    const rolesString = localStorage.getItem('roles');
    if (rolesString !== null) {
      return JSON.parse(rolesString);
    } else {
      return [];
    }
  }

  public setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }

  public getToken(): string | null {
    const jwtToken = localStorage.getItem('jwtToken');
    return jwtToken !== null ? jwtToken : null;
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

  public isAdmin() {
    const roles: any[] = this.getRoles();
    return roles[0].roleName === 'Admin';
  }

  public isUser() {
    const roles: any[] = this.getRoles();
    return roles[0].roleName === 'User';
  }

  // Firebase Authentication
  currentUser$: Observable<any>;

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.onAuthStateChanged((user) => {
      this.loggedIn.next(!!user);
    });

    this.currentUser$ = auth.authState;
  }

  // get isLoggedIn(): Observable<boolean> {
  //   return this.loggedIn.asObservable();
  // }

  signInWithGoogle() {
    return this.auth.signInWithPopup(new GoogleAuthProvider());
  }

  registerWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return this.auth.createUserWithEmailAndPassword(
      email,
      password
    ) as unknown as Promise<UserCredential>;
  }

  signWithEmailAndPasword(user: { email: string; password: string }) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }



  updateProfileData(profileData: Partial<UserInfo>): Observable<void> {
    return from(this.auth.currentUser).pipe(
      switchMap((user) => {
        if (!user) throw new Error('Not authenticated');
        return from(updateProfile(user, profileData));
      })
    );
  }


}
