import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { getSignedUploadUrl } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getToken, parseUserId } from '../../auth/utils'
const logger = createLogger('get-s3-url');
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Upload s3 url');
    try {
      const jwtToken = getToken(event.headers.Authorization);
      const todoId = event.pathParameters.todoId;
      const userId = parseUserId(jwtToken);
      logger.info('userId: ', userId);

      const url: string = await getSignedUploadUrl(todoId, userId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: url
        })
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
