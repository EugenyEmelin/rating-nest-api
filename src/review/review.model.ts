import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { mongoose, Prop } from '@typegoose/typegoose';

export interface ReviewModel extends Base {}
export class ReviewModel extends TimeStamps {
  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;

  @Prop()
  productId: mongoose.Schema.Types.ObjectId
}
