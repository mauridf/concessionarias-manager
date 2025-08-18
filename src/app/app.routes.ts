import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UsuariosListComponent } from './pages/usuarios/usuarios-list.component';
import { VeiculosListComponent } from './pages/veiculos/veiculos-list.component';
import { ClientesListComponent } from './pages/clientes/clientes-list.component';

import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosListComponent, canActivate: [AuthGuard] },
  { path: 'veiculos', component: VeiculosListComponent, canActivate: [AuthGuard] },
  { path: 'clientes', component: ClientesListComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];