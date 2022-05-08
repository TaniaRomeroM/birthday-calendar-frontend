import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NuevoUsuario } from 'src/models/nuevo-usuario';
import { AuthService } from '../service/auth.service';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  isRegister = false;
  isRegisterFail = false;
  nuevoUsuario: NuevoUsuario;
  nombre: string;
  apellido: string;
  fechanac: Date;
  nombreUsuario: string;
  email: string;
  password: string;
  errMsg: string;

  pipe = new DatePipe('es');
  todayWithPipe = null;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  onRegister(): void {
    if (this.fechanac instanceof Date) {
      this.todayWithPipe = this.pipe.transform(this.fechanac, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
      this.fechanac = this.todayWithPipe;
    }

    this.nuevoUsuario = new NuevoUsuario(this.nombre, this.apellido, this.fechanac, this.email, this.nombreUsuario, this.password);
    this.authService.nuevo(this.nuevoUsuario).subscribe(
      data => {
        this.isRegister = true;
        this.isRegisterFail = false;
        this.messageService.add({severity:'success', summary: 'Nuevo usuario', detail: 'Cuenta creada con éxito'});
        //this.clearFields(); // si no se redirige habría que borrar los campos para que se vacien al registrarse
        setTimeout(() => {
          this.router.navigate(['']);
        }, 1000);
      },
      err => {
        this.isRegister = false;
        this.isRegisterFail = true;
        this.errMsg = err.error.message;
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error en el registro: ' + this.errMsg});
      }
    );
  }

  showRegisterConfirm() {
    this.confirmationService.confirm({
      message: '¿Quieres registrar el usuario?',
      header: 'Nuevo usuario',
      accept: () => {
        this.messageService.clear('c');
        this.onRegister();
      }
    });
  }

  clearFields(): void {
    this.nombre = "";
    this.apellido = "";
    this.fechanac = new Date();
    this.nombreUsuario = "";
    this.email  = "";
    this.password = "";
  }

  ngOnInit(): void {
  }

}
