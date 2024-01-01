## instalar pacotes

```bash
$ npm install
```

## Criar banco com Compose

```bash
$ docker-compose up -d
```

## Derrubar o banco com Compose

```bash
docker-compose down -v
```

## Rodar back

```bash
# development
$ npm run start
```

## Rodar Testes

```bash
# unit tests
$ npm run test
```

## Bibliotecas Utilizadas:

1. **class-transformer (^0.5.1):**

   - **Objetivo:** Transformar objetos JavaScript em classes e vice-versa.
   - **Uso:** Facilita a conversão entre estruturas de objetos.

2. **class-validator (^0.14.0):**

   - **Objetivo:** Validar objetos com decoradores.
   - **Uso:** Define regras de validação usando decoradores nas propriedades da classe.

3. **pg (^8.11.3):**

   - **Objetivo:** Cliente PostgreSQL para Node.js.
   - **Uso:** Executar SQL, gerenciar transações e interagir com bancos PostgreSQL.

4. **typeorm (^0.3.17):**
   - **Objetivo:** ORM para TypeScript e JavaScript.
   - **Uso:** Simplificar interações com bancos, permitindo trabalhar com classes e objetos em vez de SQL direto. Usa decoradores para definir entidades e relacionamentos.
