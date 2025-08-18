import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Cliente, ClienteService } from '../../core/services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatDialogModule, MatSnackBarModule, MatIconModule
  ],
  template: `
    <h2>{{ data?.cliente ? 'EDITAR' : 'REGISTRAR' }} CLIENTE</h2>

    <form (ngSubmit)="onSave()" class="form-container">
      <mat-form-field appearance="outline">
        <mat-label>Nome</mat-label>
        <input matInput [(ngModel)]="cliente.nome" name="nome" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>CPF</mat-label>
        <input matInput [(ngModel)]="cliente.cpf" name="cpf" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="cliente.email" name="email" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Telefone</mat-label>
        <input matInput [(ngModel)]="cliente.telefone" name="telefone" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Endereço</mat-label>
        <input matInput [(ngModel)]="cliente.endereco" name="endereco">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Data de Nascimento</mat-label>
        <input matInput type="date" [(ngModel)]="cliente.dataNascimento" name="dataNascimento">
      </mat-form-field>

      <div class="actions">
        <button mat-flat-button color="primary" type="submit">Salvar</button>
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    h2 { text-align: center; margin-bottom: 20px; }
    .form-container { display: flex; flex-direction: column; gap: 16px; width: 300px; margin: auto; }
    .actions { display: flex; justify-content: space-between; margin-top: 10px; }
  `]
})
export class ClienteFormComponent implements OnInit {
  cliente: Partial<Cliente> = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    dataNascimento: undefined
  };

  constructor(
    public dialogRef: MatDialogRef<ClienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cliente?: Cliente } = {},
    private clienteService: ClienteService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.data?.cliente) {
      setTimeout(() => {
        this.cliente = { ...this.data.cliente };
      });
    }
  }

  onSave() {
    if (this.data?.cliente?.id) {
      this.clienteService.atualizarCliente(this.data.cliente.id, this.cliente).subscribe(() => {
        this.snack.open('Cliente atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      });
    } else {
      this.clienteService.criarCliente(this.cliente).subscribe(() => {
        this.snack.open('Cliente registrado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      });
    }
  }
}
