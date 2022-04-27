export class NuevoUsuario {
  nombre: string;
  apellido: string;
  fechanac: Date;
  email: string;
  nombreUsuario: string;
  password: string;
  //authorities: string[];

  constructor(nombre: string, apellido: string, fechanac: Date, email: string, nombreUsuario: string, password: string) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.fechanac = fechanac;
    this.email = email;
    this.nombreUsuario = nombreUsuario;
    this.password = password;
  }
}
