import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { mongoose } from '@typegoose/typegoose';
import { disconnect } from 'cluster';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = mongoose.Schema.Types.ObjectId
const loginDto: AuthDto = {
  login: 'eug',
  password: '123123'
}

const testDto: CreateReviewDto = {
  name: 'test',
  title: 'Title',
  description: 'Test description',
  rating: 5,
  productId
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)

    token = body.access_token
  });

  it('/review/create (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(200)
      .expect('Hello World!')
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      })
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  it('/review/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete('/review/' + mongoose.Schema.Types.ObjectId)
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND
      })
  })

  afterAll(() => {
    disconnect();
  })
});
