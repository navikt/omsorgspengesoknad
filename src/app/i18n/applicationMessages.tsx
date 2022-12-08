import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import soknadErrorIntlMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/soknadErrorIntlMessages';
import soknadIntlMessages from '@navikt/sif-common-soknad/lib/soknad-intl-messages/soknadIntlMessages';
import { velkommenPageMessages } from '../pages/velkommen-page/velkommenPageMessages';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';

export const appBokmålstekster = require('./nb.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appBokmålstekster,
    ...soknadErrorIntlMessages.nb,
    ...soknadIntlMessages.nb,
    ...velkommenPageMessages.nb,
};

const getIntlMessages = (): MessageFileFormat => {
    if (isFeatureEnabled(Feature.NYNORSK)) {
        return {
            nb: bokmålstekster,
        };
    } else {
        return {
            nb: bokmålstekster,
        };
    }
};

export const applicationIntlMessages = getIntlMessages();
