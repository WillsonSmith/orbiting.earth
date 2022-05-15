// Require for extension window.
import { initializeExtensionScript } from './utilities/initialize.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '../shared/web-components/page-header/page-header.js';
import '../shared/web-components/colorize-word/colorize-word.js';

// Initialization.
setBasePath(`./vendor/modules/shoelace/dist`);
initializeExtensionScript();
