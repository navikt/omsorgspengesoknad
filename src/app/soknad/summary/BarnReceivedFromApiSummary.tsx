import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { Barn } from '../../types/Barn';

interface Props {
    barn: Barn[];
    barnetSøknadenGjelder: string;
}

const BarnRecveivedFormSApiSummary: React.FunctionComponent<Props> = ({ barn, barnetSøknadenGjelder }) => {
    const barnReceivedFromApi = barn.find(({ aktørId }) => aktørId === barnetSøknadenGjelder);
    return barnReceivedFromApi ? (
        <>
            <Normaltekst>
                <FormattedMessage
                    id="steg.oppsummering.barnet.navn"
                    values={{
                        navn: formatName(
                            barnReceivedFromApi.fornavn,
                            barnReceivedFromApi.etternavn,
                            barnReceivedFromApi.mellomnavn
                        ),
                    }}
                />
            </Normaltekst>
            <Normaltekst>
                <FormattedMessage
                    id="steg.oppsummering.barnet.fødselsdato"
                    values={{
                        dato: prettifyDate(barnReceivedFromApi.fødselsdato),
                    }}
                />
            </Normaltekst>
        </>
    ) : null;
};

export default BarnRecveivedFormSApiSummary;
