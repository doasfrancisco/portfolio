# catafract landing

Portfolio landing for Matias, Francisco, and the team. Combines maxilar, pulso, syntax, inmoba, damelo, and doctoc into a single terminal-styled page with an interactive GitHub-style contribution graph fed by real commit data.

## Dev

```bash
bun install
bun dev
# open http://localhost:3000
```

```bash
bun run build  # type check + static build
```

## Refreshing the contribution graph data

The graph is powered by `app/_data/commits.ts`, which is **auto-generated** from real git history. To rebuild it after shipping more work:

### 1. Scrape commit dates per project

Commit dates live in local clones (where possible) and on GitHub (for private orgs without local clones). Each project is a **cluster of repos**, not a single repo. The filters below drop vendored open-source forks and unrelated experiments that happen to live in the same parent folder.

All scrapers write one file per project to `/tmp/commit-scrape/<project>-daily.txt` in the format `<count> <YYYY-MM-DD>`.

#### maxilar — local, all subrepos except vendored ones

```bash
EXCLUDE="chatwoot demo test"  # chatwoot is chatwoot/chatwoot fork; demo+test are unrelated
mkdir -p /tmp/commit-scrape
cd ~/github-repositories/maxilar  # adjust to your path
> /tmp/commit-scrape/maxilar-raw.txt
for sub in */; do
  name=${sub%/}
  skip=false
  for ex in $EXCLUDE; do [ "$name" = "$ex" ] && skip=true; done
  [ "$skip" = true ] && continue
  [ ! -d "$name/.git" ] && continue
  git -C "$name" log --all --pretty=format:'%aI' >> /tmp/commit-scrape/maxilar-raw.txt
  echo "" >> /tmp/commit-scrape/maxilar-raw.txt
done
cut -c1-10 /tmp/commit-scrape/maxilar-raw.txt | grep -E '^[0-9]' \
  | sort | uniq -c | sort -k2 > /tmp/commit-scrape/maxilar-daily.txt
```

#### pulso — GitHub (`naovihq` org), only commits by Francisco and Matias, ignores `ap-legacy`

```bash
> /tmp/commit-scrape/pulso-raw.txt
for repo in frontend db ana-meta business-context QA-CC sap mcp-maria; do
  for author in doasfrancisco Matias222; do
    gh api --paginate "repos/naovihq/$repo/commits?per_page=100&author=$author" \
      --jq '.[].commit.author.date' 2>/dev/null >> /tmp/commit-scrape/pulso-raw.txt
  done
done
cut -c1-10 /tmp/commit-scrape/pulso-raw.txt | grep -E '^[0-9]' \
  | sort | uniq -c | sort -k2 > /tmp/commit-scrape/pulso-daily.txt
```

Notes:
- `ap-legacy` is excluded — that's the old Ana Prevention backend, pre-rewrite.
- `author=` is a server-side filter by GitHub login, so you don't pull other teammates' commits.

#### syntax — GitHub (`usesyntax` org), all repos except `azure-speech-text`

```bash
> /tmp/commit-scrape/syntax-raw.txt
for repo in syntax-frontend syntax-backend syntax-mobile syntax-conversation \
            syntax-talk syntax-pronunciation syntax-text-to-speech \
            syntax-control-center syntax-bot syntax-feedback syntax-landing \
            syntax-fluency-analytics syntax-notifications-cronjob \
            syntax-playground syntax-challenge syntax-test syntax-interview \
            syntax-backend-python feedback-robusto tok; do
  gh api --paginate "repos/usesyntax/$repo/commits?per_page=100" \
    --jq '.[].commit.author.date' 2>/dev/null >> /tmp/commit-scrape/syntax-raw.txt
done
cut -c1-10 /tmp/commit-scrape/syntax-raw.txt | grep -E '^[0-9]' \
  | sort | uniq -c | sort -k2 > /tmp/commit-scrape/syntax-daily.txt
```

`azure-speech-text` is excluded — it's a 2020 pre-Syntax donated repo, not real company work.

#### inmoba — local, except vendored map tooling

```bash
EXCLUDE="tileserver-gl tippecanoe"  # forks of maptiler/tileserver-gl and mapbox/tippecanoe
cd ~/github-repositories/others/inmoba
> /tmp/commit-scrape/inmoba-raw.txt
for sub in */; do
  name=${sub%/}
  skip=false
  for ex in $EXCLUDE; do [ "$name" = "$ex" ] && skip=true; done
  [ "$skip" = true ] && continue
  [ ! -d "$name/.git" ] && continue
  git -C "$name" log --all --pretty=format:'%aI' >> /tmp/commit-scrape/inmoba-raw.txt
  echo "" >> /tmp/commit-scrape/inmoba-raw.txt
done
cut -c1-10 /tmp/commit-scrape/inmoba-raw.txt | grep -E '^[0-9]' \
  | sort | uniq -c | sort -k2 > /tmp/commit-scrape/inmoba-daily.txt
```

#### damelo — local, all subrepos (all are ours)

```bash
cd ~/github-repositories/damelo
> /tmp/commit-scrape/damelo-raw.txt
for sub in */; do
  name=${sub%/}
  [ ! -d "$name/.git" ] && continue
  git -C "$name" log --all --pretty=format:'%aI' >> /tmp/commit-scrape/damelo-raw.txt
  echo "" >> /tmp/commit-scrape/damelo-raw.txt
done
cut -c1-10 /tmp/commit-scrape/damelo-raw.txt | grep -E '^[0-9]' \
  | sort | uniq -c | sort -k2 > /tmp/commit-scrape/damelo-daily.txt
```

#### doctoc — GitHub, the three FHIR-related repos

```bash
> /tmp/commit-scrape/doctoc-raw.txt
for repo in FHIR-Organizacional doctoc-functions doctoc_db_api; do
  gh api --paginate "repos/doasfrancisco/$repo/commits?per_page=100" \
    --jq '.[].commit.author.date' 2>/dev/null >> /tmp/commit-scrape/doctoc-raw.txt
done
cut -c1-10 /tmp/commit-scrape/doctoc-raw.txt | grep -E '^[0-9]' \
  | sort | uniq -c | sort -k2 > /tmp/commit-scrape/doctoc-daily.txt
```

### 2. Generate `app/_data/commits.ts`

Once all five `<project>-daily.txt` files exist, run this Python script (save it anywhere, e.g. `scripts/gen_commits.py`):

```python
projects = ['maxilar', 'pulso', 'syntax', 'inmoba', 'damelo', 'doctoc']

result = {}
for p in projects:
    with open(f'/tmp/commit-scrape/{p}-daily.txt') as f:
        for line in f:
            line = line.strip()
            if not line: continue
            parts = line.split()
            if len(parts) < 2: continue
            count, date = int(parts[0]), parts[1]
            if date not in result: result[date] = {}
            result[date][p] = count

sorted_days = sorted(result.keys())
total = sum(sum(by.values()) for by in result.values())

def cal_year(year):
    return sum(sum(by.values()) for d, by in result.items() if d.startswith(f'{year}-'))

y2026 = cal_year(2026)
y2025 = cal_year(2025)
y2024_2023 = cal_year(2024) + cal_year(2023)

out_path = 'app/_data/commits.ts'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('/* AUTO-GENERATED from git log of project repos. Do not edit by hand. */\n\n')
    f.write('export type ProjectKey = ' + ' | '.join(f'"{p}"' for p in projects) + ';\n\n')
    f.write('export type DayCommits = {\n  date: string;\n  byProject: Partial<Record<ProjectKey, number>>;\n};\n\n')
    f.write('export const COMMIT_DAYS: DayCommits[] = [\n')
    for date in sorted_days:
        parts = ', '.join(f'{p}: {c}' for p, c in result[date].items())
        f.write(f'  {{ date: "{date}", byProject: {{ {parts} }} }},\n')
    f.write('];\n\n')
    f.write(f'export const COMMIT_TOTAL = {total};\n\n')
    f.write('export const COMMIT_BY_YEAR: Record<string, number> = {\n')
    f.write(f'  "2026": {y2026},\n')
    f.write(f'  "2025": {y2025},\n')
    f.write(f'  "2024-2023": {y2024_2023},\n')
    f.write('};\n\n')
    by_project = {p: 0 for p in projects}
    for by in result.values():
        for p, c in by.items():
            by_project[p] += c
    f.write('export const COMMIT_BY_PROJECT: Record<ProjectKey, number> = {\n')
    for p in projects:
        f.write(f'  {p}: {by_project[p]},\n')
    f.write('};\n')

print('total:', total, '| by project:', by_project)
```

Run from the project root:

```bash
python scripts/gen_commits.py
```

That rewrites `app/_data/commits.ts`. The graph and every tab's commit count in the terminal read from it.

### 3. Adding a new project

1. Add the project's name to the `projects` list in the Python script.
2. Write a scrape block for it (see examples above) that produces `/tmp/commit-scrape/<project>-daily.txt`.
3. Run the Python script to regenerate `commits.ts`.
4. Add the new project to:
   - `app/_components/tab-context.tsx` → `TabKey` union
   - `app/_components/terminal.tsx` → `TAB_ORDER`, `THEMES`, a new `<Content>` component, and the render switch in `Terminal`
   - `app/_components/graph-card.tsx` → `PROJECT_COLORS` and `PROJECT_LABEL`

Pick a distinct accent color — the existing ones are cyan (`#22D3EE`), pink (`#F472B6`), purple (`#A78BFA`), amber (`#F59E0B`), grey (`#A3A3A3`), green (`#4EC86C`).

## Architecture

- `app/page.tsx` — wraps everything in `TabProvider` so the graph and terminal share active-tab state.
- `app/_components/tab-context.tsx` — `activeTab`, `activeYear`, and `focusTerminal()` (which sets the tab and smooth-scrolls to the terminal).
- `app/_components/graph-card.tsx` — the contribution graph. Calendar year Jan-Dec, 53 columns × 7 rows. Three year buttons (2026, 2025, 2024-2023). Hover cells for per-year commit breakdown. Click cells or legend entries to jump to the corresponding project tab in the terminal.
- `app/_components/terminal.tsx` — the tabbed terminal. One content component per project. Real commit totals in the footer come from `COMMIT_BY_PROJECT`.
- `app/_components/mockups.tsx` — the nine screen tiles shown in each tab's gallery section.
- `app/_data/commits.ts` — auto-generated, don't edit by hand.
