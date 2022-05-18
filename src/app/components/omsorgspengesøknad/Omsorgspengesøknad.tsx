import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import { initialValues, OmsorgspengesøknadFormData } from '../../types/OmsorgspengesøknadFormData';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import OmsorgspengesøknadContent from '../omsorgspengesøknad-content/OmsorgspengesøknadContent';
import { Søkerdata } from 'app/types/Søkerdata';
import { BarnResultType } from 'app/api/api';

const Omsorgspengesøknad: React.FC = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(
            søkerdata: Søkerdata,
            barn: BarnResultType,
            formData: OmsorgspengesøknadFormData
        ): JSX.Element => {
            return (
                <TypedFormikWrapper<OmsorgspengesøknadFormData>
                    initialValues={formData || initialValues}
                    onSubmit={() => {
                        null;
                    }}
                    renderForm={() => <OmsorgspengesøknadContent søker={søkerdata.person} barn={barn.barn} />}
                />
            );
        }}
    />
);

export default Omsorgspengesøknad;
