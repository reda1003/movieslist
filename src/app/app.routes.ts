import { Routes } from '@angular/router';
import { Login  } from './components//login/login';
import { Signin  } from './components/signin/signin';
import { Movies } from './components/movies/movies';    
import { Component } from '@angular/core';
import { movieguardGuard } from './guards/movieguard-guard';

export const routes: Routes = [
    {path:"",component:Signin},
    {path:"login",component:Login},
    {path:"signin",component:Signin},
    {path:'movies',component:Movies, canActivate:[movieguardGuard]}
];
