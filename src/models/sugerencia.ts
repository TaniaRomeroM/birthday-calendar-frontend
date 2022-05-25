export class Sugerencia {
  constructor(
    public sugerenciaId: number,
    public usuarioId: number,
    public nombre: string,
    public descripcion: string,
    public estadoSugerencia: string,
    public nombreUsuario: string
  ) { }
}
