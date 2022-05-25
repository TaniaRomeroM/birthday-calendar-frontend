export class Contacto {
  constructor(
    public contactoId: number,
    public usuarioId: number,
    public nombre: string,
    public apellido: string,
    public fechanac: Date,
    public email: string,
    public edad: number
  ) { }
}
