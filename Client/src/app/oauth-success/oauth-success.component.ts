
// // import { Component, OnInit } from '@angular/core';
// // import { ActivatedRoute, Router } from '@angular/router';

// // @Component({
// //   selector: 'app-oauth-success',
// //   templateUrl: './oauth-success.component.html',
// //   styleUrls: ['./oauth-success.component.scss']
// // })
// // export class OauthSuccessComponent implements OnInit {

// //   loading = true;
// //   error = false;

// //   constructor(
// //     private route: ActivatedRoute,
// //     private router: Router
// //   ) {}

// //   ngOnInit(): void {
// //     this.route.queryParams.subscribe(params => {
// //       const token = params['token'];

// //       if (token) {
// //         // Store JWT securely
// //         localStorage.setItem('auth_token', token);

// //         // Redirect after short delay (UX)
// //         setTimeout(() => {
// //           this.router.navigate(['/dashboard']);
// //         }, 2000);

// //       } else {
// //         this.loading = false;
// //         this.error = true;
// //       }
// //     });
// //   }
// // }

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-oauth-success',
//   templateUrl: './oauth-success.component.html',
//   styleUrls: ['./oauth-success.component.scss']
// })
// export class OauthSuccessComponent implements OnInit {

//   loading = true;

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     // Cookie already set by backend
//     setTimeout(() => {
//       this.router.navigate(['/']);
//     }, 1500);
//   }
// }


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
    /*
      ✅ Token is already stored in HttpOnly cookie by backend
      ❌ No queryParams
      ❌ No localStorage
    */

    setTimeout(() => {
      // Redirect to home/dashboard
      this.router.navigate(['/']);

      // Stop loader (optional)
      this.loading = false;
    }, 1500);
  }
}
