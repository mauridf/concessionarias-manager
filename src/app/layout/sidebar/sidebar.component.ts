import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/usuarios" routerLinkActive="active">
        <mat-icon matListIcon>group</mat-icon>
        <span>Usuários</span>
      </a>
      <a mat-list-item routerLink="/veiculos" routerLinkActive="active">
        <mat-icon matListIcon>directions_car</mat-icon>
        <span>Veículos</span>
      </a>
      <a mat-list-item routerLink="/clientes" routerLinkActive="active">
        <mat-icon matListIcon>people</mat-icon>
        <span>Clientes</span>
      </a>
      <a mat-list-item routerLink="/vendedores" routerLinkActive="active">
        <mat-icon matListIcon>person</mat-icon>
        <span>Vendedores</span>
      </a>
      <a mat-list-item routerLink="/mecanicos" routerLinkActive="active">
        <mat-icon matListIcon>build</mat-icon>
        <span>Mecânicos</span>
      </a>
      <a mat-list-item routerLink="/autopecas" routerLinkActive="active">
        <mat-icon matListIcon>settings</mat-icon>
        <span>Autopeças</span>
      </a>
      <a mat-list-item routerLink="/equipamentos" routerLinkActive="active">
        <mat-icon matListIcon>tune</mat-icon>
        <span>Equipamentos/Opcionais</span>
      </a>
      <a mat-list-item routerLink="/revisoes" routerLinkActive="active">
        <mat-icon matListIcon>assignment</mat-icon>
        <span>Revisões</span>
      </a>
      <a mat-list-item routerLink="/vendas" routerLinkActive="active">
        <mat-icon matListIcon>shopping_cart</mat-icon>
        <span>Vendas</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    mat-nav-list {
      width: 240px;
      height: 100vh;
      position: fixed;
      top: 64px; /* altura do header */
      left: 0;
      background: #fafafa;
      border-right: 1px solid #ddd;
      padding-top: 12px;
    }
    a.active {
      background-color: #e0e0e0;
      font-weight: 600;
    }
    a.mat-list-item {
      font-size: 14px;
    }
  `]
})
export class SidebarComponent {}
