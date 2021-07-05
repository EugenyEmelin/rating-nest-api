import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose/lib/types';
import { CreateReviewDto } from './dto/create-review.dto';
import { mongoose } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(ReviewModel) private readonly reviewModel: ReturnModelType<typeof ReviewModel>) {}

  async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
    return this.reviewModel.create(dto)
  }

  async remove(id: string): Promise<DocumentType<ReviewModel> | null> {
    return this.reviewModel.findByIdAndDelete(id).exec()
  }

  async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
    return this.reviewModel.find({ productId: mongoose.Schema.Types.ObjectId(productId)}).exec()
  }

  async removeByProductId(productId: string) {
    return this.reviewModel.deleteMany({
      productId: mongoose.Schema.Types.ObjectId(productId).exec()
    })
  }
}
