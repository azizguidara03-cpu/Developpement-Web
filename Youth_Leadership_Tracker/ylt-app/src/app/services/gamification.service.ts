import { Injectable } from '@angular/core';
import { Member } from '../models/member';
import { Experience } from '../models/experience';

export interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
  colorClass: string; // Tailwind class for badge background/color
}

export const BADGES: Badge[] = [
  {
    id: 'new_starter',
    label: 'New Starter',
    icon: '🌱',
    description: 'Joined the platform',
    colorClass: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
  },
  {
    id: 'exp_novice',
    label: 'Experience Novice',
    icon: '🚀',
    description: 'Completed your first experience',
    colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
  },
  {
    id: 'exp_veteran',
    label: 'Experience Veteran',
    icon: '⭐',
    description: 'Completed 3 or more experiences',
    colorClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
  },
  {
    id: 'skill_collector',
    label: 'Skill Collector',
    icon: '🧠',
    description: 'Acquired 5 or more skills',
    colorClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
  },
  {
    id: 'role_diver',
    label: 'Role Diver',
    icon: '🔄',
    description: 'Held at least 2 different types of roles',
    colorClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
  },
  {
    id: 'dept_pro',
    label: 'Department Pro',
    icon: '🏢',
    description: 'Completed 2+ experiences in the same department',
    colorClass: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200'
  },
  {
    id: 'loyalist',
    label: 'Loyalist',
    icon: '📅',
    description: 'Member for over 1 year',
    colorClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
  }
];

@Injectable({
  providedIn: 'root'
})
export class GamificationService {

  constructor() { }

  getBadgesForMember(member: Member | null, experiences: Experience[]): Badge[] {
    if (!member) return [];

    const earnedBadges: Badge[] = [];

    // 1. New Starter (Always earned if member exists)
    earnedBadges.push(this.getBadge('new_starter'));

    // 2. Experience Novice (1+ exp)
    if (experiences.length >= 1) {
      earnedBadges.push(this.getBadge('exp_novice'));
    }

    // 3. Experience Veteran (3+ exp)
    if (experiences.length >= 3) {
      earnedBadges.push(this.getBadge('exp_veteran'));
    }

    // 4. Skill Collector (5+ skills)
    if (member.skills && member.skills.length >= 5) {
      earnedBadges.push(this.getBadge('skill_collector'));
    }

    // 5. Role Diver (Unique role names >= 2)
    const uniqueRoles = new Set(experiences.map(e => e.role));
    if (uniqueRoles.size >= 2) {
      earnedBadges.push(this.getBadge('role_diver'));
    }

    // 6. Department Pro (>= 2 exps in same dept)
    const deptCounts: {[key: string]: number} = {};
    let isDeptPro = false;
    experiences.forEach(e => {
      deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
      if (deptCounts[e.department] >= 2) isDeptPro = true;
    });
    if (isDeptPro) {
      earnedBadges.push(this.getBadge('dept_pro'));
    }

    // 7. Loyalist (> 1 year)
    // Mock logic: if createdAt is older than 365 days
    // Since our mock data is recent, we'll just check if they have > 5 experiences as a proxy for "long time" for now
    // OR actual date check:
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (new Date(member.createdAt) < oneYearAgo) {
      earnedBadges.push(this.getBadge('loyalist'));
    }

    return earnedBadges;
  }

  getAllBadges(): Badge[] {
    return BADGES;
  }

  private getBadge(id: string): Badge {
    return BADGES.find(b => b.id === id) || BADGES[0];
  }
}
