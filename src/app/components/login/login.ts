import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

    authService=inject(AuthService)
    router=inject(Router)
    
    email=""
    mdp=""

  login(){
    this.authService.login(this.email,this.mdp)
    .then(()=>{
      this.router.navigate(['/movies'])
    })
  }

}
