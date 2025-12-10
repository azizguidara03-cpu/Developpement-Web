import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { MembersService } from './members.service';
import { ExperiencesService } from './experiences.service';
import { Member } from '../models/member';
import { Experience } from '../models/experience';

export interface DashboardStats {
  totalMembers: number;
  totalExperiences: number;
  activeExperiences: number;
  completedExperiences: number;
  departmentStats: { [key: string]: number };
  roleStats: { [key: string]: number };
  topSkills: { skill: string; count: number }[];
  membersByDepartment: { [key: string]: number };
  experiencesByRole: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private membersService: MembersService,
    private experiencesService: ExperiencesService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return combineLatest([
      this.membersService.getAllMembers(),
      this.experiencesService.getAllExperiences(),
      this.experiencesService.getActiveExperiences(),
      this.experiencesService.getCompletedExperiences()
    ]).pipe(
      map(([members, experiences, activeExp, completedExp]) => {
        return this.calculateStats(members, experiences, activeExp, completedExp);
      })
    );
  }

  private calculateStats(
    members: Member[],
    experiences: Experience[],
    activeExperiences: Experience[],
    completedExperiences: Experience[]
  ): DashboardStats {
    // Department stats
    const membersByDepartment = this.groupBy(members, 'department');
    const departmentStats = this.countByDepartment(experiences);

    // Role stats
    const roleStats = this.countByRole(experiences);

    // Top skills
    const topSkills = this.getTopSkills(experiences);

    // Experience by role
    const experiencesByRole = this.countByRole(experiences);

    return {
      totalMembers: members.length,
      totalExperiences: experiences.length,
      activeExperiences: activeExperiences.length,
      completedExperiences: completedExperiences.length,
      departmentStats,
      roleStats,
      topSkills,
      membersByDepartment,
      experiencesByRole
    };
  }

  private groupBy(items: Member[], key: keyof Member): { [key: string]: number } {
    return items.reduce((result, item) => {
      const value = String(item[key]);
      result[value] = (result[value] || 0) + 1;
      return result;
    }, {} as { [key: string]: number });
  }

  private countByDepartment(experiences: Experience[]): { [key: string]: number } {
    return experiences.reduce((result, exp) => {
      result[exp.department] = (result[exp.department] || 0) + 1;
      return result;
    }, {} as { [key: string]: number });
  }

  private countByRole(experiences: Experience[]): { [key: string]: number } {
    return experiences.reduce((result, exp) => {
      result[exp.role] = (result[exp.role] || 0) + 1;
      return result;
    }, {} as { [key: string]: number });
  }

  private getTopSkills(experiences: Experience[]): { skill: string; count: number }[] {
    const skillCount: { [key: string]: number } = {};

    experiences.forEach(exp => {
      exp.skillsGained.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCount)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 skills
  }
}
