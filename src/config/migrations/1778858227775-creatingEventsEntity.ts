import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatingEventsEntity1778858227775 implements MigrationInterface {
  name = 'CreatingEventsEntity1778858227775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "start_at" TIMESTAMP NOT NULL, "duration_minutes" integer NOT NULL, "max_capacity" integer NOT NULL, "placeId" integer, "createdById" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "need_to_change_password" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_359b48411878a60ae7df2d5f25e" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_2fb864f37ad210f4295a09b684d" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_2fb864f37ad210f4295a09b684d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_359b48411878a60ae7df2d5f25e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "need_to_change_password" SET DEFAULT true`,
    );
    await queryRunner.query(`DROP TABLE "events"`);
  }
}
