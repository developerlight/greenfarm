# Original Asset Production Backlog

This backlog distinguishes completed MVP art from optional follow-up production.

## Completed for the local vertical slice

- [x] Establish stylized isometric art direction and palette.
- [x] Draw original SVG style tests for plot, seedling, building, and animal.
- [x] Build a browser-viewable art prototype and asset manifest.
- [x] Build the Next.js + TypeScript foundation and Three.js/R3F scene.
- [x] Create original code-built low-poly plots, rocks, wheat stages, barn, feed mill, trees, chicken, and props.
- [x] Implement selection/action UI and gameplay-state variants for plot assets.
- [x] Review scene direction against sampled user-provided gameplay videos; record uncertainty in the evidence log.
- [x] Inventory MVP objects in `asset-manifest.md`, separating video evidence from original design choices.
- [x] Confirm all assets are created for this project; no third-party game assets are used.

## Optional follow-up after MVP review

- [ ] Once Blender is available and visual direction approved, block out Blender models and export optimized GLB where they improve quality or performance.
- [ ] Record all visual variants and animation states with part/timestamp references after deeper video review.
- [ ] Add only assets required by the next approved gameplay slice (more crop species, animal actions, production buildings, and effects).
- [ ] Compare future assets against captured references and document intentional deviations.

## Production acceptance checks

- Asset has a manifest ID, source file, usage, evidence reference (or explicit design label), and version.
- Silhouette and color remain readable at intended camera distance and screen sizes.
- Scale, pivot, lighting direction, and materials follow the art direction.
- Runtime format and size are appropriate for browser delivery.
- No source-game files, extracted APK content, or third-party assets without verified permission are included.

The code-built geometry satisfies the local MVP source/runtime requirement. Blender exports are not a prerequisite for completing this playable slice.
