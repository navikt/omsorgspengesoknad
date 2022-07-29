import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import soknadErrorIntlMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/soknadErrorIntlMessages';
import soknadIntlMessages from '@navikt/sif-common-soknad/lib/soknad-intl-messages/soknadIntlMessages';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';

export const appBokmålstekster = require('./nb.json');
export const appNynorsktekster = require('./nn.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appBokmålstekster,
    ...soknadErrorIntlMessages.nb,
    ...soknadIntlMessages.nb,
};
const nynorsktekster = {
    ...allCommonMessages.nn,
    ...appNynorsktekster,
    ...soknadErrorIntlMessages.nn,
    ...soknadIntlMessages.nn,
};

const getIntlMessages = (): MessageFileFormat => {
    if (isFeatureEnabled(Feature.NYNORSK)) {
        return {
            nb: bokmålstekster,
            nn: nynorsktekster,
        };
    } else {
        return {
            nb: bokmålstekster,
        };
    }
};

export const applicationIntlMessages = getIntlMessages();
