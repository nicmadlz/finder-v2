import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewChangePasswordColumn1778784440275 implements MigrationInterface {
  name = 'NewChangePasswordColumn1778784440275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "need_to_change_password" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "need_to_change_password"`,
    );
  }
}
