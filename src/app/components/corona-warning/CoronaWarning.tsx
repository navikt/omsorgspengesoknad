import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { Undertittel } from 'nav-frontend-typografi';

interface Props {}

const CoronaWarning: React.FunctionComponent<Props> = (props) => (
    <div style={{ margin: '0 auto', maxWidth: '50rem', lineHeight: '1.5rem' }}>
        <AlertStripeInfo>
            <Box padBottom="m">
                <Undertittel>Omsorgsdager og koronaviruset</Undertittel>
            </Box>
            <p style={{ marginTop: 0, marginBottom: '1rem' }}>
                Hvis du er arbeidstaker, selvstendig næringsdrivende eller frilanser kan du bruke omsorgsdager{' '}
                <Lenke href="https://www.nav.no/no/person/innhold-til-person-forside/nyttig-a-vite/stengte-skoler-og-barnehager-gir-rett-til-omsorgspenger">
                    når du må være hjemme med barn fordi skole eller barnehage har stengt
                </Lenke>
                .
            </p>
            <p style={{ marginBottom: '1rem' }}>
                Som arbeidstaker er det din arbeidsgiver som skal utbetale omsorgsdager til deg.
            </p>
            <p style={{ marginBottom: '1rem' }}>
                Som selvstendig næringsdrivende eller frilanser kan du i{' '}
                <Lenke href="https://www.nav.no/familie/sykdom-i-familien/nb/omsorgspenger#Slik-tar-du-ut-omsorgsdager">
                    noen tilfeller få utbetaling fra NAV
                </Lenke>
                .
            </p>
            <p style={{ marginBottom: '1rem' }}>
                <Lenke href="https://www.nav.no/familie/sykdom-i-familien/nb/ofte-stilte-sporsmal-om-koronaviruset-og-bruk-av-omsorgsdager">
                    Ofte stilte spørsmål om koronaviruset og bruk av omsorgsdager
                </Lenke>
            </p>
        </AlertStripeInfo>
    </div>
);

export default CoronaWarning;
