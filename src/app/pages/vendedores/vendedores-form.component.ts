import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { VendedorService, Vendedor } from '../../core/services/vendedor.service';
import { UserService, User } from '../../core/services/user.service';

@Component({
  selector: 'app-vendedor-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDialogModule, MatSnackBarModule, MatIconModule
  ],
  template: `
    <h2>{{ data?.vendedor ? 'EDITAR' : 'REGISTRAR' }} VENDEDOR</h2>

    <form (ngSubmit)="onSave()" class="form-container">

      <!-- Combo de Usuários -->
      <mat-form-field appearance="outline">
        <mat-label>Usuário</mat-label>
        <mat-select [(ngModel)]="selectedUser" name="usuarioId" (selectionChange)="onUserChange($event.value)" [disabled]="!!data?.vendedor" required>
          <mat-option *ngFor="let user of usuarios" [value]="user">
            {{ user.nome }} ({{ user.email }})
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Campos preenchidos automaticamente -->
      <mat-form-field appearance="outline">
        <mat-label>Nome do Usuário</mat-label>
        <input matInput [value]="selectedUser?.nome" disabled>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email do Usuário</mat-label>
        <input matInput [value]="selectedUser?.email" disabled>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Role</mat-label>
        <input matInput [value]="selectedUser?.role" disabled>
      </mat-form-field>

      <!-- Campos de edição -->
      <mat-form-field appearance="outline">
        <mat-label>Nome do Vendedor</mat-label>
        <input matInput [(ngModel)]="vendedor.nome" name="nome" required [disabled]="!selectedUser">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Ativo</mat-label>
        <mat-select [(ngModel)]="vendedor.ativo" name="ativo" [disabled]="!selectedUser">
          <mat-option [value]="true">Ativo</mat-option>
          <mat-option [value]="false">Inativo</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="actions">
        <button mat-flat-button color="primary" type="submit" [disabled]="!selectedUser">Salvar</button>
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    h2 { text-align: center; margin-bottom: 20px; }
    .form-container { display: flex; flex-direction: column; gap: 16px; width: 400px; margin: auto; }
    .actions { display: flex; justify-content: space-between; margin-top: 10px; }
  `]
})
export class VendedorFormComponent implements OnInit {

  usuarios: User[] = [];
  selectedUser?: User;
  vendedor: Partial<Vendedor> = {
    nome: '',
    ativo: true
  };

  constructor(
    public dialogRef: MatDialogRef<VendedorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vendedor?: Vendedor } = {},
    private vendedorService: VendedorService,
    private userService: UserService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    // Se estiver editando, já popula os dados
    if (this.data?.vendedor) {
      this.vendedor = { ...this.data.vendedor };
      // Preenche o selectedUser com o usuário do vendedor
      this.userService.getUserById(this.vendedor.usuarioId!).subscribe(user => {
        this.selectedUser = user;
      });
    } else {
      // Lista usuários com role VENDEDOR
      this.userService.getUsersByRole('VENDEDOR').subscribe(page => {
        this.usuarios = page.content;
      });
    }
  }

  onUserChange(user: User) {
    this.selectedUser = user;
    this.vendedor.usuarioId = user.id;
  }

  onSave() {
    if (this.data?.vendedor?.id) {
      this.vendedorService.atualizarVendedor(this.data.vendedor.id, this.vendedor).subscribe(() => {
        this.snack.open('Vendedor atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      });
    } else {
      this.vendedorService.criarVendedor(this.vendedor).subscribe(() => {
        this.snack.open('Vendedor registrado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      });
    }
  }
}
