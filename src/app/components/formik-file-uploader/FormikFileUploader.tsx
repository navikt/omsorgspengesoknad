import * as React from 'react';
import { Attachment, PersistedFile } from '@navikt/sif-common-core/lib/types/Attachment';
import * as apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import {
    attachmentShouldBeProcessed,
    attachmentShouldBeUploaded,
    attachmentUploadHasFailed,
    getPendingAttachmentFromFile,
    isFileObject,
    mapFileToPersistedFile,
    VALID_EXTENSIONS,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { TypedFormInputValidationProps } from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArrayHelpers, useFormikContext } from 'formik';
import api from '../../api/api';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { ApiEndpoint } from '../../types/ApiEndpoint';
import { getAttachmentURLFrontend } from '../../utils/attachmentUtilsAuthToken';

export type FieldArrayReplaceFn = (index: number, value: any) => void;
export type FieldArrayPushFn = (obj: any) => void;
export type FieldArrayRemoveFn = (index: number) => undefined;

interface Props extends TypedFormInputValidationProps<SoknadFormField, ValidationError> {
    name: SoknadFormField;
    label: string;
    onFileInputClick?: () => void;
    onErrorUploadingAttachments: (files: File[]) => void;
    onUnauthorizedOrForbiddenUpload: () => void;
}

const FormikFileUploader: React.FunctionComponent<Props> = ({
    name,
    onFileInputClick,
    onErrorUploadingAttachments,
    onUnauthorizedOrForbiddenUpload,
    ...otherProps
}) => {
    const { values } = useFormikContext<SoknadFormData>();
    async function uploadAttachment(attachment: Attachment) {
        const { file } = attachment;
        if (isFileObject(file)) {
            try {
                const response = await api.uploadFile(ApiEndpoint.VEDLEGG, file);
                attachment = setAttachmentPendingToFalse(attachment);
                attachment.url = getAttachmentURLFrontend(response.headers.location);
                attachment.uploaded = true;
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    onUnauthorizedOrForbiddenUpload();
                }
                setAttachmentPendingToFalse(attachment);
            }
        }
    }

    async function uploadAttachments(allAttachments: Attachment[], replaceFn: FieldArrayReplaceFn) {
        const attachmentsToProcess = findAttachmentsToProcess(allAttachments);
        const attachmentsToUpload = findAttachmentsToUpload(attachmentsToProcess);
        const attachmentsNotToUpload = attachmentsToProcess.filter((el) => !attachmentsToUpload.includes(el));

        for (const attachment of attachmentsToUpload) {
            await uploadAttachment(attachment);
            updateAttachmentListElement(allAttachments, attachment, replaceFn);
        }

        const failedAttachments = [...attachmentsNotToUpload, ...attachmentsToUpload.filter(attachmentUploadHasFailed)];
        updateFailedAttachments(allAttachments, failedAttachments, replaceFn);
    }

    function updateFailedAttachments(
        allAttachments: Attachment[],
        failedAttachments: Attachment[],
        replaceFn: FieldArrayReplaceFn
    ) {
        failedAttachments.forEach((attachment) => {
            attachment = setAttachmentPendingToFalse(attachment);
            updateAttachmentListElement(allAttachments, attachment, replaceFn);
        });
        const failedFiles: File[] = failedAttachments
            .map(({ file }) => file)
            .filter((f: File | PersistedFile) => isFileObject(f)) as File[];

        onErrorUploadingAttachments(failedFiles);
    }

    function findAttachmentsToProcess(attachments: Attachment[]): Attachment[] {
        return attachments.filter(attachmentShouldBeProcessed);
    }

    function findAttachmentsToUpload(attachments: Attachment[]): Attachment[] {
        return attachments.filter(attachmentShouldBeUploaded);
    }

    function updateAttachmentListElement(
        attachments: Attachment[],
        attachment: Attachment,
        replaceFn: FieldArrayReplaceFn
    ) {
        replaceFn(attachments.indexOf(attachment), { ...attachment, file: mapFileToPersistedFile(attachment.file) });
    }

    function setAttachmentPendingToFalse(attachment: Attachment) {
        attachment.pending = false;
        return attachment;
    }

    function addPendingAttachmentToFieldArray(file: File, pushFn: FieldArrayPushFn) {
        const attachment = getPendingAttachmentFromFile(file);
        pushFn(attachment);
        return attachment;
    }

    return (
        <SoknadFormComponents.FileInput
            name={name}
            acceptedExtensions={VALID_EXTENSIONS.join(', ')}
            onFilesSelect={async (files: File[], { push, replace }: ArrayHelpers) => {
                const attachments = files.map((file) => addPendingAttachmentToFieldArray(file, push));
                await uploadAttachments([...(values as any)[name], ...attachments], replace);
            }}
            onClick={onFileInputClick}
            {...otherProps}
        />
    );
};

export default FormikFileUploader;
