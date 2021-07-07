import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm :  FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imagenTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
    ) { 
      this.usuario = usuarioService.usuario;
    }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre ,Validators.required],
      email: [this.usuario.email ,[Validators.required, Validators.email]],
    })

  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe( res=>{
      const {nombre, email } =  this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;
      Swal.fire('Usuario actualizado',this.usuario.nombre,'success');
      
    }, (err)=>{

      Swal.fire('Error',err.error.msg,'error');
      
    })
    
  }

  cambiarImagen(file: File){
    this.imagenSubir = file;

    if (!file) {
      return this.imagenTemp = null; 
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () =>{
      this.imagenTemp = reader.result;
      console.log(reader.result);
      
    }
    
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid).then( 
      img =>{
        this.usuario.img = img;
        Swal.fire('Imagen Guardada','Imagen de usuario actualizada','success');
      } 
      
    )
  }
}
