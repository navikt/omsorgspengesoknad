import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';

interface Props {
    navn: string;
}

const VelkommenGuide: React.FunctionComponent<Props> = ({ navn }) => (
    <CounsellorPanel>
        <Systemtittel tag="h1">
            <FormattedMessage id="page.velkommen.guide.tittel" values={{ navn }} />
        </Systemtittel>
        <Box margin="l">
            <Ingress>
                <FormattedMessage id="page.velkommen.guide.ingress" />
            </Ingress>
        </Box>
        <FormattedMessage id="page.velkommen.guide.tekst.1" tagName="p" />
        <FormattedMessage id="page.velkommen.guide.tekst.2" tagName="p" />
    </CounsellorPanel>
);

export default VelkommenGuide;
