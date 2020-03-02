import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { prettifyDate } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { formatName } from '@navikt/sif-common/lib/common/utils/personUtils';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';

interface Props {
    barn: BarnReceivedFromApi[];
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
                            barnReceivedFromApi!.fornavn,
                            barnReceivedFromApi!.etternavn,
                            barnReceivedFromApi!.mellomnavn
                        )
                    }}
                />
            </Normaltekst>
            <Normaltekst>
                <FormattedMessage
                    id="steg.oppsummering.barnet.fødselsdato"
                    values={{
                        dato: prettifyDate(barnReceivedFromApi!.fødselsdato)
                    }}
                />
            </Normaltekst>
        </>
    ) : null;
};

export default BarnRecveivedFormSApiSummary;
