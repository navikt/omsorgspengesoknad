import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import * as attachmentUtils from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { Barn } from '../../types/Barn';
import dayjs from 'dayjs';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormField, SoknadFormData, SøkersRelasjonTilBarnet } from '../../types/SoknadFormData';
import { mapFormDataToApiData } from '../mapFormDataToApiData';

const todaysDate = dayjs().startOf('day').toDate();

const barnMock: Barn[] = [{ fødselsdato: todaysDate, fornavn: 'Mock', etternavn: 'Mocknes', aktørId: '123' }];

type AttachmentMock = Attachment & { failed: boolean };
const attachmentMock1: Partial<AttachmentMock> = { url: 'nav.no/1', failed: true };
const attachmentMock2: Partial<AttachmentMock> = { url: 'nav.no/2', failed: false };
const attachmentMock3: Partial<AttachmentMock> = { url: 'nav.no/3', failed: false };

const formDataMock: Partial<SoknadFormData> = {
    [SoknadFormField.barnetsNavn]: 'Ola Foobar',
    [SoknadFormField.harBekreftetOpplysninger]: true,
    [SoknadFormField.harForståttRettigheterOgPlikter]: true,
    [SoknadFormField.søkersRelasjonTilBarnet]: SøkersRelasjonTilBarnet.MOR,
    [SoknadFormField.legeerklæring]: [attachmentMock1 as AttachmentMock, attachmentMock2 as AttachmentMock],
    [SoknadFormField.samværsavtale]: [attachmentMock3 as AttachmentMock],
};

jest.mock('@navikt/sif-common-core/lib/utils/dateUtils', () => {
    return {
        formatDate: jest.fn((date: Date) => date.toDateString()),
    };
});

jest.mock('@navikt/sif-common-core/lib/utils/attachmentUtils', () => {
    return {
        attachmentUploadHasFailed: jest.fn((attachment: AttachmentMock) => attachment.failed),
    };
});

describe('mapFormDataToApiData', () => {
    let resultingApiData: SoknadApiData;
    (window as any).appSettings = {
        API_URL: 'http://localhost:8088',
        FRONTEND_VEDLEGG_URL: 'http://localhost:8080/api',
    };
    beforeAll(() => {
        resultingApiData = mapFormDataToApiData(formDataMock as SoknadFormData, barnMock, 'nb');
    });

    it("should set 'barnetsNavn' in api data correctly", () => {
        expect(resultingApiData.barn.navn).toEqual(formDataMock[SoknadFormField.barnetsNavn]);
    });

    it("should set 'relasjonTilBarnet' in api data correctly", () => {
        expect(resultingApiData.relasjonTilBarnet).toEqual(formDataMock[SoknadFormField.søkersRelasjonTilBarnet]);
    });

    it("should set 'vedlegg' in api data correctly by only including the urls of attachments that have been successfully uploaded", () => {
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock1);
        expect(attachmentUtils.attachmentUploadHasFailed).toHaveBeenCalledWith(attachmentMock2);
        expect(resultingApiData.legeerklæring).toHaveLength(1);
        expect(resultingApiData.legeerklæring[0]).toEqual(attachmentMock2.url);
    });

    it("should set 'fødselsnummer' in api data to undefined if it doesnt exist, and otherwise it should assign value to 'fødselsnummer' in api data", () => {
        const fnr = '12345123456';
        expect(resultingApiData.barn.norskIdentifikator).toBeNull();
        const formDataWithFnr: Partial<SoknadFormData> = {
            ...formDataMock,
            [SoknadFormField.barnetsFødselsnummer]: fnr,
        };
        const result = mapFormDataToApiData(formDataWithFnr as SoknadFormData, barnMock, 'nb');
        expect(result.barn.norskIdentifikator).toEqual(fnr);
    });

    it('should set harBekreftetOpplysninger to value of harBekreftetOpplysninger in form data', () => {
        expect(resultingApiData.harBekreftetOpplysninger).toBe(formDataMock[SoknadFormField.harBekreftetOpplysninger]);
    });

    it('should set har_forstått_rettigheter_og_plikter to value of harForståttRettigheterOgPlikter in form data', () => {
        expect(resultingApiData.harForståttRettigheterOgPlikter).toBe(
            formDataMock[SoknadFormField.harForståttRettigheterOgPlikter]
        );
    });
});
