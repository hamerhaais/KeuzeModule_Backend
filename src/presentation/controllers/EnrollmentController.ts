import { Body, Controller, Get, Post, Put, Delete, UseGuards, Req, Param } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../guards/JwtAuthGuard';
import { EnrollmentService } from '../../application/services/EnrollmentService';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly service: EnrollmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async enroll(@Req() req: Request, @Body() body: { moduleId: number }) {
    const userId = (req as any).user?.id as string;
    return this.service.enroll(userId, body.moduleId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async mine(@Req() req: Request) {
    const userId = (req as any).user?.id as string;
    return this.service.mine(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('first-choice')
  async firstChoice(@Req() req: Request, @Body() body: { moduleId: number; firstChoice: boolean }) {
    const userId = (req as any).user?.id as string;
    const result = await this.service.setFirstChoice(userId, body.moduleId, body.firstChoice);
    return { success: true, enrollment: result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':moduleId')
  async deleteEnrollment(@Req() req: Request, @Param('moduleId') moduleId: string) {
    const userId = (req as any).user?.id as string;
    // moduleId kan string of number zijn
  return this.service.deleteEnrollment(userId, Number(moduleId));
  }
}
