import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
  <mat-card class="login-card">
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <h2>Entrar</h2>

      <mat-form-field appearance="outline" class="full">
        <mat-label>E-mail</mat-label>
        <input matInput formControlName="email" placeholder="seu@exemplo.com" type="email" required>
        <mat-error *ngIf="form.get('email')?.invalid && form.get('email')?.touched">E-mail inválido</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full">
        <mat-label>Senha</mat-label>
        <input matInput formControlName="senha" [type]="hide ? 'password' : 'text'">
        <button mat-icon-button matSuffix type="button" (click)="hide = !hide">
          <mat-icon>{{ hide ? 'visibility' : 'visibility_off' }}</mat-icon>
        </button>
        <mat-error *ngIf="form.get('senha')?.invalid && form.get('senha')?.touched">Senha obrigatória</mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" class="full" [disabled]="form.invalid || loading">
        <span *ngIf="!loading">Entrar</span>
        <mat-progress-spinner *ngIf="loading" diameter="20" mode="indeterminate"></mat-progress-spinner>
      </button>
    </form>
  </mat-card>
  `,
  styles: [`
    .login-wrapper {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f5f5;
    }
    .login-card { width: 420px; padding: 24px; }
    .full { width: 100%; display:block; margin-bottom: 12px; }
    button.full { display:flex; justify-content:center; align-items:center; height:48px; }
    h2 { margin-bottom: 16px; text-align:center; }
  `]
})
export class LoginComponent {
  form: any;
  hide = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    const email = this.form.value.email ?? '';
    const senha = this.form.value.senha ?? '';

    this.auth.login(email, senha).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message ?? 'Falha no login — verifique credenciais';
        this.snack.open(msg, 'Fechar', { duration: 4000 });
      }
    });
  }
}
