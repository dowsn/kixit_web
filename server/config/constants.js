import appRoot from 'app-root-path';
import path from 'path';
import { fileURLToPath } from 'url';

// SETTING APP CONSTANTS
let constants = {};

constants.__filename = fileURLToPath(import.meta.url);
constants.__dirname = path.resolve(path.dirname(constants.__filename), '..');
constants.pageName = 'kixit';

constants.rootPath = appRoot.path;

export default constants;
