import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { mongoose } from '@typegoose/typegoose';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'param') {
      return value
    }
    if (mongoose.Schema.Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Неверный формат id')
    }
    return value
  }
}
