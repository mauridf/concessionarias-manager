# ConcessionariaManager Frontend

Este é o frontend do sistema **ConcessionariaManager**, desenvolvido em **Angular** no modo standalone,
utilizando **Angular Material** para estilização.

## 🚀 Tecnologias Utilizadas

- [Angular 17+](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- TypeScript
- HTML5 / CSS3

## 📦 Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/concessionariamanager-frontend.git
   ```

2. Entre na pasta do projeto:
   ```bash
   cd concessionariamanager-frontend
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## ▶️ Executando o Projeto

Para rodar o projeto em modo desenvolvimento:
```bash
ng serve
```

O aplicativo estará disponível em: [http://localhost:4200](http://localhost:4200)

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação e controle de acesso por **Roles**:
- Gerente
- Vendedor
- Mecânico

## 📂 Estrutura de Pastas

```
src/
 ├── app/
 │   ├── core/            # Serviços, guards e interceptors
 │   ├── pages/           # Páginas do sistema
 │   ├── shared/          # Componentes compartilhados
 │   ├── app.routes.ts    # Definição das rotas
 │   └── app.ts           # Componente raiz
 ├── assets/              # Arquivos estáticos
 └── styles.css           # Estilos globais
```

## 🌐 Integração com Backend

O frontend consome a API **ConcessionariaManager**, que por padrão roda em:
```
http://localhost:8080
```

As configurações de URLs podem ser alteradas no arquivo `environment.ts`.

## 🛠️ Build

Para gerar a versão de produção:
```bash
ng build --configuration production
```

Os arquivos gerados ficarão na pasta `dist/`.

## 📜 Licença

Este projeto está sob a licença MIT.
