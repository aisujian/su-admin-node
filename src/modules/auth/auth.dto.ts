import { ApiTags, ApiParam, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
export class LoginDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: '用户名',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: '密码',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;
}
