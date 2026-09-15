# CODED six-room upgrade — asset provenance

## Generated models

User-approved Meshy 5 batch: 30 credits total (two 5-credit meshes and two 10-credit PBR texture passes). No additional credit operations were requested.

| Asset | Geometry task | Texture task | Delivery |
|---|---|---|---|
| Original robot mascot | 01a0a5fc-6956-7200-b28b-2fba14aaa6bb | 01a0a5ff-9d2e-7715-9182-0fd24bb23dc5 | public/models/robot-desktop.glb and robot-mobile.glb |
| Original office chair | 01a0a5fc-7537-7046-a415-593a31342177 | 01a0a5ff-a679-7318-9064-4772340f6540 | public/models/chair-desktop.glb and chair-mobile.glb |

These are text-generated original assets in the connected Meshy account, used subject to that account's Meshy terms. They are not third-party chair or robot models. One candidate per asset was generated within the approved budget; no claim of a multi-candidate selection process is made.

## Actual processing

Blender 4.3 imported the GLBs, applied transforms, normalized each model to one unit high with a bottom pivot, merged coincident vertices, recalculated normals, smoothed surfaces, resized textures and exported desktop/mobile GLBs. Mobile meshes use a 0.42 decimation ratio. Editable .blend files and original downloads are in asset-sources. See scripts/prepare_meshy_assets.py and asset-sources/model-stats.json for the reproducible pipeline and measured counts/sizes.

GLBs embed JPEG textures at 1024px desktop and 512px mobile. Geometry uses normal GLB encoding, not Draco/Meshopt. No KTX2 or external decoder is required. This reduced each original 5.6MB asset to approximately 0.55–0.60MB desktop and 0.24–0.27MB mobile. Model URLs are local and the appropriate device tier is selected before requesting an asset.

Robot animation moves the rigid generated model as a whole. Character arms/head use separate original articulated geometry; the robot GLB does not contain a skeletal rig.

## Original code assets

CampusArchitecture.ts: original two-floor cutaway structure, connected west staircase, landings, railings, six interiors, floor seams, furnishings, equipment, books and plants. Static geometry is merged by material.
CampusLife.tsx: original articulated learners, facial detail, room story displays and animation.
Objects.tsx: original revised curved dallah spout, hollow finjan and animated liquid, plus existing desk props.

## Visual references consulted

- [KUNA — traditional Kuwaiti coffeehouses](https://www.kuna.net.kw/ArticleDetails.aspx?id=2487360&language=ar): hospitality object silhouette reference; photograph was not redistributed or used as a texture.
- [Vitra — Physix](https://www.vitra.com/en-us/product/details/97468): chair construction/material study only; generated chair is an original design, not a branded reproduction.
- [Happy House, Kuwait — Wallpaper](https://www.wallpaper.com/architecture/happy-house-alhumaidhi-architects-kuwait): visual context for connected volumes and light-filled circulation. No imagery incorporated.

All website fonts remain locally hosted. The campus is an illustrative CODED concept, not a measured reconstruction of CODED's actual premises.
