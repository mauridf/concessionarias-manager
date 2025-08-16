import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Veiculo, VeiculoService } from '../../core/services/veiculo.service';
import { DocumentacaoFormComponent } from './documento-veiculo-form.component';
import { DadosTecnicosFormComponent } from './dados-tecnicos-veiculo-form.component';

@Component({
  selector: 'app-veiculo-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDialogModule, MatSnackBarModule, MatIconModule
  ],
  template: `
    <h2>{{ data.veiculo ? 'EDITAR' : 'REGISTRAR' }} VEÍCULO</h2>

    <form (ngSubmit)="onSave()" class="form-container">
      <mat-form-field appearance="outline">
        <mat-label>Marca</mat-label>
        <input matInput [(ngModel)]="veiculo.marca" name="marca" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Modelo</mat-label>
        <input matInput [(ngModel)]="veiculo.modelo" name="modelo" required>
      </mat-form-field>

      <div class="row">
        <mat-form-field appearance="outline" class="half">
            <mat-label>Versão</mat-label>
            <input matInput type="number" [(ngModel)]="veiculo.versao" name="versao" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half">
            <mat-label>Ano Fabricação</mat-label>
            <input matInput type="number" [(ngModel)]="veiculo.anoFabricacao" name="anoFabricacao" required>
        </mat-form-field>
      </div>

      <div class="row">
        <mat-form-field appearance="outline" class="half">
            <mat-label>Ano Modelo</mat-label>
            <input matInput type="number" [(ngModel)]="veiculo.anoModelo" name="anoModelo" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half">
            <mat-label>Preço</mat-label>
            <input matInput type="number" [(ngModel)]="veiculo.preco" name="preco" required>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>Categoria</mat-label>
        <mat-select [(ngModel)]="veiculo.categoria" name="categoria" required>
          <mat-option value="HATCH">Hatch</mat-option>
          <mat-option value="SEDAN">Sedan</mat-option>
          <mat-option value="SUV">SUV</mat-option>
          <mat-option value="UTILITARIO">Utilitário</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Tipo Veículo</mat-label>
        <mat-select [(ngModel)]="veiculo.tipoVeiculo" name="tipoVeiculo" required>
          <mat-option value="NOVO">Novo</mat-option>
          <mat-option value="SEMI_NOVO">Semi-novo</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Combustível</mat-label>
        <mat-select [(ngModel)]="veiculo.combustivel" name="combustivel" required>
          <mat-option value="ALCOOL">Álcool</mat-option>
          <mat-option value="DIESEL">Diesel</mat-option>
          <mat-option value="FLEX">Flex</mat-option>
          <mat-option value="GASOLINA">Gasolina</mat-option>
          <mat-option value="HIBRIDO">Híbrido</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Câmbio</mat-label>
        <mat-select [(ngModel)]="veiculo.cambio" name="cambio" required>
          <mat-option value="AUTOMATICO">Automático</mat-option>
          <mat-option value="MANUAL">Manual</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Cor</mat-label>
        <input matInput [(ngModel)]="veiculo.cor" name="cor" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="veiculo.statusVeiculo" name="statusVeiculo" required>
          <mat-option value="DISPONIVEL">Disponível</mat-option>
          <mat-option value="EM_MANUTENCAO">Em Manutenção</mat-option>
          <mat-option value="VENDIDO">Vendido</mat-option>
        </mat-select>
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
    .row { display: flex; gap: 16px; }
    .half { flex: 1; }
  `]
})
export class VeiculoFormComponent implements OnInit {
  veiculo: Partial<Veiculo> = {
    marca: '', modelo: '', versao: 1,
    anoFabricacao: new Date().getFullYear(),
    anoModelo: new Date().getFullYear(),
    categoria: 'HATCH',
    tipoVeiculo: 'NOVO',
    combustivel: 'GASOLINA',
    cambio: 'MANUAL',
    cor: '',
    preco: 0,
    statusVeiculo: 'DISPONIVEL'
  };

  constructor(
    public dialogRef: MatDialogRef<VeiculoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { veiculo?: Veiculo } = {},
    private veiculoService: VeiculoService,
    private snack: MatSnackBar,
    private dialog: MatDialog   // <- adicionado
  ) {}

  ngOnInit() {
    if (this.data?.veiculo) {
        setTimeout(() => {
        this.veiculo = { ...this.data.veiculo };
        });
    }
    }

  onSave() {
    if (this.data?.veiculo?.id) {
        this.veiculoService.updateVeiculo(this.data.veiculo.id, this.veiculo).subscribe(() => {
        this.snack.open('Veículo atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
        });
    } else {
        this.veiculoService.createVeiculo(this.veiculo).subscribe(() => {
        this.snack.open('Veículo registrado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
        });
    }
    }
}