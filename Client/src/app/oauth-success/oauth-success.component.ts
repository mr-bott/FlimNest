import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oauth-success',
  templateUrl: './oauth-success.component.html',
  styleUrls: ['./oauth-success.component.scss']
})
export class OauthSuccessComponent implements OnInit {

  loading = true;
  error = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
   

    setTimeout(() => {
      // Redirect to home/dashboard
      this.router.navigate(['/']);

      // Stop loader (optional)
      this.loading = false;
    }, 1500);
  }
}
