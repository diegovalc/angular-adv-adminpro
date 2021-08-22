import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean= true;
  public imgSubs: Subscription;

  constructor( 
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
    ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(100)
    ).subscribe( 
      img => this.cargarUsuarios()
    );
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe(resp=>{
          
      this.totalUsuarios = resp.total;
      this.usuarios = resp.usuarios;
      this.usuariosTemp= resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number){
    this.desde += valor; 

    if (this.desde<0) {
      this.desde = 0;
    }else if(this.desde>=this.totalUsuarios){
      this.desde -= valor; 
    }

    this.cargarUsuarios();

  }

  buscar(termino: string){

    if (termino.length ===0){
      return this.usuarios = this.usuariosTemp; // si el termino de busqueda es vacio entonces ya no continua con el metodo
    }

    this.busquedasService.buscar( 'usuarios', termino).subscribe(
      resultados=> {
        this.usuarios = resultados;
      }
    );
    
  }

  eliminarUsuario( usuario: Usuario ){

    if ( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('Error', 'No puede borrarse asi mismo','error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta apunto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario(usuario).subscribe( resp =>{
          Swal.fire(
            'Usuario Borrado!',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          )
          this.cargarUsuarios();
        })
        
      }
    })
    
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario).subscribe(res=>{
      console.log(res);
      
    })
    
  }

  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
