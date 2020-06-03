const process = require('process');
const fsExtra = require('fs-extra');

// Used by ~/server.js, ~/src/build/scripts/start-dev.js and start-dev-no-decorator.js
const createEnvSettingsFile = async (settingsFile) => {
    // See .env, nais/dev-sbs.yml and nais/prod-sbs.yml
    const API_URL = process.env.API_URL;
    const LOGIN_URL = process.env.LOGIN_URL;
    const PUBLIC_PATH = process.env.PUBLIC_PATH;
    const UTILGJENGELIG = process.env.UTILGJENGELIG;

    const appSettings = `
    window.appSettings = {
        API_URL: '${API_URL}',
        LOGIN_URL: '${LOGIN_URL}',
        PUBLIC_PATH: '${PUBLIC_PATH}',
        UTILGJENGELIG: '${UTILGJENGELIG}'
    };`
        .trim()
        .replace(/ /g, '');

    try {
        await fsExtra.ensureFile(settingsFile);
        fsExtra.writeFileSync(settingsFile, `${appSettings}`); // => dist/js/settings.js, and used by dist/dev/index.html
    } catch (e) {
        console.error(e);
    }
};

module.exports = createEnvSettingsFile;
