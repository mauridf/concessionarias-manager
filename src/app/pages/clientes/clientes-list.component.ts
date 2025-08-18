import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ClienteFormComponent } from '../clientes/clientes-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClienteService, Cliente } from '../../core/services/cliente.service';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatSnackBarModule, DataTableComponent
  ],
  template: `
    <h1>CLIENTES CADASTRADOS</h1>
    
    <div class="actions-container">
      <button mat-flat-button color="primary" (click)="novoCliente()">NOVO</button>
    </div>

    <div class="filters-container">
      <mat-form-field appearance="outline">
        <mat-label>Pesquisar Nome</mat-label>
        <input matInput [(ngModel)]="search" (keyup.enter)="loadClientes()" placeholder="Digite para pesquisar">
      </mat-form-field>
    </div>

    <app-data-table
      [columns]="columns"
      [data]="clientes"
      [totalElements]="totalElements"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex"
      (pageChange)="onPageChange($event)"
      (edit)="editCliente($event)"
      (delete)="confirmDelete($event)">
    </app-data-table>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    
    .actions-container {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .filters-container {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    mat-form-field {
      width: 300px;
    }
  `]
})
export class ClientesListComponent implements OnInit {
  clientes: Cliente[] = [];
  columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'cpf', header: 'CPF' },
    { key: 'email', header: 'E-mail' },
    { key: 'telefone', header: 'Telefone'},
    { key: 'endereco', header: 'Endereço'},
    { key: 'dataNascimento', header: 'Data de Nascimento'}
  ];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  search = '';
  selectedRole = '';

  constructor(private clienteService: ClienteService, private snack: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.clienteService.listarClientes(this.pageIndex, this.pageSize, this.search)
        .subscribe(page => {
            this.clientes = page.content;
            this.totalElements = page.totalElements;
        });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClientes();
  }

  novoCliente() {
    const dialogRef = this.dialog.open(ClienteFormComponent, {
        width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadClientes();
    });
   }

  editCliente(cliente: Cliente) {
    const dialogRef = this.dialog.open(ClienteFormComponent, {
        width: '400px',
        data: { cliente }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadClientes();
    });
  }

  confirmDelete(cliente: Cliente) {
    if (confirm(`Deseja excluir o cliente ${cliente.nome}?`)) {
      this.clienteService.excluirCliente(cliente.id).subscribe(() => {
        this.snack.open('Cliente excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.loadClientes();
      });
    }
  }
}
