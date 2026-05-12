import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1778002271805 implements MigrationInterface {
  name = 'CreateTables1778002271805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address" ("id" SERIAL NOT NULL, "street" character varying(100) NOT NULL, "number" integer NOT NULL, "neighborhood" character varying(100) NOT NULL, "Cep" integer NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "places" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "category" character varying(70) NOT NULL, "priceRange" integer NOT NULL, "rating" integer NOT NULL, "addressId" integer, CONSTRAINT "REL_5785ca1ddcb23b7351f9032a93" UNIQUE ("addressId"), CONSTRAINT "PK_1afab86e226b4c3bc9a74465c12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "places" ADD CONSTRAINT "FK_5785ca1ddcb23b7351f9032a938" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "places" DROP CONSTRAINT "FK_5785ca1ddcb23b7351f9032a938"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "places"`);
    await queryRunner.query(`DROP TABLE "address"`);
  }
}
