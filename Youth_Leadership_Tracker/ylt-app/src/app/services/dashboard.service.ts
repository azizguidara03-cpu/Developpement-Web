import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { MembersService } from './members.service';
import { ExperiencesService } from './experiences.service';
import { AuthService } from './auth.service';
import { Member } from '../models/member';
import { Experience } from '../models/experience';

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface TimelineItem {
  id: number;
  date: Date;
  title: string;
  description: string;
  role: string;
  department: string;
  status: 'active' | 'completed' | 'upcoming';
  skillsGained: string[];
  icon: string;
  color: string;
}

export interface LeadershipScore {
  score: number;
  experiencePoints: number;
  rolePoints: number;
  skillPoints: number;
  message: string;
  level: string;
}

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
  experiencesByDepartment: { [key: string]: number };
  averageExperienceDuration: number;
  mostCommonRole: string;
  mostRepresentedDepartment: string;
  membersByDepartmentChart: ChartData[];
  experiencesByRoleChart: ChartData[];
  timeline: TimelineItem[];
  leadershipScore: LeadershipScore;
  currentUserName: string;
}

// Chart color palettes
const DEPARTMENT_COLORS: { [key: string]: string } = {
  'OGV': '#3B82F6',
  'IGV': '#10B981',
  'OGT': '#8B5CF6',
  'IGT': '#F59E0B',
  'Talent Management': '#EC4899',
  'Finance': '#6366F1',
  'Marketing': '#EF4444',
  'Business Development': '#14B8A6',
  'Information Management': '#64748B'
};

const ROLE_COLORS: { [key: string]: string } = {
  'Team Member': '#10B981',
  'Team Leader': '#3B82F6',
  'Vice President': '#8B5CF6',
  'Local Committee President': '#EC4899',
  'OC Member': '#F59E0B',
  'OC Vice President': '#6366F1',
  'OC President': '#EF4444',
  'Local Support Team': '#14B8A6',
  'Entity Support Team': '#64748B'
};

const ROLE_ICONS: { [key: string]: string } = {
  'Team Member': '👤',
  'Team Leader': '👥',
  'Vice President': '⭐',
  'Local Committee President': '👑',
  'OC Member': '🎯',
  'OC Vice President': '🏆',
  'OC President': '🌟',
  'Local Support Team': '🛠️',
  'Entity Support Team': '🌍'
};

// Role weights for leadership scoring
const ROLE_WEIGHTS: { [key: string]: number } = {
  'Team Member': 5,
  'Team Leader': 15,
  'Vice President': 25,
  'Local Committee President': 30,
  'OC Member': 10,
  'OC Vice President': 20,
  'OC President': 25,
  'Local Support Team': 12,
  'Entity Support Team': 18
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private membersService = inject(MembersService);
  private experiencesService = inject(ExperiencesService);
  private authService = inject(AuthService);

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
    const membersByDepartment = this.groupBy(members, 'department');
    const departmentStats = this.countByDepartment(experiences);
    const experiencesByDepartment = this.countByDepartment(experiences);
    const roleStats = this.countByRole(experiences);
    const experiencesByRole = this.countByRole(experiences);
    const topSkills = this.getTopSkills(experiences);
    const averageExperienceDuration = this.calculateAverageDuration(experiences);
    const mostCommonRole = this.getMostCommon(experiencesByRole);
    const mostRepresentedDepartment = this.getMostCommon(membersByDepartment);
    const membersByDepartmentChart = this.convertToChartData(membersByDepartment, DEPARTMENT_COLORS);
    const experiencesByRoleChart = this.convertToChartData(experiencesByRole, ROLE_COLORS);
    
    // New: Timeline data
    const timeline = this.createTimeline(experiences);
    
    // New: Leadership score
    const currentUser = this.authService.currentUser();
    const currentUserName = currentUser?.fullName || 'User';
    const leadershipScore = this.calculateLeadershipScore(experiences, topSkills);

    return {
      totalMembers: members.length,
      totalExperiences: experiences.length,
      activeExperiences: activeExperiences.length,
      completedExperiences: completedExperiences.length,
      departmentStats,
      roleStats,
      topSkills,
      membersByDepartment,
      experiencesByRole,
      experiencesByDepartment,
      averageExperienceDuration,
      mostCommonRole,
      mostRepresentedDepartment,
      membersByDepartmentChart,
      experiencesByRoleChart,
      timeline,
      leadershipScore,
      currentUserName
    };
  }

  private createTimeline(experiences: Experience[]): TimelineItem[] {
    const now = new Date();
    
    return experiences
      .map(exp => {
        const startDate = new Date(exp.startDate);
        const endDate = exp.endDate ? new Date(exp.endDate) : null;
        
        let status: 'active' | 'completed' | 'upcoming';
        if (startDate > now) {
          status = 'upcoming';
        } else if (!endDate || endDate >= now) {
          status = 'active';
        } else {
          status = 'completed';
        }

        return {
          id: exp.id,
          date: startDate,
          title: exp.role,
          description: exp.description,
          role: exp.role,
          department: exp.department,
          status,
          skillsGained: exp.skillsGained,
          icon: ROLE_ICONS[exp.role] || '📋',
          color: ROLE_COLORS[exp.role] || '#6B7280'
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Most recent first
  }

  private calculateLeadershipScore(
    experiences: Experience[],
    topSkills: { skill: string; count: number }[]
  ): LeadershipScore {
    // Experience points (max 40 points)
    const experiencePoints = Math.min(experiences.length * 4, 40);
    
    // Role diversity points (max 30 points)
    const uniqueRoles = new Set(experiences.map(e => e.role));
    const rolePoints = Math.min(uniqueRoles.size * 5, 30);
    
    // Skills points (max 30 points)
    const totalSkills = topSkills.reduce((sum, s) => sum + s.count, 0);
    const skillPoints = Math.min(totalSkills * 2, 30);
    
    // Total score (out of 100)
    const score = experiencePoints + rolePoints + skillPoints;
    
    // Determine level and message
    let level: string;
    let message: string;
    
    if (score < 25) {
      level = 'Emerging Leader';
      message = 'is just starting their leadership journey. Keep growing!';
    } else if (score < 50) {
      level = 'Developing Leader';
      message = 'is making great progress on their leadership path!';
    } else if (score < 75) {
      level = 'Established Leader';
      message = 'has developed strong leadership capabilities!';
    } else {
      level = 'Senior Leader';
      message = 'is an experienced leader with diverse skills!';
    }

    return {
      score,
      experiencePoints,
      rolePoints,
      skillPoints,
      message,
      level
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
      .slice(0, 5);
  }

  private calculateAverageDuration(experiences: Experience[]): number {
    const completedWithDates = experiences.filter(e => e.endDate && e.startDate);
    if (completedWithDates.length === 0) return 0;
    const totalDays = completedWithDates.reduce((sum, exp) => {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    return Math.round(totalDays / completedWithDates.length);
  }

  private getMostCommon(data: { [key: string]: number }): string {
    const entries = Object.entries(data);
    if (entries.length === 0) return 'N/A';
    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  }

  private convertToChartData(data: { [key: string]: number }, colorMap: { [key: string]: string }): ChartData[] {
    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        value,
        color: colorMap[name] || this.getRandomColor()
      }))
      .sort((a, b) => b.value - a.value);
  }

  private getRandomColor(): string {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#6366F1', '#EF4444', '#14B8A6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
