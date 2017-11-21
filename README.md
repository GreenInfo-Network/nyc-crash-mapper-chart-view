# NYC Crash Mapper: Chart View
An interactive data viz dashboard that allowing for users to view trends, comparisons, and rankings among various NYC geographies and crash types by date ranges. This codebase represents phase two of the **NYC Crash Mapper** project's scope. This work was funded by Christine Berthet of the non-profit organization [Chekpeds](http://chekpeds.com/), which advocates for traffic safety in Hells Kitchen, New York City.

## Related Repositories:
There are currently two other repositories that relate to this one:

- [nyc-crash-mapper](https://github.com/greeninfo-network/nyc-crash-mapper) Repository for interactive map from phase 1 of the project.

- [nyc-crash-mapper-etl-script](https://github.com/greeninfo-network/nyc-crash-mapper-etl-script) Extract, Tranform, and Load script that ingests data from the NYC Open Data Portal and loads it into CARTO.

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

This will compile the assets in the project and start [Webpack Dev Server](https://webpack.js.org/configuration/dev-server/#devserver) as a local server. This should automatically open your web browser to `localhost:8889` and you should see the site once Webpack has finished its initial bundling process. Webpack will automatically refresh the page when it recompiles and notify you that it has done so.

**NOTE:** Running this app locally assumes that the companion app, [nyc-crash-mapper](https://github.com/GreenInfo-Network/nyc-crash-mapper) is also running locally on a separate port to allow debugging between both apps. Thus, the navigation list item for `map` will link to `localhost:8080`. When the app is deployed, this navigation list item will link to `crashmapper.org`.

### Build
To have Webpack create an optimized production build do:

```
npm run build
```

This will create compiled and compressed JS and CSS files in the project's `dist/` directory. These files may then be hosted on a server of choice as a static site. Note that any existing files in `dist/` will be blown away prior to new ones being generating using `rimraf`.

**NOTE** that the `dist/` directory is intentionally kept of out version control in `.gitignore`. If you'd like to include the contents of `dist/` in Git, simply remove `dist/` from `.gitignore`.

### Deploy

#### Github Pages
To bundle the app's source code and then deploy the contents of the `dist/` directory to the repository's Github Pages do:

```
npm run deploy:gh-pages
```

NOTE: Doing this will remove the custom subdomain (`vis.crashmapper.org`) from the repo's settings. _**You will need to manually add it back after redeploying.**_

### App Structure
This app is built using the React.JS framework with Redux.JS, is written in ES6, and compiles to ES5 JavaScript via [Babel](https://babeljs.io) using [Webpack 2.x](https://webpack.js.org/). The application's point of entry is [`./src/index.js`](./src/index.js).

#### Redux
Redux uses the concept of keeping all application state within an immutable [store](http://redux.js.org/docs/basics/Store.html) and returning new application state via [action creators](http://redux.js.org/docs/basics/Actions.html).  [Reducers](http://redux.js.org/docs/basics/Reducers.html) trigger changes in the Store after receiving Actions from Action Creators. When the app first loads its store is hydrated from query params in the URL hash if they are present, otherwise it will use sensible defaults.

- [`action types`](./src/common/actionTypes.js)
- [`action creators`](./src/actions/)
- [`reducers`](./src/reducers/)
- [`store configuration`](./src/store.js)
- [`middleware`](./src/middleware.js)

##### Redux State Shape
The Redux state shape is visible when running the project locally, as the `redux-logger` Redux Middleware will print the state shape in the Javascript console each time the Redux state is updated. Note that the terms used in the state shape (e.g. `primary`, `secondary`, `period1`, `period2`, etc.) are re-used often through out the app, so become familiar with them if you will be making adjustments to the app's source code.

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
    // NOTE: these breakpoints can be reconfigured in store.js if desired,
    // see redux-responsive docs for more info on how
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
  // default period1 is current year-month, minus one year
  // default period2 is period1.startDate minus one year
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

#### Stateful URL Implementation
The app maintains a "stateful URL" via query parameters, which allows for sharing unique views of the application state via URL.

This is implemented in several places:

- [`reduxHydrateState`](./src/common/reduxHydrateState.js)
- [`updateBrowserHistory`](./src/common/updateBrowserHistory.js)
- [`middleware`](./src/middleware.js)

1. Any existing query params in the URL are **parsed and validated** by the app during first load, then are used to "hydrate" the Redux Store's state. This is done via `reduxHydrateState()` which is passed to `makeStore()` in [`store.js`](./src/store.js).

2. The Browser History API is used by `updateBrowserHistory()` to update query parameters without causing a page reload.

3. Custom Redux Middleware passes the `state` to `updateBrowserHistory()` whenever an action creator is invoked.

#### React
All UI components are built using [React](https://reactjs.org/)(v15.5.4), which allow for transforming application data into UI views.

This app follows the React Redux convention of using "Containers" which may be connected to the Redux store and/or action creators via [React-Redux](https://github.com/reactjs/react-redux). Non-container, or "Presentational" components, receive data from Containers or parent components as props, and only use Component level state for either trivial UI changes, eg: tracking whether or not a UI panel is collapsed or opened; or for further data munging specific to that component and its child components. The [LineChartContainer](src/components/LineCharts/LineChartsContainer.jsx) (_not actually a **container** component, sorry for the confusion!_) and  [DotGridWrapper](src/containers/DotGridWrapper.jsx) components are examples of the latter.

- [`presentational components`](./src/components/)
- [`container components`](./src/containers/)

Within the `src/components` directory, components are organized by related parts of the UI. For example, the `src/components/Legend/` directory contains components that are specific to the Legend. The Legend is imported into the `App` container via the `src/components/Legend/index.js`.

The main scaffolding and layout of the app resides within `src/containers/App.jsx`.

The app is connected to Redux via `react-redux`'s `<Provider>` component within `./src/ReduxEntry.jsx`.

The entry point (`src/index.js`) makes use of `react-dom`'s `render()` method to inject the entire app into the DOM. It is configured for [Webpack's Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) so that upon making changes the DOM will update without a full page reload, though sometimes a full page reload is necessary for changes to take place.

##### React Component Tree:
The following describes how React Components are nested within the app:

- App\*

  - Header/index
    - HeaderTitle
    - Menu\*

  - Sidebar/index
    - SelectAreasController
      - SelectAreasList\*
    - OptionsContainer
    - FilterByType\*
    - FilterByBoundary\*

  - LineChartsContainer
    - ReferenceEntitySelect\*
    - LineChartWrapper\*
      - LineChart
      - LineChartTitle

  - DotGridChartsContainer
    - DotGridWrapper\*
      - DotGridChart
      - DotGridTitle

  - RankCards/index
    - RankCardsList\*
      - RankCard

  - TimeLine\*
    - TimeLineD3

  - RankCardsControls

  - Legend\*
    - index
      - CompareLegend
      - EntitySelections
        - EntitySelector
      - Logos

  - Message

  - About

_\* means Component is a **container**_


##### A Word on React-Redux Implementation
In writing this web app I have not followed the Container & Presentational Component paradigm strictly in the sense that most of the **container** components contain mark up (JSX). My rationale for this is that it can be annoying to rename a component after connecting it to Redux, [although sometimes this is necessary](./src/containers/LineChartWrapper.jsx). In the Redux docs, an example of this is calling the `TodoList` component `VisibleTodoList`. The latter is essentially a wrapper around the former component, and while this makes sense semantically I found it burdensome to do this for each component that is connected to Redux.

#### Integration with D3
The charts in this app make extensive use of [D3.JS](https://d3js.org). Combining D3 and React can prove to be a non-trivial task. There are generally two ways to approach it.

The first involves using a `ref` on an `svg` element in the React component, then doing the D3 DOM manipulation work in React's `componentDidMount()` and `componentDidUpdate()` lifecycle hooks. This method is employed by the `LineChart` component, as it uses D3's transitions which interpolate between data changes and allow for smooth animations. Listening for relevant changes to `props` and/or `state` in `componentDidUpdate()` will invoke functions that use D3 to update the chart.

The other method of using React and D3 is somewhat simpler as it involves only using D3 for calculating properties and letting React render the chart. Both the `DotGridChart` and `RankCard` Components use this method. For example, an [`svg` `path` string](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) generated by D3 is handed to the `RankCard` component as a prop, but React handles rendering the actual `svg` `path` element using that string. The trade off with this method is that because React handles the rendering of the chart elements we can't use D3's transitions for animating data updates.

#### Shared Variables
It can be helpful to have a single source of truth for values that are used both by JS and CSS, so that they don't have to be remembered to be set to be the same in separate places. This is implemented via a [`styleVars`](./src/common/styleVars.js) and Webpack plugin. Note that if you alter the values in `styleVars` you will need to restart the Webpack dev server for the changes to be picked up by CSS/SCSS.

#### Using Static Assets
The `assets/` directory is available for Webpack to include static assets such as images, icons, etc. The Webpack Dev Server should resolve file paths just by doing `assets/filename.png` in your code (e.g. for the `src` attribute of an image tag). When doing `npm run build` the `CopyWebpackPlugin` will copy the `assets/` directory to `dist/assets` for you.

#### Skeleton SCSS Framework
This setup uses a [SASS/SCSS port](https://github.com/WhatsNewSaes/Skeleton-Sass) of the [Skeleton CSS Framework](http://getskeleton.com/).

In `scss/skeleton/skeleton.scss` file you may specify which parts of Skeleton you wish to use.

### CARTO Integration and SQL Queries
This app uses CARTO's SQL API to load all data. Unlike the `nyc-crash-mapper` map app, this app only makes use of two SQL queries. One groups data by date and geography type, while the other for "Citywide" only groups data by date.

See [`sqlQueries`](./src/common/sqlQueries.js) and note that the **tagged template literals** will convert the multiline SQL queries into a single line string, removing extra white space, new line characters, etc.

See the [`asyncAction creators`](./src/actions/asyncActions.js) for how the app requests data from the CARTO SQL API. Note that the [`redux-thunk` middleware](https://github.com/gaearon/redux-thunk) is used so that the Redux properly updates the store's state from asynchronous tasks.

The CARTO account name is specified in the app's [`config file`](./src/common/config.js).

### Linting and Code Formatting
ESLint, Prettier, and StyleLint are used to maintain code consistency and prevent bugs. ESLint and Prettier rules are specified in `.eslintrc` and `.prettierignore`. If you use a text editor plugin for `prettier` your code will automatically be formatted when you save. StyleLint will yell at you if your CSS/SCSS gets messy or if you ignore something specified in `.stylelintrc.json`.

### Webpack Config Notes
Note that there are two separate Webpack config files, one used for local development with the `webpack-dev-server` and another for production / deployment.

In addition to the Webpack configuration from the `gin-static-site-starter`, the `svgr` library allows for loading SVG files as React Components. This gives the benefit to pass along props to SVG, giving you greater control over them in JSX.
