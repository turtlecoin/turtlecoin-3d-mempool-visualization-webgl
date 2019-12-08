# A 3D Mempool Visualization for TurtleCoin

Just want to see it running? Here it is:

<http://mempool3d.extrahash.org/>

## Development Setup

### Dependencies

- nodejs
- yarn

### Setup

- Clone the repo:

```shell
git clone https://github.com/turtlecoin/turtlecoin-3d-mempool-visualization-webgl
```

- Install the dependencies:

```shell
cd turtlecoin-3d-mempool-visualization-webgl
yarn
```

- Start the project:

```shell
yarn start
```

The project will open in your browser. Make changes to the code and watch your changes appear live.

To create a production build, use `yarn build`. The files will be outputted into the `./build` directory, which can then be hosted by any web server of your choice. For example, using `serve` which can be installed from the npm package registry:

```shell
yarn global add serve
serve -s build
```
