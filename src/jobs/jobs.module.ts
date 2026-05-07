import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { PlacesProcessor } from "./places.processor";
import { ExternalPlacesModule } from "src/external-places/external-places.module";

@Module({
    imports: [
        BullModule.registerQueue({ name: "places" }),
        ExternalPlacesModule
    ],
    providers: [PlacesProcessor]
})
export class JobsModule{}
