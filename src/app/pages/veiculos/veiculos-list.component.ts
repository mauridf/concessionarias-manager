import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { VeiculoService, Veiculo } from '../../core/services/veiculo.service';
// import { VeiculoFormComponent } from './veiculos-form.component';

@Component({
  selector: 'app-veiculos-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatSelectModule, MatButtonModule,
    MatSnackBarModule, DataTableComponent
  ],
  template: `
    <h1>VEÍCULOS CADASTRADOS</h1>
    
    <div class="actions-container">
      <button mat-flat-button color="primary" (click)="novoVeiculo()">NOVO</button>
    </div>

    <div class="filters-container">
      <mat-form-field appearance="outline">
        <mat-label>Marca</mat-label>
        <mat-select [(ngModel)]="filtros.marca" (selectionChange)="loadVeiculos()">
          <mat-option value="">Todas</mat-option>
          <mat-option *ngFor="let marca of marcas" [value]="marca">{{ marca }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Modelo</mat-label>
        <mat-select [(ngModel)]="filtros.modelo" (selectionChange)="loadVeiculos()">
          <mat-option value="">Todos</mat-option>
          <mat-option *ngFor="let modelo of modelos" [value]="modelo">{{ modelo }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Tipo</mat-label>
        <mat-select [(ngModel)]="filtros.tipoVeiculo" (selectionChange)="loadVeiculos()">
          <mat-option value="">Todos</mat-option>
          <mat-option *ngFor="let tipo of tiposVeiculo" [value]="tipo">{{ tipo }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Categoria</mat-label>
        <mat-select [(ngModel)]="filtros.categoria" (selectionChange)="loadVeiculos()">
          <mat-option value="">Todas</mat-option>
          <mat-option *ngFor="let cat of categorias" [value]="cat">{{ cat }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Combustível</mat-label>
        <mat-select [(ngModel)]="filtros.combustivel" (selectionChange)="loadVeiculos()">
          <mat-option value="">Todos</mat-option>
          <mat-option *ngFor="let comb of combustiveis" [value]="comb">{{ comb }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Câmbio</mat-label>
        <mat-select [(ngModel)]="filtros.cambio" (selectionChange)="loadVeiculos()">
          <mat-option value="">Todos</mat-option>
          <mat-option *ngFor="let cam of cambios" [value]="cam">{{ cam }}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <app-data-table
    [columns]="columns"
    [data]="veiculos"
    [totalElements]="totalElements"
    [pageSize]="pageSize"
    [pageIndex]="pageIndex"
    [showVehicleActions]="true"
    (pageChange)="onPageChange($event)"
    (edit)="editVeiculo($event)"
    (delete)="confirmDelete($event)"
    (verDadosTecnicos)="verDadosTecnicos($event)"
    (verDocumentacao)="verDocumentacao($event)">
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
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
    }

    mat-form-field {
      width: 200px;
    }
  `]
})
export class VeiculosListComponent implements OnInit {
  veiculos: Veiculo[] = [];
  columns = [
    { key: 'marca', header: 'Marca' },
    { key: 'modelo', header: 'Modelo' },
    { key: 'anoFabricacao', header: 'Ano Fabricação' },
    { key: 'anoModelo', header: 'Ano Modelo' },
    { key: 'categoria', header: 'Categoria' },
    { key: 'tipoVeiculo', header: 'Tipo' },
    { key: 'combustivel', header: 'Combustível' },
    { key: 'cambio', header: 'Câmbio' },
    { 
      key: 'preco', 
      header: 'Preço', 
      formatter: (value: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    },
    { key: 'statusVeiculo', header: 'Status' }
  ];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filtros: any = {
    marca: '',
    modelo: '',
    tipoVeiculo: '',
    categoria: '',
    combustivel: '',
    cambio: ''
  };

  marcas: string[] = [];
  modelos: string[] = [];
  tiposVeiculo: string[] = [];
  categorias: string[] = [];
  combustiveis: string[] = [];
  cambios: string[] = [];

  constructor(
    private veiculoService: VeiculoService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadVeiculos();
    this.loadFiltros();
  }

  loadVeiculos() {
    this.veiculoService.getVeiculos(this.pageIndex, this.pageSize, 'marca,asc', this.filtros)
      .subscribe(page => {
        this.veiculos = page.content;
        this.totalElements = page.totalElements;
      });
  }

  loadFiltros() {
    this.veiculoService.getMarcas().subscribe(marcas => this.marcas = marcas);
    this.veiculoService.getModelos().subscribe(modelos => this.modelos = modelos);

    this.tiposVeiculo = ['SUV', 'Sedan', 'Hatch'];
    this.categorias = ['Luxo', 'Popular', 'Utilitário'];
    this.combustiveis = ['Gasolina', 'Álcool', 'Diesel', 'Elétrico'];
    this.cambios = ['Manual', 'Automático'];
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadVeiculos();
  }

  novoVeiculo() {
    // abrir modal futura
  }

  editVeiculo(veiculo: Veiculo) {
    // abrir modal futura
  }

  verDadosTecnicos(veiculo: Veiculo) {
    // abrir modal futura
  }

  verDocumentacao(veiculo: Veiculo) {
    // abrir modal futura
  }

  confirmDelete(veiculo: Veiculo) {
    if (confirm(`Deseja excluir o veículo ${veiculo.marca} ${veiculo.modelo}?`)) {
      this.veiculoService.deleteVeiculo(veiculo.id).subscribe(() => {
        this.snack.open('Veículo excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.loadVeiculos();
      });
    }
  }
}
