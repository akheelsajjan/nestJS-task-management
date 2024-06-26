/* eslint-disable prettier/prettier */
import {  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { updateTaskDto } from './dto/update-task-dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor( private taskService:TasksService){}

    @Get()
    getAllTasks(
        @Query() filterDto: GetTasksFilterDto,
        @GetUser() user:User
    ):Promise<Task[]>{
        return  this.taskService.getAllTask(filterDto, user);
    }

    @Post()
    createTask(
       @Body() createTaskDto:CreateTaskDto,
       @GetUser() user:User,
    ):Promise<Task>{
       return this.taskService.createTask(createTaskDto, user)
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id:string,
        @GetUser() user:User
    ):Promise<Task>{
       return this.taskService.getTaskById(id,user)
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id:string,
        @GetUser() user:User,
        ):Promise<void>{
       return this.taskService.deleteTaskById(id,user)
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id:string,
        @Body() updateTaskStatusDto:updateTaskDto,
        @GetUser() user:User
        ):Promise<Task>{
            const {status} = updateTaskStatusDto
      return this.taskService.updateTaskStatus(id, status, user)
    }
}
