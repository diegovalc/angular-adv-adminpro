import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export class Usuario {
    
    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public uid?: string
    ) {}

    get imageUrl(){
        // /uploads/usuarios/no-image

        if (!this.img) {
            return `${base_url}/uploads/usuarios/no-image`;
        }else if ( this.img.includes('https') ) { //si el nombre de la imagen incluye https
            return this.img;            
        }else if (this.img) {
            return `${base_url}/uploads/usuarios/${this.img}`;
        }else{
            return `${base_url}/uploads/usuarios/no-image`;
        }
    }
}