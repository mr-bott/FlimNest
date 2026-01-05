
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // Backend Google OAuth endpoint
  googleLogin() {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
