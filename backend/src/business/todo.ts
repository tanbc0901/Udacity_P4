import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils'
import { TodoAccess } from '../datalayer/todoAccess'

const todosAcess = new TodoAccess();

export const getAllTodosByUserId = async (jwtToken: string): Promise<TodoItem[]> => {
    const userId = parseUserId(jwtToken);
    return await todosAcess.getAllTodosByUserId(userId);
}

export const createTodo = async (createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> => {
    const userId = parseUserId(jwtToken);
    const todoId = uuid.v4();
    const newItem = {
        userId,
        todoId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        createdAt: new Date().toISOString()
    };
    return await todosAcess.createTodo(newItem);
}
export const updateTodo = async (updateTodoRequest: UpdateTodoRequest, jwtToken: string, todoId: string): Promise<void> => {
    const userId = parseUserId(jwtToken);
    const updatedItem = {
        userId,
        todoId,
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done,
        createdAt: new Date().toISOString()
    };
    await todosAcess.updateTodo(updatedItem);
}

export const deleteTodo = async (todoId: string, jwtToken: string): Promise<void> => {
    const userId = parseUserId(jwtToken);
    await todosAcess.deleteTodo(todoId, userId);
}

export const getSignedUploadUrl = async (todoId: string, userId: string): Promise<string> => {
    return todosAcess.getSignedUploadUrl(todoId, userId);
}