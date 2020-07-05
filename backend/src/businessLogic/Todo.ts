import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/TodoAccess'
import { parseUserId } from '../auth/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'

const uuidv4 = require('uuid/v4')
const toDoAccess = new TodoAccess()

const s3BucketName = process.env.BUCKET_NAME

export async function getAllTodo (jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return toDoAccess.getAllTodo(userId)
}

export function createTodo (
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId = parseUserId(jwtToken)
  const id = uuidv4()
  return toDoAccess.createTodo({
    userId: userId,
    todoId: id,
    createdAt: new Date().getTime().toString(),
    done: false,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${id}`,
    ...createTodoRequest
  })
}

export function updateTodo (
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  jwtToken: string
): Promise<TodoUpdate> {
  const userId = parseUserId(jwtToken)
  return toDoAccess.updateTodo(updateTodoRequest, todoId, userId)
}

export function deleteTodo (todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken)
  return toDoAccess.deleteTodo(todoId, userId)
}

export function generateUploadUrl (todoId: string): Promise<string> {
  return toDoAccess.generateUploadUrl(todoId)
}
