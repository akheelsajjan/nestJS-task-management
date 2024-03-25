/* eslint-disable prettier/prettier */
import { IsEnum } from 'class-validator'
import { TaskStatus } from '../task-status.enum.model'

export class updateTaskDto{
    @IsEnum(TaskStatus)
    status:TaskStatus
}