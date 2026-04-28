import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "places"})
export class PlaceEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: "name", length: 100, nullable: false})
    name!: string;

    @Column({ name: "category", length: 70, nullable: false})
    category!: string;

    @Column({ name: "priceRange", length: 15, nullable: false})
    priceRange!: number;

    @Column({ name: "rating", length: 3, nullable: false})
    rating!: number;
}
