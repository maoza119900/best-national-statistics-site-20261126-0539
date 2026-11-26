# Japan in Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/maoza119900/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/maoza119900/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

A national statistics site for Japan, 2015–2024: headline indicators on the overview, then one deep section per theme — population, economy, jobs, prices, education and health — a sortable and filterable table of the eight regions, and a data explorer where the chart and table follow the indicator and years you pick. Every figure is a rounded public estimate, cross-checked for internal consistency (age shares add to 100, regions add to the national totals), and every chart is hand-written SVG.

The site is plain static files under `app/` — no build step, no network requests, no external font, image or script. It runs on a desktop and on a phone from its own files. The four screenshots in `screenshots/` are real renders of the running site: the overview, the economy section, the data explorer, and the regions table on a phone.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. To take the four screenshots again:

```sh
node shots.mjs
```

To build the hand-in (`/output`, or `MAKEFUN_OUTPUT_DIR` outside the grader):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=crv8b33t&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
