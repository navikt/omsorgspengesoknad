import React from 'react';
import Box from '@navikt/sif-common/lib/common/components/box/Box';

type BoxMargin = 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl' | 'none';

interface Props {
    margin?: BoxMargin;
    paddingBottom?: BoxMargin;
}

const FormBox: React.FunctionComponent<Props> = ({ margin = 'xl', paddingBottom, children }) => (
    <Box margin={margin} padBottom={paddingBottom}>
        {children}
    </Box>
);

export default FormBox;
