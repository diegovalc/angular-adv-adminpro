import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public auth2: any;

  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  constructor( 
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
    ) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login(){

    this.usuarioService.login(this.loginForm.value).subscribe( resp =>{
      
      if ( this.loginForm.get('remember').value ) {
        // si quiere el usuario recordar su correo
        localStorage.setItem('email', this.loginForm.get('email').value);
      } else {
        localStorage.removeItem('email');
      }

      this.router.navigateByUrl('/'); 
      
    }, err =>{
      // si sucede un error
      Swal.fire('Error',err.error.msg,'error');
      
    })
    //console.log( this.loginForm.value );
       
  }

  onSuccess(googleUser) {
    //console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    const id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });
    this.startApp();
  }

  async startApp() {
    
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));

  };

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser)=> {
          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle( id_token).subscribe( resp =>{
            
            this.ngZone.run(()=>{
              this.router.navigateByUrl('/'); 
            })

          });

        }, (error)=> {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
