import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface TableColumn {
  key: string;
  header: string;
  formatter?: (value: any) => string; // Novo campo opcional
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  template: `
    <table mat-table [dataSource]="data" class="mat-elevation-z8">

      <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
        <th mat-header-cell *matHeaderCellDef>{{ col.header }}</th>
        <td mat-cell *matCellDef="let element">
          {{ col.formatter ? col.formatter(element[col.key]) : element[col.key] }}
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Ações</th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button color="primary" (click)="edit.emit(element)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="delete.emit(element)">
            <mat-icon>delete</mat-icon>
          </button>

          <!-- Botões só para tela de veículos -->
          <ng-container *ngIf="showVehicleActions">
            <button mat-icon-button (click)="verDadosTecnicos.emit(element)">
              <mat-icon>build</mat-icon>
            </button>
            <button mat-icon-button (click)="verDocumentacao.emit(element)">
              <mat-icon>description</mat-icon>
            </button>
          </ng-container>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator
      [length]="totalElements"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex"
      [pageSizeOptions]="[5, 10, 20]"
      (page)="onPageChange($event)">
    </mat-paginator>
  `,
  styles: [`
    table {
      width: 100%;
    }
  `]
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() totalElements = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;

  @Input() showVehicleActions = false;
  @Output() verDadosTecnicos = new EventEmitter<any>();
  @Output() verDocumentacao = new EventEmitter<any>();

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  get displayedColumns() {
    return [...this.columns.map(c => c.key), 'actions'];
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}
