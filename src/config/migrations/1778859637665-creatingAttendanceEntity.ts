import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatingAttendanceEntity1778859637665 implements MigrationInterface {
  name = 'CreatingAttendanceEntity1778859637665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."attendance_role_enum" AS ENUM('creator', 'attendee')`,
    );
    await queryRunner.query(
      `CREATE TABLE "attendance" ("id" SERIAL NOT NULL, "role" "public"."attendance_role_enum" NOT NULL, "userId" uuid, "eventId" integer, CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" ADD CONSTRAINT "FK_466e85b813d871bfb693f443528" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" ADD CONSTRAINT "FK_f89c5a18dbf866ba8b1e4a9b8e9" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attendance" DROP CONSTRAINT "FK_f89c5a18dbf866ba8b1e4a9b8e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" DROP CONSTRAINT "FK_466e85b813d871bfb693f443528"`,
    );
    await queryRunner.query(`DROP TABLE "attendance"`);
    await queryRunner.query(`DROP TYPE "public"."attendance_role_enum"`);
  }
}
