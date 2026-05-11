import { IsEmail, IsString, MinLength, IsIn } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  full_name!: string

  @IsEmail({}, { message: 'Email inválido' })
  email!: string

  @IsString()
  @MinLength(8, { message: 'Mínimo 8 caracteres' })
  password!: string

  @IsIn(['admin'], { message: 'Solo se pueden crear usuarios con rol admin' })
  role!: 'admin'
}
