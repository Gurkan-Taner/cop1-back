import { PartialType } from '@nestjs/mapped-types';
import { CreateCreneauDto } from './create-creneau.dto';

export class UpdateCreneauDto extends PartialType(CreateCreneauDto) {}
