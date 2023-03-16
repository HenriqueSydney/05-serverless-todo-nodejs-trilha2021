import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from 'src/utils/dynamodbClient';

export const handler: APIGatewayProxyHandler = async (event) => {
    const { userid } = event.pathParameters
   console.log(userid)

    const todoList = await document.scan({
      TableName: 'todo_list',
      FilterExpression: 'user_id = :user_id',
      ExpressionAttributeValues: {
        ':user_id': userid
      }
    }).promise();

    const todos = todoList.Items;
    console.log(todos)
    if(todos.length===0){
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Todo list was not found for user"
        })
      } 
    }

    return {
        statusCode: 201,
        body: JSON.stringify({
          message: "Success",
          todo_list: todoList
        })
    } 
  
}