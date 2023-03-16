import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { document } from 'src/utils/dynamodbClient';

interface ICreateTodo {
    title: string;
    deadline: Date
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { title, deadline } = JSON.parse(event.body) as ICreateTodo
    const { userid } = event.pathParameters

   

    const todoList = {
        id: randomUUID(),
        user_id: userid,
        title,
        done: false,
        deadline: dayjs(deadline).format()
    };

 
    await document
      .put({
        TableName: "todo_list",
        Item: todoList,
      })
      .promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
          message: "Todo created",
          todo_info: todoList
        })
    } 
  
}