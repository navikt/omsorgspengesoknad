import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import { initialValues, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import OmsorgspengesøknadContent from '../omsorgspengesøknad-content/OmsorgspengesøknadContent';

const Omsorgspengesøknad: React.FunctionComponent = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(formdata: Partial<OmsorgspengesøknadFormData>) => {
            return (
                <TypedFormikWrapper<OmsorgspengesøknadFormData>
                    initialValues={formdata || initialValues}
                    onSubmit={() => {
                        null;
                    }}
                    renderForm={() => <OmsorgspengesøknadContent />}
                />
            );
        }}
    />
);

export default Omsorgspengesøknad;
