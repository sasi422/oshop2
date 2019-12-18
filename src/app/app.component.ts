import { UserService } from 'shared/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isSpinnerActive: boolean;
  isBlockingSpinner: boolean;
  spinnerSub: any;
  
  constructor(private userService: UserService, private auth: AuthService, router: Router, private spinner: SpinnerService) {
    
    this.isSpinnerActive    = false;
    this.isBlockingSpinner  = true;

    auth.user$.subscribe(user => {
      if (!user) return;
      userService.save(user);
      
      let returnUrl = localStorage.getItem('returnUrl');
      if (!returnUrl) return;
      localStorage.removeItem('returnUrl');
      router.navigateByUrl(returnUrl);


    });
  }

  ngOnInit(): void {
    this.auth.appUser$.subscribe();
    this.spinnerSub = this.spinner.currentStatus.subscribe(
      (data) => {
        this.isSpinnerActive   = data.enableSpinner;    // Current spinner status
        this.isBlockingSpinner = data.blocking;         // Whether spinner blocks UI
      }
    );
  }

  ngOnDestroy(): void {
    this.spinnerSub.unsubscribe();
  }
}
