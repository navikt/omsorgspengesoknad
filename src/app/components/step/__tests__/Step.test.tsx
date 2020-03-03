import { render, RenderResult } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router';
import IntlProvider from 'app/components/intl-provider/IntlProvider';
import { getStepConfig, StepID } from '../../../config/stepConfig';
import Step from '../Step';

jest.mock('../../../utils/featureToggleUtils', () => {
    return {
        isFeatureEnabled: () => false,
        Feature: {}
    };
});

const renderWrappedInMemoryRouter = (child: React.ReactNode) =>
    render(
        <IntlProvider locale="nb" onError={() => null}>
            <MemoryRouter>{child}</MemoryRouter>
        </IntlProvider>
    );

describe('<Step>', () => {
    const stepID: StepID = StepID.OPPLYSNINGER_OM_BARNET;
    let renderResult: RenderResult;

    beforeAll(() => {
        renderResult = renderWrappedInMemoryRouter(<Step id={stepID} stepConfig={getStepConfig()} />);
    });

    it('should render common <Step> content', () => {
        const { getByText } = renderResult;
        expect(getByText('Søknad om ekstra omsorgsdager')).toBeTruthy();
        expect(getByText('Barn')).toBeTruthy();
    });
});
