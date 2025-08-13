import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioFormComponent } from '../usuarios/usuarios-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService, User } from '../../core/services/user.service';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatSnackBarModule, DataTableComponent
  ],
  template: `
    <h1>USUÁRIOS CADASTRADOS</h1>
    <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
        <button mat-flat-button color="primary" (click)="novoUsuario()">NOVO</button>
    </div>
    <div class="filters">
      <mat-form-field appearance="outline">
        <mat-label>Pesquisar Nome</mat-label>
        <input matInput [(ngModel)]="search" (keyup.enter)="loadUsers()" placeholder="Digite para pesquisar">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Filtrar por Role</mat-label>
        <mat-select [(ngModel)]="selectedRole" (selectionChange)="loadUsers()">
          <mat-option value="">Todas</mat-option>
          <mat-option value="GERENTE">Gerente</mat-option>
          <mat-option value="VENDEDOR">Vendedor</mat-option>
          <mat-option value="MECANICO">Mecânico</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <app-data-table
      [columns]="columns"
      [data]="users"
      [totalElements]="totalElements"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex"
      (pageChange)="onPageChange($event)"
      (edit)="editUser($event)"
      (delete)="confirmDelete($event)">
    </app-data-table>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }
  `]
})
export class UsuariosListComponent implements OnInit {
  users: User[] = [];
  columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' }
  ];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  search = '';
  selectedRole = '';

  constructor(private userService: UserService, private snack: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    if (this.selectedRole) {
      this.userService.getUsersByRole(this.selectedRole, this.pageIndex, this.pageSize)
        .subscribe(page => {
          this.users = page.content;
          this.totalElements = page.totalElements;
        });
    } else {
      this.userService.getUsers(this.pageIndex, this.pageSize)
        .subscribe(page => {
          this.users = page.content;
          this.totalElements = page.totalElements;
        });
    }
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  novoUsuario() {
  const dialogRef = this.dialog.open(UsuarioFormComponent, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) this.loadUsers();
  });
}

editUser(user: User) {
  const dialogRef = this.dialog.open(UsuarioFormComponent, {
    width: '400px',
    data: { user }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) this.loadUsers();
  });
}

  confirmDelete(user: User) {
    if (confirm(`Deseja excluir o usuário ${user.nome}?`)) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.snack.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.loadUsers();
      });
    }
  }
}
