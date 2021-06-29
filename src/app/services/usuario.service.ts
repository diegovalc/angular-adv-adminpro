import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor( 
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone ) { 
  
      this.googleInit();
  }

  googleInit(){

    return new Promise<void>( resolve =>{
      gapi.load('auth2', ()=>{
        this.auth2 = gapi.auth2.init({
          client_id: '993403080373-jt6d92880ccla0sdrs8p29c3bqctihc7.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    })
  }

  logout(){
    localStorage.removeItem('token');
    
    this.auth2.signOut().then( ()=> {

      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean>{

    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers:{
        'x-token': token
      }
    }).pipe( tap( (resp: any) =>{
      localStorage.setItem('token', resp.token)
    }),
      map( resp => true ), //si existe el token en el backend retorna true
      catchError( error => of(false))
    );

  }

  crearUsuario( formData: RegisterForm ){
    
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap( (resp: any) =>{
       localStorage.setItem('token', resp.token); // guardar token en el localstorage
        
      })
    )
    
  }

  login( formData: LoginForm ){
    
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap( (resp: any) =>{
       localStorage.setItem('token', resp.token); // guardar token en el localstorage
        
      })
    )
    
  }

  loginGoogle( token: string ){
    
    return this.http.post(`${base_url}/login/google`, {token}).pipe(
      tap( (resp: any) =>{
       localStorage.setItem('token', resp.token); // guardar token en el localstorage
        
      })
    )
    
  }


}
