import { events } from './contract/GhostBounties'
import { evmPortalSource, evmDecoder } from '@subsquid/pipes/evm'
import { drizzleTarget, chunk } from '@subsquid/pipes/targets/drizzle/node-postgres'

function main() {
    evmPortalSource({
        portal: 'https://portal.sqd.dev/datasets/polygon-amoy-testnet'
    })
        .pipe(evmDecoder({
            range: { from: 'latest' },
            contracts: [''],
            events: {
                bountyCompleted: events.BountyCompleted,
                bountyCreated: events.BountyCreated,
                bountyCancelled: events.BountyCancelled,
            }
        }))
        .pipe(({ bountyCompleted }) => {
            return bountyCompleted.map(b => b.event)
        })
        .pipeTo(drizzleTarget({
            db: //...
            tables: [],
            onData: async ({ tx, data, ctx }) => {
                for (const row of chunk(data)) {
                    await tx.insert(/** table name */).values(row)
                }
            }
        }))
}