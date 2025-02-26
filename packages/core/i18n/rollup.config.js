import { createRollupConfig } from '../../../config/rollup';

const pkg = require('./package.json');
export default createRollupConfig({
  pkg,
});
