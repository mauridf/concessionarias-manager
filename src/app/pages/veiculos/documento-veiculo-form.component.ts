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
import { VeiculoService } from '../../core/services/veiculo.service';

@Component({
  selector: 'app-documentacao-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDialogModule, MatSnackBarModule, MatIconModule
  ],
  template: `
    <h2>Documentação do Veículo</h2>
    <form (ngSubmit)="onSave()" class="form-container">
      <!-- campos de Documentação -->
      <mat-form-field appearance="outline">
        <mat-label>Possui IPVA</mat-label>
        <mat-select [(ngModel)]="possuiIPVA" name="possuiIPVA" required>
          <mat-option [value]="true">Sim</mat-option>
          <mat-option [value]="false">Não</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Licenciamento OK</mat-label>
        <mat-select [(ngModel)]="licenciamentoOK" name="licenciamentoOK" required>
          <mat-option [value]="true">Sim</mat-option>
          <mat-option [value]="false">Não</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Multas Pendentes?</mat-label>
        <mat-select [(ngModel)]="multasPendentes" name="multasPendentes" required>
          <mat-option [value]="true">Sim</mat-option>
          <mat-option [value]="false">Não</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Valor das Multas</mat-label>
        <input matInput type="number" [(ngModel)]="valorMultas" name="valorMultas" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Origem</mat-label>
        <mat-select [(ngModel)]="origem" name="origem" required>
          <mat-option value="FORNECEDOR">Fornecedor</mat-option>
          <mat-option value="REPASSE">Repasse</mat-option>
          <mat-option value="TROCA">Troca</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="actions">
        <button mat-flat-button color="primary" type="submit">Salvar</button>
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 16px; width: 300px; margin: auto; }
    .actions { display: flex; justify-content: space-between; margin-top: 10px; }
    .row { display: flex; gap: 16px; }
    .half { flex: 1; }
  `]
})
export class DocumentacaoFormComponent implements OnInit {
  veiculoId: string = '';
  idExistente: boolean = false;
  possuiIPVA = true;
  licenciamentoOK = true;
  multasPendentes = false;
  valorMultas = 0;
  origem: 'FORNECEDOR' | 'REPASSE' | 'TROCA' = 'FORNECEDOR';

  constructor(
    public dialogRef: MatDialogRef<DocumentacaoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { veiculoId: string },
    private veiculoService: VeiculoService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.veiculoId = this.data.veiculoId;
    this.veiculoService.getDocumentacaoByVeiculo(this.veiculoId)
    .subscribe(res => {
      if (res) Object.assign(this, res); // carrega os campos para edição
      this.idExistente = true;
    }, err => {
      this.idExistente = false;
    });
  }

  onSave() {
        if (!this.veiculoId) return;

        const dados = {
        veiculoId: this.veiculoId,
        possuiIPVA: this.possuiIPVA,
        licenciamentoOK: this.licenciamentoOK,
        multasPendentes: this.multasPendentes,
        valorMultas: this.valorMultas,
        origem: this.origem
        };
        if (this.idExistente){
            this.veiculoService.updateDocumentacao(this.veiculoId,dados).subscribe(() => {
                this.snack.open('Documentos do veículo atualizados com sucesso!', 'Fechar', { duration: 3000 });
                this.dialogRef.close(true);
            });
        }
        else{
            this.veiculoService.createDocumentacao(dados).subscribe(() => {
                this.snack.open('Documentos do veículo registrados com sucesso!', 'Fechar', { duration: 3000 });
                this.dialogRef.close(true);
            });
        }
    }
}
