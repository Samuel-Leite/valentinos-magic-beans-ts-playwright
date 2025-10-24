# Usa a imagem oficial do Playwright com navegadores
FROM mcr.microsoft.com/playwright:v1.55.0-jammy

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos essenciais
COPY ../../package.json ./
COPY ../../package-lock.json ./
COPY ../../playwright.config.ts ./
COPY ../../.env ./
COPY ../../tsconfig.json ./tsconfig.json

# Copia código-fonte e testes
COPY ../../src ./src
COPY ../../tests ./tests

# Copia pasta infra para manter os imports
COPY ../../infra ./infra

# Garante que o arquivo logger.ts esteja presente
# (opcional se já incluído via COPY ../../src)
COPY ../../src/utils/logger.ts ./src/utils/logger.ts

# Instala dependências
RUN npm install

# Expõe a porta de métricas
EXPOSE 9464

# Executa o script que inicia os testes e o servidor de métricas
CMD ["npx", "ts-node", "--project", "tsconfig.json", "infra/monitoring/startMetrics.ts"]