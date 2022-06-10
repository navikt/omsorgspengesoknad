import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { SoknadApiData } from '../../types/SoknadApiData';

interface Props {
    apiValues: SoknadApiData;
}

const AnnetBarnSummary: React.FunctionComponent<Props> = ({ apiValues }) => {
    const intl = useIntl();
    return (
        <>
            {apiValues.barn.norskIdentifikator ? (
                <Normaltekst>
                    <FormattedMessage
                        id="steg.oppsummering.barnet.fnr"
                        values={{
                            fnr: apiValues.barn.norskIdentifikator,
                        }}
                    />
                </Normaltekst>
            ) : null}
            {apiValues.barn.navn ? (
                <Normaltekst>
                    <FormattedMessage id="steg.oppsummering.barnet.navn" values={{ navn: apiValues.barn.navn }} />
                </Normaltekst>
            ) : null}
            <Normaltekst>
                <FormattedMessage
                    id="steg.oppsummering.barnet.søkersRelasjonTilBarnet"
                    values={{
                        relasjon: intlHelper(intl, `relasjonTilBarnet.${apiValues.relasjonTilBarnet}`),
                    }}
                />
            </Normaltekst>
        </>
    );
};

export default AnnetBarnSummary;
