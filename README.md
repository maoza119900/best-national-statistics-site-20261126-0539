# best-national-statistics-site-20261126-0539

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/maoza119900/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/maoza119900/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Japan in Numbers — a national statistics site for Japan, 2015–2024. Headline
indicators on the overview, then one deep section per theme (population,
economy, jobs, prices, education & health), a sortable regional table, and a
data explorer where the chart and table follow the chosen indicator and years.
Every chart is hand-drawn SVG; the whole site is static files that run
offline in a browser, with no network requests and no build step. All figures
are rounded public estimates. `screenshots/` holds four real renders of the
running site — overview, economy, data explorer, and the regions table on a
phone.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — nine hash routes, from `#/` (overview) to
`#/explorer` (data explorer) and `#/about` (methods).

To build the hand-in bundle the grader runs:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` into `out/` and writes `out/dossier.json`.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
