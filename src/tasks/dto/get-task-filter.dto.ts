/* eslint-disable prettier/prettier */
import { TaskStatus} from "../task-status.enum.model";
import { IsEnum, IsOptional } from 'class-validator'

export class GetTasksFilterDto{
    @IsOptional()
    @IsEnum(TaskStatus)
    status?:TaskStatus;

    @IsOptional()
    search?:string;
}