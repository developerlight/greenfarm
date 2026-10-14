# Green Farm 3 — Gameplay Evidence Log

Status: first-pass visual review of the user-provided YouTube references. These are observation notes from short samples, not a frame-by-frame audit or a final rules specification.

## Source coverage and limitations

- User supplied 17 playlist links. Playlist indices 14 and 15 both use video ID `Lp11W5Y0BCk`, which resolves to **Green Farm 3 Part 15** (53:56). This is one video repeated; a distinct Part 14 reference was not supplied.
- The set therefore covers 16 distinct videos: Parts 1–13 and 15–17. Parts 1–13, 15, 16, and 17 have been opened; frames were sampled at roughly the first 5–14 minutes, rather than reviewing each full 54–90 minute recording.
- The videos are labeled “No Commentary” or contain no useful narration in the sampled sections. This pass therefore records visible UI and events only; no undocumented rule or invisible backend behavior is assumed.
- The recordings identify gameplay on the Nox Android emulator. Later-game currency figures are unusually large (tens of millions / billions in some frames); treat them as account-specific or potentially modified values, not economy balance targets.

## Recording rules

- Record visible facts separately from interpretation.
- Keep timestamps approximate to the player display; one-second precision isn't meaningful for these sampled screenshots.
- Confidence: **high** = readable UI or unambiguous scene; **medium** = clear scene but object/meaning is partly ambiguous; **low** = unclear.

## Per-video sample record

| Part / video ID | Sample time | Visible evidence | Implication to investigate | Confidence |
| --- | --- | --- | --- | --- |
| 1 / `Tp5LX3lY6zA` | 6:17, 12:35 | Tutorial card titled “Making Room” says the plot has large piles of rocks “in the middle of your fields” and “We'd better take care of that!”; early level 3 scene has a manor, market stall, cow, rocks, hay, and planted rows. | Tutorial-led onboarding; clearing obstacles may open/use farm space. Need inspect the actual action and cost/reward. | High for text/scene; medium for mechanic. |
| 2 / `80ICypBxZwI` | 5:52 | Level 8 farm shows mature wheat-like rows beside small sprouts and tilled soil, cows, a trough/feeder, market stand, and fruit trees. | Crop growth stages and coexisting farm activities are visible. Harvest timing and production chain not established by this frame. | Medium. |
| 3 / `h30RDNedx0M` | 5:27 | Feed Mill panel lists Pig Feed `07 m 53 s`, Dog Food `07 s`, and Cow Feed `02 m 18 s`; buttons show quantities/icons. | Production uses recipes or product slots with visible durations; button semantics and whether jobs queue are still unknown. | High for displayed labels/timers; low for button meaning. |
| 4 / `BoDF5Bcrhqw` | 5:46 | Feed Mill lists Goat Feed `16 m 11 s`, Cow Feed `23 s`, Cow Feed `24 s`; green currency display reads 0. | Multiple feed products and timed production recur. The sample alone doesn't show resource/currency requirements. | High for displayed labels/timers. |
| 5 / `jfZcF_eWpfk` | 6:44 | Level 13 farm has tilled empty plots, house/shopfront, barn/animal buildings, cows/pigs/chickens, and several exclamation bubbles. | The world surface communicates available actions through overhead alerts. Exact task meanings require interactions. | Medium. |
| 6 / `6qsFomtf_vM` | 8:32 | Level 19 scene includes a mature crop field, barn/house, animal building, market stall, and machine. | Buildings, fields, animals, and production machines share one farm view; precise crop and machine action not read. | Medium. |
| 7 / `XoqHqji-85o` | 5:19 | Level 20 shows fenced livestock, multiple thought/alert bubbles, adjacent crop plots, pond, and a small upper-right inventory/tool card. | Animal needs/actions are surfaced in-world; enclosure, water, and inventory affordances are visible. Bubble icon meaning needs a closer sample. | Medium. |
| 8 / `TRa4_2Lqk0U` | 7:44 | Level 22 scene shows fruit trees/orchard, red-and-white silo, machine, sprouting field, fenced animals with bubbles, and pond. | Orchard and crop plots coexist with animal care and production. | Medium. |
| 9 / `qI_r4F-4hLU` | 8:55 | Scene shows house/building cluster, tilled plots, fruit tree, hay bale, horse, and a small resource/product card. A production indicator reads “Until ready” and about `23 h 40 m 41 s`; a speed-up button displays `80`. | At least one long timer and a speed-up affordance are visible; the timer could be event/building/product-specific. Do not reproduce the 23h timer until its associated action is identified. | High for visible text; medium for association. |
| 10 / `IkqCEmVq4Rs` | 6:42 | Level 23 has several fruit-bearing trees, red-and-white silo, machine with alert, stone walls, livestock enclosure, fields, and mailbox/letter icon. | Mail/letter is a distinct UI/world affordance; its function is unknown. | Medium. |
| 11 / `0vTaqDt56Zo` | 6:50 | Level 24 has tilled plots, orchard, silo, machine alerts, stone walls, mixed animal pen, flowering crop row, mailbox/letter, and Events button. | Diverse production and farm elements persist at later progression; no pacing/economy conclusions from one save. | Medium. |
| 12 / `lhcbJBA6jzA` | 13:47, 34:08 | Level 26 with large field of seedlings, manor/shopfront, goods stall, coop/cow, fruit tree and event panel; second frame has a colored beetle/task panel and livestock. | Event/objective counters may be presented as compact item icons and counts. The meaning and reset cadence are unknown. | Medium. |
| 13 / `KKmbwPz9Vhg` | 6:13 | “Neighbors” request panel for Rosco shows heart progress and asks for Strawberry Candy x1 and Brown Sugar x3; displayed reward: 50 blue stars/XP and 1,250 coins. A “Deliver” button is disabled at the shown inventory (`0/1`, `0/3`); “Decline” is available. | Strong evidence for NPC delivery requests, requested inventory quantities, accept/decline choice, relationship hearts, and explicit XP/currency rewards. Whether declining has a penalty is unknown. | High. |
| 14 / **not provided** | — | Submitted playlist index 14 repeats Part 15's video ID; no separate Part 14 could be verified from the supplied URL. | Need a distinct Part 14 URL if it is intended as reference. | High. |
| 15 / `Lp11W5Y0BCk` | 5:18 | Level 40 scene shows large tilled area, fenced animal pen with several exclamation bubbles, hay bale, horse, trees/bushes, and “New!” / “Exclusive Offer” UI. | Unlock/announcement and promotional UI appear in later play; amounts on this save are not useful balance evidence. | Medium. |
| 16 / `mJoRc7TzjwM` | 4:49 | Level 42 farm shows several fenced animal areas with different animals and many exclamation bubbles, red animal building, pond, and crops. | Livestock space appears to scale into multiple pens; UI may become notification-dense. Need inspect whether animals differ in care/production. | Medium. |
| 17 / `FmonjmVikDg` | 5:27 | “Request” panel visibly offers Eggs, Milk, Tomato, Lettuce as request items/cards. Video is labeled final part; another frame from this episode was already at the request UI. | Supports the existence of product request/order selection alongside the neighbor delivery flow; exact refresh/selection rules unknown. | High for item cards; medium for their relation to neighbor/order system. |

## Evidence-backed feature candidates

These candidates are sufficiently visible to explore in a prototype, but are not yet final rules:

1. **Farm-space loop:** plot/obstacle clearing, tilling, planting, visible crop growth, harvest. A tutorial explicitly introduces making room; the exact obstacle costs and tool actions need review.
2. **Production loop:** buildings/machines create named products and display remaining time. Feed Mill products include several animal feeds. Queue size, input recipes, offline progress, boosts, and cancellation remain open.
3. **Animals and care:** animals occupy fenced pens and show overhead state bubbles. Species, care actions, output, and welfare penalties remain open.
4. **Requests and NPC relationship:** neighbor asks for named quantities, offers decline/deliver, shows heart progress and a reward. Delivery requirements and rewards can be prototyped behind data-driven rules.
5. **Farm readability:** buildings, plots, trees, props, alerts, events, mailbox, and currencies share a dense isometric farm view. Avoid copying the reference game's art; build original assets and UI.

## Design and implementation guardrails

- Treat all observed numbers as examples from the creator's save, not balance values. Define a small, coherent original economy only after recording several actual action/result transitions.
- Do not infer a recipe from a product name, icon, or duration alone. Capture the panel before and after starting/completing a job.
- Keep the first playable slice small: tutorial clear action → plant/grow/harvest one crop → queue one feed recipe → fulfill one neighbor request. Only include each action once its rule is evidenced or explicitly defined as an original design choice.
- Keep server-authoritative validation and persistent schema gated until the action rules and MVP are approved. Current scene is still a clickable visual prototype, not a playable simulation.

## Next reference-analysis pass

1. Obtain the missing Part 14 link if needed.
2. Sample complete interactions, not just overview frames: clear obstacle, sow/harvest, start/finish a Feed Mill job, tap animal alert, fulfill/decline a neighbor request, and inspect mailbox/event panels.
3. For each interaction, record exact precondition, player action, timer/cost, state change, and reward; take at least one follow-up frame after completion.
4. Convert confirmed actions into an original MVP rules sheet and acceptance criteria, then update the asset inventory and only then expand the game simulation/schema.
