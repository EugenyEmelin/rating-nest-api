import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoURI(configService),
    ...getMongoOptions(),
  };
};

function getMongoURI(configService: ConfigService) {
  const login = configService.get('MONGO_LOGIN');
  const password = configService.get('MONGO_PASSWORD');
  const host = configService.get('MONGO_HOST');
  const port = configService.get('MONGO_PORT');
  const authDB = configService.get('MONGO_AUTH_DB');

  return `mongodb://${login}:${password}@${host}:${port}/${authDB}`;
}

function getMongoOptions() {
  return {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };
}
