import { TFile } from '@app/shared/models/file.model';

export type TGetFileDetailResponseDto = TFile;

export type TGetFileRelationResponseDto = Pick<TFile, 'name' | 'url' | 'type'>;
