import {
    AppFormField,
    OmsorgspengesøknadFormData,
    SøkersRelasjonTilBarnet
} from '../../types/OmsorgspengesøknadFormData';
import { mapFormDataToApiData } from '../mapFormDataToApiData';
import { OmsorgspengesøknadApiData } from '../../types/OmsorgspengesøknadApiData';
import * as dateUtils from '../../../common/utils/dateUtils';
import * as attachmentUtils from '../../../common/utils/attachmentUtils';
import { YesOrNo } from '../../../common/types/YesOrNo';
import { BarnReceivedFromApi } from '../../types/Søkerdata';
import { isFeatureEnabled } from '../featureToggleUtils';
import { Attachment } from '../../../common/types/Attachment';

const moment = require('moment');

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {}
}));

const todaysDate = moment()
    .startOf('day')
    .toDate();

const barnMock: BarnReceivedFromApi[] = [
    { fodselsdato: todaysDate, fornavn: 'Mock', etternavn: 'Mocknes', aktoer_id: '123' }
];

type AttachmentMock = Attachment & { failed: boolean };
const attachmentMock1: Partial<AttachmentMock> = { url: 'nav.no/1', failed: true };
const attachmentMock2: Partial<AttachmentMock> = { url: 'nav.no/2', failed: false };

const formDataMock: Partial<OmsorgspengesøknadFormData> = {
    [AppFormField.barnetsNavn]: 'Ola Foobar',
    [AppFormField.harBekreftetOpplysninger]: true,
    [AppFormField.harForståttRettigheterOgPlikter]: true,
    [AppFormField.søkersRelasjonTilBarnet]: SøkersRelasjonTilBarnet.MOR,
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.YES,
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.NO,
    [AppFormField.periodeFra]: todaysDate,
    [AppFormField.periodeTil]: moment(todaysDate)
        .add(1, 'day')
        .toDate(),
    [AppFormField.legeerklæring]: [attachmentMock1 as AttachmentMock, attachmentMock2 as AttachmentMock]
};

jest.mock('../../../common/utils/dateUtils', () => {
    return {
        formatDate: jest.fn((date: Date) => date.toDateString())
    };
});

jest.mock('../../../common/utils/attachmentUtils', () => {
    return {
        attachmentUploadHasFailed: jest.fn((attachment: AttachmentMock) => attachment.failed)
    };
});

describe('mapFormDataToApiData', () => {
    let resultingApiData: OmsorgspengesøknadApiData;

    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => false);
        resultingApiData = mapFormDataToApiData(formDataMock as OmsorgspengesøknadFormData, barnMock, 'nb');
    });

    it("should set 'barnetsNavn' in api data correctly", () => {
        expect(resultingApiData.barn.navn).toEqual(formDataMock[AppFormField.barnetsNavn]);
    });

    it("should set 'relasjon_til_barnet' in api data correctly", () => {
        expect(resultingApiData.relasjon_til_barnet).toEqual(formDataMock[AppFormField.søkersRelasjonTilBarnet]);
    });

    it("should set 'medlemskap.skal_bo_i_utlandet_neste_12_mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.skal_bo_i_utlandet_neste_12_mnd).toBe(false);
    });

    it("should set 'medlemskap.har_bodd_i_utlandet_siste_12_mnd' in api data correctly", () => {
        expect(resultingApiData.medlemskap.har_bodd_i_utlandet_siste_12_mnd).toBe(true);
    });

    it("should set 'fra_og_med' in api data correctly", () => {
        expect(dateUtils.formatDate).toHaveBeenCalledWith(formDataMock[AppFormField.periodeFra]);
        expect(resultingApiData.fra_og_med).toEqual(dateUtils.formatDate(formDataMock[AppFormField.periodeFra]!));
    });

    it("should set 'til_og_med' in api data correctly", () => {
        expect(dateUtils.formatDate).toHaveBeenCalledWith(formDataMock[AppFormField.periodeTil]);
        expect(resultingApiData.til_og_med).toEqual(dateUtils.formatDate(formDataMock[AppFormField.periodeTil]!));
    });

    it("should set 'vedlegg' in api data correctly by only including the urls of attachments that have been successfully uploaded", () => {
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock1);
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock2);
        expect(resultingApiData.vedlegg).toHaveLength(1);
        expect(resultingApiData.vedlegg[0]).toEqual(attachmentMock2.url);
    });

    it("should set 'fodselsnummer' in api data to undefined if it doesnt exist, and otherwise it should assign value to 'fodselsnummer' in api data", () => {
        const fnr = '12345123456';
        expect(resultingApiData.barn.fodselsnummer).toBeNull();
        const formDataWithFnr: Partial<OmsorgspengesøknadFormData> = {
            ...formDataMock,
            [AppFormField.barnetsFødselsnummer]: fnr
        };
        const result = mapFormDataToApiData(formDataWithFnr as OmsorgspengesøknadFormData, barnMock, 'nb');
        expect(result.barn.fodselsnummer).toEqual(fnr);
    });

    it("should set 'alternativ_id' in api data to undefined if it doesnt exist, and otherwise it should assign value to 'alternativ_id' in api data", () => {
        const fnr = '12345123456';
        expect(resultingApiData.barn.alternativ_id).toBeNull();
        const formDataWithFnr: Partial<OmsorgspengesøknadFormData> = {
            ...formDataMock,
            [AppFormField.barnetsForeløpigeFødselsnummerEllerDNummer]: fnr
        };
        const result = mapFormDataToApiData(formDataWithFnr as OmsorgspengesøknadFormData, barnMock, 'nb');
        expect(result.barn.alternativ_id).toEqual(fnr);
    });

    it("should assign fnr to 'fodselsnummer' in api data, and set 'alternativ_id' to undefined, if both barnetsFødselsnummer and barnetsForeløpigeFødselsnummerEllerDNummer has values", () => {
        const fnr = '12345123456';
        expect(resultingApiData.barn.alternativ_id).toBeNull();
        const formDataWithFnr: Partial<OmsorgspengesøknadFormData> = {
            ...formDataMock,
            [AppFormField.barnetsFødselsnummer]: fnr,
            [AppFormField.barnetsForeløpigeFødselsnummerEllerDNummer]: fnr
        };
        const result = mapFormDataToApiData(formDataWithFnr as OmsorgspengesøknadFormData, barnMock, 'nb');
        expect(result.barn.alternativ_id).toBeNull();
        expect(result.barn.fodselsnummer).toEqual(fnr);
    });

    it('should set har_bekreftet_opplysninger to value of harBekreftetOpplysninger in form data', () => {
        expect(resultingApiData.har_bekreftet_opplysninger).toBe(formDataMock[AppFormField.harBekreftetOpplysninger]);
    });

    it('should set har_forstått_rettigheter_og_plikter to value of harForståttRettigheterOgPlikter in form data', () => {
        expect(resultingApiData.har_forstatt_rettigheter_og_plikter).toBe(
            formDataMock[AppFormField.harForståttRettigheterOgPlikter]
        );
    });
});
