import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("address")
export class AddressEntity{
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: "name", length: 100, nullable: false})
    street!: string;

    @Column({ name: "priceRange", length: 15, nullable: false})
    number!: number;

    @Column({name: "name", length: 100, nullable: false})
    neighborhood!: string;

    @Column({ name: "priceRange", length: 15, nullable: false})
    cep!: number;
}