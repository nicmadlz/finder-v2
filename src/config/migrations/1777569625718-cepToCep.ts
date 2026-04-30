import { MigrationInterface, QueryRunner } from "typeorm";

export class CepToCep1777569625718 implements MigrationInterface {
    name = 'CepToCep1777569625718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "cep" TO "Cep"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "Cep" TO "cep"`);
    }

}
