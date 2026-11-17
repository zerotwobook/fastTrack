# Draft reply to CoursePMS: targeted deployed retest results

Prepared for the user to send privately. NOT SENT by the assistant. This is evidence reporting, not a human acceptance signature or a booked appointment.

Hi CoursePMS team,

After our user updated the private access file, A/B/Instructor sign-in succeeded. We completed a bounded AI-operated retest on deployed source aeb804ea5bc667399b00cf54df10046a6ded46e0 on 17 November, 19:11-19:15 Asia/Bangkok. Source matched at the start and end; dated workflow CLI confirms course-pms-00009-mk2 at 100% traffic and the supplied immutable digest. Earlier rejected preflights are preserved as historical access attempts, superseded by the updated account access.

The original L6-OUT-EXP-001 reproduction now passes: A's four-field saved draft -> logout -> B without refresh in the same document gives the correct B identity/team and four empty fields, with no prior private field text. Reverse B -> A restores exactly A's original fields; subsequent reload preserves them and canonical saved data is unchanged.

Observed additional checks passed: A and Instructor temporary-token revocation (401 TOKEN_REVOKED), B foreign private GET denial (403, no proposal), authenticated bare namespace JSON 404/API_ROUTE_NOT_FOUND, student foreign-proposal null/PRIVATE with authorized own data retained, and instructor authorized directory/filter behavior. Team 5 remains three members with Proposal 3 APPROVED revision 2. No business writes, save/submit/review, new membership or reset/seed/delete occurred. All temporary sessions were signed out and the browser closed.

The report maps RT cases as 5 PASS, 3 PARTIAL and 1 EVIDENCE REVIEW ONLY. No-team/unassigned Student subchecks remain BLOCKED because only the three existing A/B/Instructor accounts were supplied. Student-review write denial was not attempted because no safe target was agreed. RT-07 reviews supplied race/regression evidence; it is not a new deployed race test. Seven anonymous checks and eight authenticated records have separate denominators. We do not claim exhaustive coverage or count partial cases as complete passes.

Please review these remaining subchecks with the actual human testers and supply a safe eligible fixture/procedure if they require execution. No new fixture or account mutation is requested without agreement. Both teams still need actual student contribution records and exact-version human decisions. The original bug's successful AI retest does not supply a human signature or final acceptance by itself.

We will share the four screenshots and report privately because they show synthetic test identities/proposal data. This draft has not been sent; external delivery/acknowledgement times and the proposed appointment must not be fabricated.

InfaCompany / fastTrack
