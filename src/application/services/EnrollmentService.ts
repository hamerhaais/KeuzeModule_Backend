import { Injectable, NotFoundException } from '@nestjs/common';
import { Enrollment } from '../../domain/entities/Enrollment';
import { EnrollmentRepository } from '../../repositories/EnrollmentRepository';

@Injectable()
export class EnrollmentService {
  private repo = new EnrollmentRepository();

  async enroll(userId: string, moduleId: number): Promise<Enrollment> {
    const current = await this.repo.findByUser(userId);
    if (current.length >= 3) {
      throw new Error('Je mag maximaal 3 modules kiezen.');
    }
    return this.repo.create(new Enrollment({ userId, moduleId, firstChoice: false }));
  }

  async mine(userId: string): Promise<Enrollment[]> {
    return this.repo.findByUser(userId);
  }

  async setFirstChoice(userId: string, moduleId: number, firstChoice: boolean): Promise<Enrollment> {
    return this.repo.upsertFirstChoice(userId, moduleId, firstChoice);
  }

  async deleteEnrollment(userId: string, moduleId: number): Promise<{ deleted: boolean }> {
    return this.repo.delete(userId, moduleId);
  }
}
