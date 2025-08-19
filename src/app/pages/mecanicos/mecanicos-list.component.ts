import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MecanicoService, Mecanico } from '../../core/services/mecanico.service';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { MecanicoFormComponent } from '../mecanicos/mecanicos-form.component';

@Component({
  selector: 'app-mecanicos-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSnackBarModule, DataTableComponent
  ],
  template: `
    <h1>MECANICOS CADASTRADOS</h1>
    
    <div class="actions-container">
      <button mat-flat-button color="primary" (click)="novoMecanico()">NOVO</button>
    </div>

    <div class="filters-container">
      <mat-form-field appearance="outline">
        <mat-label>Pesquisar Nome</mat-label>
        <input matInput [(ngModel)]="search" (keyup.enter)="loadMecanicos()" placeholder="Digite para pesquisar">
      </mat-form-field>
    </div>

    <ng-container *ngIf="mecanicos.length > 0; else noMecanicos">
    <app-data-table
        [columns]="columns"
        [data]="mecanicos"
        [totalElements]="totalElements"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex"
        (pageChange)="onPageChange($event)"
        (edit)="editMecanico($event)"
        (delete)="confirmDelete($event)">
    </app-data-table>
    </ng-container>

    <!-- Template alternativo quando não houver mecanicos -->
    <ng-template #noMecanicos>
    <p style="text-align:center; margin-top:20px;">Nenhum Mecânico Cadastrado</p>
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
export class MecanicosListComponent implements OnInit {
  mecanicos: Mecanico[] = [];
  columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'ativo', header: 'Status' },
    { key: 'usuarioEmail', header: 'E-mail' }
  ];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  search = '';

  constructor(private mecanicoService: MecanicoService, private snack: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadMecanicos();
  }

  loadMecanicos() {
    this.mecanicoService.listarMecanicos(this.pageIndex, this.pageSize, this.search)
        .subscribe(page => {
            // Mapeia o status de boolean para texto
            this.mecanicos = page.content.map(v => ({
              ...v,
              ativoLabel: v.ativo ? 'Ativo' : 'Inativo'
            }));
            this.totalElements = page.totalElements;
        });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMecanicos();
  }

  novoMecanico() {
    const dialogRef = this.dialog.open(MecanicoFormComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(result => { if (result) this.loadMecanicos(); });
  }

  editMecanico(mecanico: Mecanico) {
    const dialogRef = this.dialog.open(MecanicoFormComponent, { width: '400px', data: { mecanico } });
    dialogRef.afterClosed().subscribe(result => { if (result) this.loadMecanicos(); });
  }

  confirmDelete(mecanico: Mecanico) {
    if (confirm(`Deseja excluir o mecânico ${mecanico.nome}?`)) {
      this.mecanicoService.excluirMecanico(mecanico.id).subscribe(() => {
        this.snack.open('Mecânico excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.loadMecanicos();
      });
    }
  }
}
