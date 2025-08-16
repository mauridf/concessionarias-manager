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
  selector: 'app-dados-tecnicos-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatDialogModule, MatSnackBarModule, MatIconModule
  ],
  template: `
    <h2>Dados Técnicos do Veículo</h2>

    <form (ngSubmit)="onSave()" class="form-container">
      <mat-form-field appearance="outline">
        <mat-label>Renavam</mat-label>
        <input matInput [(ngModel)]="renavam" name="renavam" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Chassi</mat-label>
        <input matInput [(ngModel)]="chassi" name="chassi" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Placa</mat-label>
        <input matInput [(ngModel)]="placa" name="placa" required>
      </mat-form-field>

      <div class="row">
        <mat-form-field appearance="outline" class="half">
          <mat-label>Quilometragem</mat-label>
          <input matInput type="number" [(ngModel)]="quilometragem" name="quilometragem" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half">
          <mat-label>Portas</mat-label>
          <input matInput type="number" [(ngModel)]="portas" name="portas" required>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>Potência do Motor</mat-label>
        <input matInput [(ngModel)]="potenciaMotor" name="potenciaMotor" required>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Motor</mat-label>
        <input matInput [(ngModel)]="motor" name="motor" required>
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
export class DadosTecnicosFormComponent implements OnInit {
  veiculoId: string = '';
  idExistente: boolean = false;

  renavam = '';
  chassi = '';
  placa = '';
  quilometragem = 0;
  portas = 0;
  potenciaMotor = '';
  motor = '';

  constructor(
    public dialogRef: MatDialogRef<DadosTecnicosFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { veiculoId: string },
    private veiculoService: VeiculoService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.veiculoId = this.data.veiculoId;
    this.veiculoService.getDadosTecnicosByVeiculo(this.veiculoId)
    .subscribe(res => {
      if (res) Object.assign(this, res); // carrega os campos para edição
      this.idExistente = true;
    }, err => {
      this.idExistente = false;
    });
  }

  onSave() {
    if (!this.veiculoId) return;

    const dadosTecnicos = {
      veiculoId: this.veiculoId,
      renavam: this.renavam,
      chassi: this.chassi,
      placa: this.placa,
      quilometragem: this.quilometragem,
      portas: this.portas,
      potenciaMotor: this.potenciaMotor,
      motor: this.motor
    };
        if (this.idExistente){
            this.veiculoService.updateDadosTecnicos(this.veiculoId,dadosTecnicos).subscribe(() => {
                this.snack.open('Documentos do veículo atualizados com sucesso!', 'Fechar', { duration: 3000 });
                this.dialogRef.close(true);
            });
        }
        else{
            this.veiculoService.createDadosTecnicos(dadosTecnicos).subscribe(() => {
                this.snack.open('Documentos do veículo registrados com sucesso!', 'Fechar', { duration: 3000 });
                this.dialogRef.close(true);
            });
        }
  }
}
