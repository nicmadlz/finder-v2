import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq"
import { OnModuleInit } from "@nestjs/common";
import { ExternalPlacesService } from "src/external-places/external-places.service";

@Processor("places")
export class PlacesProcessor extends WorkerHost implements OnModuleInit {

    constructor(
        @InjectQueue("places")
        private placesQueue: Queue,
        private externalPlacesService: ExternalPlacesService
    ) {
        super();
    }


    async process(job: Job) {
        const result = await this.externalPlacesService.search("cafe", "Porto Alegre");
        console.log(result);
    }

    async onModuleInit() {
        await this.placesQueue.add(
            'sync-places',
            {},
            {
                repeat: {
                    every: 10000,
                },
            }
        )
    }
}