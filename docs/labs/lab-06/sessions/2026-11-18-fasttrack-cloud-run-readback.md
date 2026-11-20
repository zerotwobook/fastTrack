# Authenticated fastTrack Cloud Run readback, 18 November 2026

R2-A04 / Issue #22. Authenticated read-only observation completed at **18 November 2026, 15:19:49 UTC+07:00**, after the user signed into the Google Cloud CLI.

| Field | Current observed value |
| --- | --- |
| Project / region | fasttrack-se-002 / asia-southeast1 |
| Service | fasttrack-app |
| Canonical URL | https://fasttrack-app-kpx7au3w2a-as.a.run.app |
| Latest created and ready revision | fasttrack-app-00003-rc7 |
| Traffic | One assignment, 100% to fasttrack-app-00003-rc7, latestRevision true |
| Conditions | Ready, ConfigurationsReady and RoutesReady all True |
| Generation / observed generation | 5 / 5 |
| Application source | 8e637e537cd037d630a5fffc1b5672d1b44371a8 |
| Image digest | sha256:d7606d79c068f7e86796e33f2f0872a02954f1c7a7d5b2d2253a43a1a334cb99 |
| Public health/readiness | HTTP 200, matching source, database connected |

The service describe and revision describe commands succeeded and provide the observed traffic assignment and immutable image. The digest matches the [12 November release artifact](../../lab-05/evidence/C06-release-traceability.md). [Filtered command outputs with actual start/end times](../evidence/coursepms-fasttrack-returned-20261118/cloud-run-current.json).

The returned UAT session spans 14:37:42.827-14:50:33.231 UTC+07:00 on 18 November. This later service readback has its own timestamp. Continuous traffic history across the earlier test session was not queried. Prior unauthenticated lookup failures remain dated history in the earlier preflight record.
