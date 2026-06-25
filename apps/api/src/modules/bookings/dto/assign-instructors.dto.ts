import { IsArray, IsUUID } from 'class-validator'

export class AssignInstructorsDto {
  @IsArray()
  @IsUUID('4', { each: true, message: 'Cada instructor_id debe ser un UUID válido' })
  instructor_ids: string[]
}
