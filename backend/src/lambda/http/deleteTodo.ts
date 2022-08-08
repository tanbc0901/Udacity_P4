import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getToken } from '../../auth/utils'
const logger = createLogger('delete-todo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('delete todo function');
    try {
      const todoId = event.pathParameters.todoId;
      const jwtToken = getToken(event.headers.Authorization);
      await deleteTodo(todoId, jwtToken);
      return {
        statusCode: 200,
        body: JSON.stringify(true)
      };
    } catch (e) {
      logger.error(e.message);
      return {
        statusCode: 500,
        body: e.message
      };
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
