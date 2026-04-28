import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("address")
export class AddressEntity{
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: "name", length: 100, nullable: false})
    street!: string;

    @Column({ name: "number", nullable: false})
    number!: number;

    @Column({name: "neighborhood", length: 100, nullable: false})
    neighborhood!: string;

    @Column({ name: "priceRange", nullable: false})
    cep!: number;
}