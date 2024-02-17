import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigrations1708005348186 implements MigrationInterface {
    name = 'MyMigrations1708005348186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "replies" ("id" SERIAL NOT NULL, "content" character varying(160), "image" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "threadId" integer, "replayId" integer, "authorId" integer, CONSTRAINT "PK_08f619ebe431e27e9d206bea132" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "threadId" integer, "replyId" integer, "authorId" integer, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "user_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profile_picture" character varying, "image_cover" character varying, "bio" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "threads" ("id" SERIAL NOT NULL, "image" character varying NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updateAt" TIMESTAMP NOT NULL, "authorId" integer, CONSTRAINT "PK_d8a74804c34fc3900502cd27275" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "replies" ADD CONSTRAINT "FK_704ca745ae134000b58ece3dc58" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "replies" ADD CONSTRAINT "FK_a33f4247065bd9f2d78414dce61" FOREIGN KEY ("replayId") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "replies" ADD CONSTRAINT "FK_12378f154b9bee1645bdafaa62c" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_111596eb3f640a4c675ca0b6b9d" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_df467e4eedaf203bfea5adff195" FOREIGN KEY ("replyId") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_f583e7580ba3e4c66a713b8a8fa" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "threads" ADD CONSTRAINT "FK_7d2172aeb12db58bf620d14792d" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "threads" DROP CONSTRAINT "FK_7d2172aeb12db58bf620d14792d"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_f583e7580ba3e4c66a713b8a8fa"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_df467e4eedaf203bfea5adff195"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_111596eb3f640a4c675ca0b6b9d"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP CONSTRAINT "FK_12378f154b9bee1645bdafaa62c"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP CONSTRAINT "FK_a33f4247065bd9f2d78414dce61"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP CONSTRAINT "FK_704ca745ae134000b58ece3dc58"`);
        await queryRunner.query(`DROP TABLE "threads"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "replies"`);
    }

}
