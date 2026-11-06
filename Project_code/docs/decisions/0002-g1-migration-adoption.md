# G1 migration correction and adoption

Date: 6 November 2026. Scope: the G1 foundation candidate in [PR #50](https://github.com/zerotwobook/fastTrack/pull/50), targeting `staging/sprint-1`. Implementation owner A by user authorization; B is the peer reviewer. Acceptance remains pending.

## Accepted history and pending proposal

The two migrations accepted in B00 / PR #48 remain byte-identical:

- `20261106094006_init_sprint1_schema`
- `20261106094101_add_version_check_constraint`

The third migration, `20261106195734_g1_schema_corrections`, was proposed by B in unmerged PR #53 at `633a9fe348edb2976aa96a53d3d520f87e481813`. Independent review reproduced partial schema changes after failure, including loss of foreign keys, and incompatible text bounds. The user authorized A to correct this unaccepted proposal before integration. Its exact old SQL is retained at [the historical test fixture](../../server/src/testing/migrations/g1-candidate-633a9fe.sql).

The amended third migration preflights native UUID conversion and canonical required text, performs the schema changes and installs constraints within one SQL `DO` statement. The new fourth migration, `20261106212301_g1_canonical_bounds_alignment`, applies the canonical alignment to databases that already executed B's original candidate. Both reject invalid data without truncating it. Identity and hash fields keep the accepted TEXT types.

PostgreSQL documents that each statement executes inside a transaction and that `DO` executes an anonymous block. We therefore use a single statement for atomicity, and independently verify that inference through failed UUID, text and author-FK migrations. The final probes retain the complete pre-migration schema and records and expose the intended SQLSTATE. Sources: [PostgreSQL transactions](https://www.postgresql.org/docs/16/tutorial-transactions.html), [PostgreSQL DO](https://www.postgresql.org/docs/16/sql-do.html).

## What the tests establish

`npm run test:g1:isolated` provisions new disposable databases and runs the accepted two-migration history, or that history plus the exact original third proposal, before deploying this branch's pending migrations. All seven scenarios pass at `6f3601ec1af3f0b7039bce175251642d1920c40c`.

- Valid upgrades preserve rows across all seven domain tables, including IDs, hashes, timestamps, versions and associations, and produce the same schema as a fresh install.
- Rejected upgrades preserve those rows and the full pre-existing columns, constraints and indexes, including all nine original foreign keys.
- The original-candidate database keeps its recorded completed migration checksums and is aligned by the fourth migration. No checksum/ledger UPDATE is performed.
- Failed attempts leave a failed Prisma migration record. The completed-history prefix is preserved; the entire ledger is not asserted unchanged.

See [the verification record](../evidence/R1-G1-A-foundation.md) for exact cases/results.

## Existing developer databases require explicit adoption review

The third migration was edited before acceptance, so a developer who already applied the original unmerged proposal may have a different recorded checksum. The candidate-applied probe verifies `migrate deploy` behavior and data preservation. It does **not** prove that `migrate dev` accepts edited history without a conflict. Prisma distinguishes deployment of pending migrations from development drift/history checks; see [development and production](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production) and [migration histories](https://www.prisma.io/docs/orm/v7/prisma-migrate/understanding-prisma-migrate/migration-histories).

For peer review, use the disposable runner first. Before touching an existing database, identify which migration files/checksums were applied, preserve its data and agree on adoption with the teammate. Do not automatically reset a database, rewrite `_prisma_migrations`, invent a reconciliation success or accept a destructive prompt. A failed preflight requires a deliberate correction of the offending legacy data and a reviewed Prisma recovery procedure before retrying; this work did not execute such recovery against any persistent database.

This decision records a review limitation, not completed adoption on either developer's existing database. B must consider it before accepting PR #50 and the joint G1 gate.
