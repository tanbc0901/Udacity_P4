import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { getAllTodosByUserId } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getToken } from '../../auth/utils'

const logger = createLogger('get-todo');

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('get todo')
    try {
      const jwtToken = getToken(event.headers.Authorization);
      const todos = await getAllTodosByUserId(jwtToken);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          items: todos
        })
      };
    } catch (e) {
      logger.error('Error: ' + e.message);
      return {
        statusCode: 500,
        body: e.message
      };
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
