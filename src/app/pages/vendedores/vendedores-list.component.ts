import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { VendedorService, Vendedor } from '../../core/services/vendedor.service';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { VendedorFormComponent } from '../vendedores/vendedores-form.component';

@Component({
  selector: 'app-vendedores-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSnackBarModule, DataTableComponent
  ],
  template: `
    <h1>VENDEDORES CADASTRADOS</h1>
    
    <div class="actions-container">
      <button mat-flat-button color="primary" (click)="novoVendedor()">NOVO</button>
    </div>

    <div class="filters-container">
      <mat-form-field appearance="outline">
        <mat-label>Pesquisar Nome</mat-label>
        <input matInput [(ngModel)]="search" (keyup.enter)="loadVendedores()" placeholder="Digite para pesquisar">
      </mat-form-field>
    </div>

    <ng-container *ngIf="vendedores.length > 0; else noVendedores">
    <app-data-table
        [columns]="columns"
        [data]="vendedores"
        [totalElements]="totalElements"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex"
        (pageChange)="onPageChange($event)"
        (edit)="editVendedor($event)"
        (delete)="confirmDelete($event)">
    </app-data-table>
    </ng-container>

    <!-- Template alternativo quando não houver vendedores -->
    <ng-template #noVendedores>
    <p style="text-align:center; margin-top:20px;">Nenhum Vendedor Cadastrado</p>
    </ng-template>
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
export class VendedoresListComponent implements OnInit {
  vendedores: Vendedor[] = [];
  columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'ativo', header: 'Status' },
    { key: 'usuarioEmail', header: 'E-mail' }
  ];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  search = '';

  constructor(private vendedorService: VendedorService, private snack: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadVendedores();
  }

  loadVendedores() {
    this.vendedorService.listarVendedores(this.pageIndex, this.pageSize, this.search)
        .subscribe(page => {
            // Mapeia o status de boolean para texto
            this.vendedores = page.content.map(v => ({
              ...v,
              ativoLabel: v.ativo ? 'Ativo' : 'Inativo'
            }));
            this.totalElements = page.totalElements;
        });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadVendedores();
  }

  novoVendedor() {
    const dialogRef = this.dialog.open(VendedorFormComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(result => { if (result) this.loadVendedores(); });
  }

  editVendedor(vendedor: Vendedor) {
    const dialogRef = this.dialog.open(VendedorFormComponent, { width: '400px', data: { vendedor } });
    dialogRef.afterClosed().subscribe(result => { if (result) this.loadVendedores(); });
  }

  confirmDelete(vendedor: Vendedor) {
    if (confirm(`Deseja excluir o vendedor ${vendedor.nome}?`)) {
      this.vendedorService.excluirVendedor(vendedor.id).subscribe(() => {
        this.snack.open('Vendedor excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.loadVendedores();
      });
    }
  }
}
