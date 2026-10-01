# Focused refinement report

Target: `C:/Users/0ping/Desktop/Seraph.tw/notes.nagi.tw` (former Notes repository, now primary Nagi.tw).
The old `nagi.tw` repository was not modified. Existing uncommitted migration work was preserved. No deployment, commit, push, DNS, Cloudflare, or GitHub settings changes were made. URL-map changes are inactive local documentation only.

1. **Typography.** Preserved the serif/editorial hierarchy while reducing page titles from 52–105.6px to 28.8–44px, article titles from 40–72px to 24.8–37.6px, and index titles from 26.4–43.2px to 19.2–25.6px. About's personal statement is now 24–32px. Body text is 15px; article prose is 16px, down from 17.28px. Reduced section/hero spacing, About body presentation, Archive year headings and article body heading presentation. Repeated eyebrow squares and corner ornaments were removed.

2. **Experience.** Retained the three existing public entries: FRC off-season competition/team leadership, InfoSec Taiwan 2026, and the 2026 cybersecurity conference. Added New Taipei City Hackathon (team formation and data crawling/platform development) and Windows malware-analysis practical training. Five entries render in all three locales. Unverified event dates are omitted; article publication dates were not substituted. The unpublished `from-nihscsed-to-control-team` editions remain unpublished and were not used to restore school/community roles. No comprehensive experience data table exists in the target repository's current source.

3. **Projects added.** Two representative implementation records: Childcare Risk Monitoring (hackathon web/AWS/data prototype, with the public GitHub repository explicitly linked in its article) and FRC Robot Preparation (team engineering, preparation and repair). Project membership is explicit and independent of article category or publication filtering. Each record has concise title, description, area, status and relevant evidence. Added a subtle localized collaboration link to Contact.

4. **Projects removed.** Removed Raspberry Pi mobile Linux from portfolio records, featured selections and localized project metadata; its article remains byte-identical. Home Lab is absent from portfolio records and rendering. Its existing article/documentation remains intact.

5. **Research.** Expanded from two to five explicit directions: Medical IoT Security / Clinical Needs; Offline / Edge AI; AI Agent Permission Boundaries; Drone / UAV and Robot Security (ROS/ROS2); Windows Malware Analysis. Each has a conservative status. UAV is conference-informed exploration, not a claimed tested drone system. No completed exploit, new vulnerability, publication or benchmark was invented.

   **Evidence limitation:** 5G, self-developed ESP32 systems, Xiaomi Band reverse engineering and MedTrust by name were not found in this target repository's current content or the inspected history. They were not invented or copied from the old primary repository. Read-only access to the adjacent legacy `Seraph.tw/source` was asked about but no answer arrived during this pass, so it was not inspected. A larger historical experience/project restoration remains dependent on that source decision or other repository-backed records.

6. **Article audit.** Counts refer to Markdown/MDX files in the article collection, not documentation files. Before: 29 source editions, 13 identities, 26 public editions, 12 public identities. After:

   | Measure | Count |
   | --- | ---: |
   | Markdown source editions | 27 |
   | Unique article identities | 12 |
   | Traditional Chinese editions, including unpublished | 12 |
   | English editions, including unpublished | 6 |
   | Japanese editions, including unpublished | 9 |
   | Published editions | 24 (11 ZH, 5 EN, 8 JA) |
   | Unpublished editions | 3 (one identity, one edition per language) |
   | Articles shown on each locale's Articles index | 11 |
   | Generated article pages, including fallback shells | 33 |

   The smaller visible list is explained by translation grouping and publication flags. All public identities appear on all three locale indexes, with explicit fallback where a translation is absent. Dates parse correctly; no slug collision, duplicate language edition, taxonomy exclusion or missing public edition was found. No migration bug was found that justified publishing additional content. Detailed tags are verified against the source and search index. The hidden identity remains `from-nihscsed-to-control-team`.

7. **Codex deletion.** Deleted only `articles/personal/why-i-still-use-codex.md` and `articles/personal/why-i-still-use-codex.ja.md`. No English edition existed. The dynamic translation manifest, RSS, sitemap, archive, topics and search now exclude that identity; its now-empty Codex topic routes disappear. Updated the inactive legacy inventories, with no active redirects installed. Shared assets were preserved. The original preservation manifest remains intact with an exact two-file removal allowlist.

8. **Topics.** The visible index now has eight broad topics: Security, AI, Embedded, Medical, Systems, Life, Research, Activities, with localized labels. Existing detailed tag routes remain when supported by retained public content. No tags or categories in article frontmatter were rewritten.

9. **Tag/chip UI.** Removed the article tag-link cluster. Article, project and research listings use plain metadata, titles and descriptions; category filtering remains plain text controls. No outlined tag pills were added. Search and detailed topic metadata remain available.

10. **Theme.** Added visible Light / Dark controls beside the language controls, with independent `nagi-theme` storage and early initialization. Light is the default. Switching still works when storage is blocked; theme persistence does not affect URL-based language selection. Dark tokens preserve readable typography and borders.

11. **Penguin.** Removed it from the brand and favicon. The header is text `nagi.tw`, favicon is a simple `n`, and the original penguin is now a 36px footer signature. The original SVG's SHA-256 remains `68ec7f2e623df434cb703eb72e461c782649113776ba98a0f33d2fdac824e40f`. A fixed light backing keeps the unmodified asset legible in both themes. No filter, recoloring, mask or blending is applied.

12. **Hello, world!** Native button toggles a small greeting, with localized accessible label, `aria-expanded`, `aria-controls` and a status region. Exact English greeting is unchanged across locales. Verified pointer click, Enter to show and Space to hide. No modal, navigation, audio or continuous animation. Existing reduced-motion rules remain; the interaction introduces no motion.

13. **Files changed.** See `changed-files.json` for this pass's exact source/test/assets changes relative to the captured dirty-worktree baseline, rather than treating all pre-existing Git changes as ours. Additional local documentation changes: `docs/legacy-url-map.csv`, generated inactive files under `docs/redirects/`, and new audit/report/screenshots under `docs/refinement/`. The original asset and article preservation manifests were not rewritten.

14. **Validation.** All passed on the final build:

   - `npm run check`: 0 errors, 0 warnings, 0 hints.
   - `npm run build`: 228 static pages, 76 per locale.
   - `npm run validate`: 24 public editions, 11 public identities, one unpublished identity.
   - `npm run validate:runtime`: 198 context/query/hash language switches; 228 HTTP 200 routes; all article translations/fallbacks; blocked storage; filters; all three locale layouts at 320, 375, 390, 768, 1024 and 1440px; theme persistence; penguin keyboard/pointer interaction and asset/style checks; no runtime/network errors.
   - `validate-ui`, `validate-taxonomy`, `validate-preservation`, `validate-i18n`, `validate-primary-site`, `validate-language-urls`, `validate-base-path`, `validate-preproduction`, `validate-refinement` scripts: PASS.
   - `audit-articles`, `test-rss`, `test-redirects`, and `prepare-redirects.py --check`: PASS.
   - 5,705 local references resolve. All 32 retained article/image files in the original manifest remain byte-identical. All retained article source files also match the immediate pre-refinement baseline.
   - `git diff --check`: PASS (existing Windows line-ending notices only).
   - Independent read-only review found one incorrect missing-repository statement; verified the original article's explicit GitHub link and corrected all three translations.

15. **Visual review.** Inspected representative Light/Dark screenshots for 375px About (ZH), 768px Research (EN), 1024px Projects (JA), and 1440px Articles (ZH). Automated checks cover additional routes at all requested widths, including long article titles, Japanese layouts, tables/code containers and navigation. No horizontal overflow or navigation collision was detected. Real-device Safari/touch and screen-reader announcement behavior remain suitable for manual review; they were not claimed as tested. The in-app browser was unavailable, so the existing repository headless Chromium validation was used. Screenshot artifacts are in `screenshots/`.

The content-evidence limitations in item 5 are the remaining constraint, not a failed build or a request to deploy.
