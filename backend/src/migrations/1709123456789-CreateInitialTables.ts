import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1709123456789 implements MigrationInterface {
  name = 'CreateInitialTables1709123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "public"."order_status_enum" AS ENUM (
        'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."payment_method_enum" AS ENUM (
        'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_PAYMENT', 'LOYALTY_POINTS'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."payment_status_enum" AS ENUM (
        'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."discount_type_enum" AS ENUM (
        'PERCENTAGE', 'FIXED', 'LOYALTY_POINTS'
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'EMPLOYEE',
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // Create customers table
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying,
        "address" text,
        "loyaltyPoints" decimal(10,2) NOT NULL DEFAULT 0,
        "loyaltyTier" text NOT NULL DEFAULT 'BRONZE',
        "preferences" jsonb,
        "totalSpent" decimal(10,2) NOT NULL DEFAULT 0,
        "visitCount" integer NOT NULL DEFAULT 0,
        "lastVisitDate" date,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"),
        CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")
      )
    `);

    // Create products table
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "stockQuantity" integer NOT NULL,
        "lowStockThreshold" integer NOT NULL DEFAULT 10,
        "sku" text,
        "barcode" character varying,
        "category" text,
        "tags" text[],
        "imageUrl" text,
        "createdById" uuid NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
      )
    `);

    // Create orders table
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "total" decimal(10,2) NOT NULL,
        "discount" decimal(10,2) NOT NULL DEFAULT 0,
        "discountType" "public"."discount_type_enum",
        "loyaltyPointsEarned" integer NOT NULL DEFAULT 0,
        "loyaltyPointsRedeemed" integer NOT NULL DEFAULT 0,
        "status" "public"."order_status_enum" NOT NULL DEFAULT 'PENDING',
        "customerId" uuid NOT NULL,
        "cashierId" uuid,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
      )
    `);

    // Create order_items table
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "quantity" integer NOT NULL,
        "unitPrice" decimal(10,2) NOT NULL,
        "subtotal" decimal(10,2) NOT NULL,
        "orderId" uuid NOT NULL,
        "productId" uuid NOT NULL,
        CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id")
      )
    `);

    // Create payments table
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "amount" decimal(10,2) NOT NULL,
        "paymentMethod" "public"."payment_method_enum" NOT NULL,
        "transactionId" character varying,
        "status" "public"."payment_status_enum" NOT NULL DEFAULT 'PENDING',
        "orderId" uuid NOT NULL,
        "paymentDetails" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"
      FOREIGN KEY ("customerId")
      REFERENCES "customers"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD CONSTRAINT "FK_abcd1234567890"
      FOREIGN KEY ("cashierId")
      REFERENCES "users"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "order_items"
      ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"
      FOREIGN KEY ("orderId")
      REFERENCES "orders"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "order_items"
      ADD CONSTRAINT "FK_ceda039b08a1f7064e8df86d38e"
      FOREIGN KEY ("productId")
      REFERENCES "products"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "payments"
      ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705f6f6cc7"
      FOREIGN KEY ("orderId")
      REFERENCES "orders"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Add foreign key for products.createdById
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD CONSTRAINT "FK_products_created_by"
      FOREIGN KEY ("createdById")
      REFERENCES "users"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705f6f6cc7"`);
    await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_ceda039b08a1f7064e8df86d38e"`);
    await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_abcd1234567890"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_created_by"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."discount_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payment_method_enum"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
  }
}