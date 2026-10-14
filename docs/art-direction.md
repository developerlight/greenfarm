# Green Farm — Art Direction & Motion (0.2)

## Purpose

Establish an original, coherent visual language for a browser farm game. This is a prototype guide, not a claim that the listed objects or mechanics are confirmed in Green Farm 3. Confirm the final object list against the gameplay evidence log before production.

## Visual direction

- **View:** elevated three-quarter/isometric composition; objects should read clearly at small browser sizes.
- **Shape language:** rounded silhouettes, broad readable forms, restrained detail, hand-built geometry rather than traced game art.
- **Mood:** welcoming, sunny, lively, and pastoral.
- **Materials:** matte painted surfaces, soft highlights, no photorealistic textures.
- **Outline:** deep forest green/brown outlines, used consistently and sparingly.
- **Lighting:** warm upper-left key light, soft short shadows, pale sky fill.
- **Motion:** small, legible loops; animation must not obscure click targets.
- **Originality:** all project models, drawings, icons, textures, and audio are made for this project. Do not extract or trace Green Farm 3 assets.

## Starter palette

| Role | Color | Hex |
| --- | --- | --- |
| Deep outline | Pine | `#31513D` |
| Main grass | Leaf | `#73B95B` |
| Light grass | Mint | `#A8D978` |
| Soil | Chestnut | `#95613F` |
| Light soil | Clay | `#C98754` |
| Warm wood | Honey | `#D8A45E` |
| Barn accent | Berry red | `#D96655` |
| Sky / highlight | Cream | `#FFF2D2` |
| Water | Clear blue | `#71C9D1` |

## Production constraints

- Keep a shared world scale, pivot convention, outline weight, and light direction.
- Make interactive objects readable against both grass and soil.
- Prefer low-poly meshes and reusable materials for the eventual Three.js scene.
- Runtime 3D assets should be exported as GLB; keep editable Blender sources beside the asset source files once Blender is available.
- Prototype SVGs in `public/assets/prototype` are original 2D style checks and UI stand-ins, not final 3D assets.

## Runtime motion pass

- Wheat stalks sway at slightly different phases and heights; ripe crops have separate kernels to make the harvest state read clearly.
- Tree canopies move subtly while trunks stay planted.
- The chicken patrols a small area, bobs while walking, pecks periodically, and flutters its wings.
- Two small butterflies follow slow looping paths with visible wing flaps.
- The selected plot marker pulses gently to make selection feedback visible in the world.
- Loops are procedural `useFrame` animations; they do not use React state every frame, and they add no external model or animation dependency.

## Approval gates

1. Review the palette and camera using the prototype sheet.
2. Compare shapes and color contrast against available gameplay screenshots/video.
3. Only then produce the confirmed asset catalog and detailed 3D models.
