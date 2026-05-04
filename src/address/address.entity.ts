import { PlaceEntity } from "../place/place.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("address")
export class AddressEntity{
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: "street", length: 100, nullable: false})
    street!: string;

    @Column({ name: "number", nullable: false})
    number!: number;

    @Column({name: "neighborhood", length: 100, nullable: false})
    neighborhood!: string;

    @Column({ name: "Cep", nullable: false})
    cep!: number;
    
    @OneToOne(() => PlaceEntity, (place) => place.address)
    place!: PlaceEntity
}