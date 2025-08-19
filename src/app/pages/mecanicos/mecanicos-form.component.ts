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
import { MecanicoService, Mecanico } from '../../core/services/mecanico.service';
import { UserService, User } from '../../core/services/user.service';

@Component({
  selector: 'app-mecanico-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDialogModule, MatSnackBarModule, MatIconModule
  ],
  template: `
    <h2>{{ data?.mecanico ? 'EDITAR' : 'REGISTRAR' }} MECÂNICO</h2>

    <form (ngSubmit)="onSave()" class="form-container">

      <!-- Combo de Usuários -->
      <mat-form-field appearance="outline">
        <mat-label>Usuário</mat-label>
        <mat-select [(ngModel)]="selectedUser" name="usuarioId" (selectionChange)="onUserChange($event.value)" [disabled]="!!data?.mecanico" required>
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
        <mat-label>Nome do Mecânico</mat-label>
        <input matInput [(ngModel)]="mecanico.nome" name="nome" required [disabled]="!selectedUser">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Ativo</mat-label>
        <mat-select [(ngModel)]="mecanico.ativo" name="ativo" [disabled]="!selectedUser">
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
export class MecanicoFormComponent implements OnInit {

  usuarios: User[] = [];
  selectedUser?: User;
  mecanico: Partial<Mecanico> = {
    nome: '',
    ativo: true
  };

  constructor(
    public dialogRef: MatDialogRef<MecanicoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mecanico?: Mecanico } = {},
    private mecanicoService: MecanicoService,
    private userService: UserService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    // Se estiver editando, já popula os dados
    if (this.data?.mecanico) {
      this.mecanico = { ...this.data.mecanico };
      // Preenche o selectedUser com o usuário do mecânico
      this.userService.getUserById(this.mecanico.usuarioId!).subscribe(user => {
        this.selectedUser = user;
      });
    } else {
      // Lista usuários com role MECANICO
      this.userService.getUsersByRole('MECANICO').subscribe(page => {
        this.usuarios = page.content;
      });
    }
  }

  onUserChange(user: User) {
    this.selectedUser = user;
    this.mecanico.usuarioId = user.id;
  }

  onSave() {
    if (this.data?.mecanico?.id) {
      this.mecanicoService.atualizarMecanico(this.data.mecanico.id, this.mecanico).subscribe(() => {
        this.snack.open('Mecânico atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      });
    } else {
      this.mecanicoService.criarMecanico(this.mecanico).subscribe(() => {
        this.snack.open('Mecânico registrado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      });
    }
  }
}
