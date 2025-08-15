import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User, UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatButtonModule, MatDialogModule, MatSnackBarModule
  ],
  template: `
    <h2>{{ data.user ? 'EDITAR' : 'REGISTRAR' }} USUÁRIO</h2>

    <form (ngSubmit)="onSave()" class="form-container">
      <mat-form-field appearance="outline">
        <mat-label>Nome</mat-label>
        <input matInput [(ngModel)]="user.nome" name="nome" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="user.email" name="email" required>
      </mat-form-field>

      <mat-form-field appearance="outline" *ngIf="!data.user">
        <mat-label>Senha</mat-label>
        <input matInput type="password" [(ngModel)]="user.senha" name="senha" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Role</mat-label>
        <mat-select [(ngModel)]="user.role" name="role" required>
          <mat-option value="GERENTE">Gerente</mat-option>
          <mat-option value="VENDEDOR">Vendedor</mat-option>
          <mat-option value="MECANICO">Mecânico</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="actions">
        <button mat-flat-button color="primary" type="submit">Salvar</button>
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 300px;
      margin: auto;
    }
    .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  `]
})
export class UsuarioFormComponent implements OnInit {
  user: any = { nome: '', email: '', senha: '', role: '' };

  constructor(
    public dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User },
    private userService: UserService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.data?.user) {
      this.user = { ...this.data.user }; // copia para edição
    }
  }

  onSave() {
    if (this.data?.user) {
      // Edição
      this.userService.updateUser(this.user.id, this.user).subscribe(() => {
        this.snack.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      });
    } else {
      // Cadastro
      this.userService.createUser(this.user).subscribe(() => {
        this.snack.open('Usuário registrado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      });
    }
  }
}
