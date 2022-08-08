import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { getToken } from '../../auth/utils'
import { createLogger } from "../../utils/logger";
const logger = createLogger("create-todo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('create todo');
    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body);

      const jwtToken = getToken(event.headers.Authorization);
      const newCreatedTodo = await createTodo(newTodo, jwtToken);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          item: newCreatedTodo
        })
      };
    } catch (e) {
      logger.error(e.message);
      return {
        statusCode: 500,
        body: e.message
      };
    }
    return undefined;
  }
);

handler.use(
  cors({
    credentials: true
  })
);
