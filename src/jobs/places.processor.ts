import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Logger, OnModuleInit } from '@nestjs/common';
import { ExternalPlacesService } from 'src/external-places/external-places.service';

type SyncPlacesJobData = { q: string; city: string };

@Processor('places')
export class PlacesProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(PlacesProcessor.name);

  constructor(
    @InjectQueue('places')
    private placesQueue: Queue,
    private externalPlacesService: ExternalPlacesService,
  ) {
    super();
  }

  async process(job: Job<SyncPlacesJobData>) {
    const { q, city } = job.data;
    const result = await this.externalPlacesService.search(q, city);
    this.logger.log(
      `sync-places: found ${result.length} results for "${q}" in "${city}"`,
    );
    return result;
  }

  async onModuleInit() {
    await this.placesQueue.obliterate({ force: true });
    await this.placesQueue.add(
      'sync-places',
      { q: 'cafe', city: 'Porto Alegre' },
      {
        repeat: {
          every: 3600000,
        },
      },
    );
  }
}
