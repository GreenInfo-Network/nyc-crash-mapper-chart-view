# NYC Crash Mapper: Chart View
An interactive data viz dashboard that allowing for users to view trends, comparisons, and rankings among various NYC geographies and crash types by date range. This codebase represents phase two of the NYC Crash Mapper project's scope. This work was funded by Christine Berthet of the non-profit organization [Chekpeds](#), which advocates for traffic safety in Hells Kitchen, New York City.

## Related Repositories:
There are currently two other repositories that relate to this one:

- [nyc-crash-mapper](https://github.com/clhenrick/nyc-crash-mapper) Repository for interactive map from phase 1 of the project.

- [nyc-crash-mapper-etl-script](https://github.com/clhenrick/nyc-crash-mapper-etl-script) Extract, Tranform, and Load script that ingests data from the NYC Open Data Portal and loads it into CARTO.

## Developer Notes:
This web app is based on the boilerplate [GreenInfo Static Site Starter](https://github.com/GreenInfo-Network/gin-static-site-starter) which uses Webpack, React, Redux, Babel, Sass, ESLint, Prettier, StyleLint.

### Install Instructions
Make sure you have NodeJS >= 6.9.x and NPM >= 3.10.x and Yarn >= 0.22 installed.

#### Node Version Manager
Note the `.nvmrc` file, this makes it explicit which version of NodeJS you are using with your project. Major releases between NodeJS versions can have breaking changes, so it's good to use [Node Version Manager](https://github.com/creationix/nvm) in case you need to switch versions between projects.

If you have NVM installed, you can use the project's current version of NodeJS by doing the following in the root of this repo:

```
nvm use
```

NVM will let you know if the version of Node is currently not installed by replying with:

```
N/A: version "x.x.x -> N/A" is not yet installed.
```

and that you may install it by doing:

```
You need to run "nvm install x.x.x" to install it before using it.
```

Note that `x.x.x` is a place holder for the version of NodeJS you'd like to use, and that you'll have to do `nvm use` for each shell instance.

#### Install Dependencies
To install project dependencies do:

```
yarn install
```

You may also use `NPM` to install dependencies, but using Yarn is better as it resolves dependencies of dependencies ensuring will have the exact same ones if you `rm -rf` the `node_modules` directory and do an install a year from now.

It's also recommended to use Yarn to install new dependencies so that the `yarn.lock` file gets updated. You can do this by doing:

```
yarn add some-library
```

OR

```
yarn add -D some-library
```

The `-D` flag will save the dependency to `devDependencies` in `package.json`.

### Develop
To have Webpack bundle files, start the dev server, and watch for changes do:

```
npm start
```

This will compile the assets in the project and start [Webpack Dev Server](https://webpack.js.org/configuration/dev-server/#devserver) as a local server. This should automatically open your web browser to `localhost:8080` and you should see the site once Webpack has finished its initial bundling process. Webpack will automatically refresh the page when it recompiles and notify you that it has done so.

### Build
To have Webpack create an optimized production build do:

```
npm run build
```

This will create compiled and compressed JS and CSS files in the project's `dist/` directory. These files may then be hosted on a server of choice as a static site. Note that any existing files in `dist/` will be blown away prior to new ones being generating using `rimraf`.

**NOTE** that the `dist/` directory is intentionally kept of out version control in `.gitignore`. If you'd like to include the contents of `dist/` in Git, simply remove `dist/` from `.gitignore`.

## Deploy

### Github Pages
To bundle the app's source code and then deploy the contents of the `dist/` directory to the repository's Github Pages do:

```
npm run deploy:gh-pages
```

### Using Static Assets
The empty `assets/` directory is available for Webpack to include static assets such as images, icons, etc. The Webpack Dev Server should resolve file paths just by doing `assets/filename.png` in your code (e.g. for the `src` attribute of an image tag). When doing `npm run build` the `CopyWebpackPlugin` will copy the `assets/` directory to `dist/assets` for you.

### Skeleton SCSS Framework
This setup uses a [SASS/SCSS port](https://github.com/WhatsNewSaes/Skeleton-Sass) of the [Skeleton CSS Framework](http://getskeleton.com/).

In `scss/skeleton/skeleton.scss` file you may specify which parts of Skeleton you wish to use.

### App Structure
This web app makes use of React Redux's [**presentational** and **container** component paradigm](https://redux.js.org/docs/basics/UsageWithReact.html), where components that are "aware" of Redux are referred to as **containers** and live in `src/containers` while components that _are not_ aware of Redux are referred to as **presentational** and live in `src/components`. In writing this web app I have not followed this paradigm strictly in the sense that most of the **container** components contain mark up (JSX). My rationale for this is that it can be annoying to rename a component after connecting it to Redux, [although sometimes this is necessary](./src/containers/LineChartWrapper.jsx). In the Redux docs, an example of this is calling the `TodoList` component `VisibleTodoList`. The latter is essentially a wrapper around the former component, and while this makes sense semantically I found it burdensome to do this for each component that is connected to Redux.

Within the `src/components` directory, components are organized by related parts of the UI. For example, the `src/components/Legend/` directory contains components that are specific to the Legend. The Legend is imported into the `App` container via the `src/components/Legend/index.js`.

#### Redux State Shape
The Redux state shape is visible when running the project locally, as the `redux-logger` Redux Middleware will print the state shape in the Javascript console each time the Redux state is updated. Note that the terms used in the state shape (e.g. `primary`, `secondary`) are re-used often through out the app, so become familiar with them if you will be making adjustments to the app's source code.

The basic state shape with default values is outlined below:

```js
{
  // "browser" is implemented via the "redux-responsive" redux middleware
  // contains various properties describing the browser width, useful for implementing responsive design patterns
  // these values are populated before the app's first render
  // the only property currently used by the app is "browser.width",
  // others are left to assist with future responsive design implementations
  "browser": {
    "_responsiveState": true,
    "lessThan": {
      "extraSmall": false,
      "small": false,
      "medium": false,
      "large": false,
      "extraLarge": false,
      "infinity": false
    },
    "greaterThan": {
      "extraSmall": true,
      "small": true,
      "medium": true,
      "large": true,
      "extraLarge": true,
      "infinity": false
    },
    "is": {
      "extraSmall": false,
      "small": false,
      "medium": false,
      "large": false,
      "extraLarge": false,
      "infinity": true
    },
    "mediaType": "infinity",
    "orientation": "landscape",
    // NOTE: these breakpoints can be reconfigured in store.js if desired
    "breakpoints": {
      "extraSmall": 400,
      "small": 550,
      "medium": 750,
      "large": 1000,
      "extraLarge": 1200,
      "infinity": null
    },
    "width": 1291, // current width of the viewport
    "height": 1092 // current height of the viewport
  },
  // the chart type currently toggled. may be one of: trend, compare, rank, or about
  "chartView": "trend",
  // stores data for the entire date range of the dataset, by geography type
  "data": {
    "errorCharts": null, // did a async data fetch error?
    "isFetchingCharts": false, // is data being requested?
    "borough": {}, // data aggregated by nyc borough name, note that
      // within the geo property another property called "response" will exist,
      // which will contain the array of objects / response from the CARTO SQL API
    "city_council": {}, // data aggregated by nyc city council number
    "citywide": {}, // data for the entire city, not aggregated by a geography
    "community_board": {}, // data aggregated by community board number
    "neighborhood": {}, // data aggregated by neighborhood tabulation area name
    "nypd_precinct": {} // data aggregated by nypd precinct number
  },
  // the app allows for filtering by 2 date ranges, referred to as "periods"
  "dateRanges": {
    "period1": { // first time period, more recent by default
      "startDate": "2016-11-01T23:21:30.113Z", // javascript date object
      "endDate": "2017-11-01T23:21:30.113Z" // javascript date object
    },
    "period2": { // second time period, follows the first period by default
      "startDate": "2015-11-02T00:21:30.113Z", // javascript date object
      "endDate": "2016-11-01T23:21:30.113Z" // javascript date object
    }
  },
  // a user may select up to two geographic entities at one time,
  // referred to as "primary" or "secondary"
  // additionally, a "reference" geo entity may also be toggled in the "trend" chart view
  "entities": {
    "primary": {
      "color": "#FDB462",
      "values": [] // values are populated when an entity is selected
      // e.g. selecting city council 101 will populate this array with unfiltered data for city council 101
    },
    "secondary": {
      "color": "#F08273",
      "values": [] // values are populated when an entity is selected
    },
    "entityType": "city_council", // selected geographic type
    "filterTerm": "", // a string entered by user in "Select Areas" UI text input
    // selected reference geography type,
    // may be one of: citywide, brooklyn, queens, manhattan, bronx, staten island
    "reference": "citywide",
    // the following are used in the "rank" chart view only
    "sortRank": true, // sort all entities by rank
    "sortName": false, // sort all entities by name
    "sortAsc": false // sort ascending
  },
  // crash filter types, grouped by injury and fatality, then by person type
  // correspond to the filter by type buttons in the UI
  "filterType": {
    "injury": {
      "cyclist": true,
      "motorist": true,
      "pedestrian": true
    },
    "fatality": {
      "cyclist": false,
      "motorist": false,
      "pedestrian": false
    },
    "noInjuryFatality": false // not used by the chart view app, but remains from the map view
  }
}
```

#### Stateful URL Query Params

_TO DO..._

- via custom Redux Middleware

#### Integration with D3

_TO DO..._

### SQL Queries

_TO DO..._

### Linting and Code Formatting

_TO DO..._

- ESLint, Prettier, StyleLint

### Webpack Config Notes

_TO DO..._

- Loading SVG files as React Components
