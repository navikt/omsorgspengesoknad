import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';

const CoronaWarning = () => (
    <div style={{ margin: '0 auto', maxWidth: '50rem', lineHeight: '1.5rem' }}>
        <AlertStripeInfo>
            <Box padBottom="m">
                <Undertittel>Omsorgsdager og koronaviruset</Undertittel>
            </Box>
            <p style={{ marginTop: 0, marginBottom: '1rem' }}>
                Stortinget vedtok endringer i regelverket for omsorgspenger 20.03.20.
            </p>
            <p>
                Det ble vedtatt å doble antall omsorgsdager frem til 31.12.20. Disse dagene får du automatisk, du skal
                altså ikke søke om dem.
            </p>
        </AlertStripeInfo>
    </div>
);

export default CoronaWarning;
