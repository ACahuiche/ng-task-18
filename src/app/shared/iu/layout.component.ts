import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthStateService } from "../data-access/auth-state.service";
import { Observable } from "rxjs";
import { User } from "@angular/fire/auth";
import { UserDB, UserService } from "../../user/data-access/user.service";

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})

export default class LayoutComponent implements OnInit {

  private authState = inject(AuthStateService);
  private router = inject(Router);
  private _user = inject(UserService);
  isDataLoaded = false;
  userName: string;
  userEmail: string;
  urlPhoto: string;
  uidejem: string;
  userState$: Observable<User | null>;
  user: UserDB;
  isPhotoProfile: boolean;

  constructor() {
    this.userName = '';
    this.urlPhoto = '';
    this.uidejem = '';
    this.userEmail = '';
    this.userState$ = this.authState.authState$;
    this.user = {} as UserDB;
    this.isPhotoProfile = false;
  }

  ngOnInit(): void {
    this.userState$.subscribe( async user => {
      if (user) {
        this.userName = user.displayName || 'Usuario';
        this.userEmail = user.email || '';
        this.uidejem = user.uid || '';

        if(user.photoURL) {
          this.urlPhoto = user.photoURL;
          this.isPhotoProfile = true;
        }
        else {
          this.urlPhoto = '';
          this.isPhotoProfile = false;
        }

        try {
          this.user = await this._user.getUser();
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
        }

        this.isDataLoaded = true;
      }
    });
  }

  async logOut() {
    this.router.navigateByUrl('/auth/sign-in');
    await this.authState.logOutSesion();
  }
}