/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum.model';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskReposioty: Repository<Task>,
  ) {}

  async getAllTask(filterDto:GetTasksFilterDto, user:User):Promise<Task[]>{
    const { status, search} = filterDto;
    const query = this.taskReposioty.createQueryBuilder('task');
    query.where({user})

    if(status){
        query.andWhere('task.status =:status',{status})
    }
    if(search){
        query.andWhere(
            '(task.title LIKE :search OR task.description LIKE :search)',
            {search : `%${search}%`}
        );
    }

    const tasks = await query.getMany()
    return tasks
  }

  async getTaskById(id: string,user:User): Promise<Task> {
    const found = await this.taskReposioty.findOne({
      where: {
        id: id,
        user
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user:User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskReposioty.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.taskReposioty.save(task);
    return task;
  }

  async deleteTaskById(id: string,user:User): Promise<void> {
    const result = await this.taskReposioty.delete({id,user});
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
  }
  async updateTaskStatus(id: string, status: TaskStatus,user:User): Promise<Task> {
    const task = await this.getTaskById(id,user);
    task.status = status;
    await this.taskReposioty.save(task);
    return task;
  }

}
