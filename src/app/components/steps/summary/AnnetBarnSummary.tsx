import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { OmsorgspengesøknadApiData } from '../../../types/OmsorgspengesøknadApiData';

interface Props {
    apiValues: OmsorgspengesøknadApiData;
}

const AnnetBarnSummary: React.FunctionComponent<Props> = ({ apiValues }) => {
    const intl = useIntl();
    return (
        <>
            {apiValues.barn.fødselsdato ? (
                <Normaltekst>
                    <FormattedMessage
                        id="steg.oppsummering.barnet.fødselsdato"
                        values={{
                            dato: prettifyDate(apiStringDateToDate(apiValues.barn.fødselsdato)),
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
