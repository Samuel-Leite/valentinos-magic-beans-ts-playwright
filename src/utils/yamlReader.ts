import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Logger } from './logger';
import dotenv from 'dotenv';
dotenv.config();

export class YamlReader {

    /**
     * Lê a URL de um ambiente específico a partir de um arquivo YAML
     * @param environment Nome do ambiente (ex: 'qa', 'prod')
     * @returns URL como string
     */
    static readUrl(environment: string): string {
        const filePath = path.resolve(__dirname, `../resources/config/url-${environment}.yml`);

        try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const parsed = yaml.load(fileContents) as { url: string };
            Logger.info(`A URL do ambiente '${environment}' foi acessada com sucesso do arquivo YAML`);
            return parsed.url;
        } catch (error: any) {
            Logger.error(`Erro ao obter a URL do ambiente '${environment}': ${error.message}`);
            throw error;
        }
    }

    /**
     * Lê um atributo específico de um arquivo YAML de dados
     * @param attribute Caminho do atributo (ex: 'admin.email')
     * @returns Valor do atributo como string
     */
    static readYamlFile(attribute: string): string {
        const env = process.env.ENV || 'qa';
        const filePath = path.resolve(__dirname, `../resources/data/${env}/credencial.yml`);

        try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(fileContents) as Record<string, any>;
            Logger.info(`As credenciais do usuário do ambiente '${env}' foram obtidas com sucesso`);

            // Suporte a atributos aninhados (ex: 'admin.email')
            const value = attribute.split('.').reduce((obj, key) => obj?.[key], data);
            if (value === undefined) {
                throw new Error(`Atributo '${attribute}' não encontrado no arquivo YAML`);
            }

            return String(value);
        } catch (error: any) {
            Logger.error(`Erro ao obter o atributo '${attribute}' do YAML: ${error.message}`);
            throw error;
        }
    }
}