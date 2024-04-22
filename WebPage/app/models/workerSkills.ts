import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createProgramSkill(
  userId: string,
  program: string,
  experience: number,
): Promise<void> {
  try {
    await prisma.programSkill.create({
      data: {
        program: program,
        experience: experience,
        userId: userId,
      },
    });
  } catch (error) {
    throw new Error(`Failed to create program skill: ${error}`);
  }
}

export async function createOtherSkill(
  userId: string,
  skill: string,
): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        otherSkills: {
          push: skill,
        },
      },
    });
  } catch (error) {
    throw new Error(`Failed to create other skill: ${error}`);
  }
}

export async function getProgramSkills(userId: string): Promise<any[]> {
  try {
    const programSkills = await prisma.programSkill.findMany({
      where: { userId: userId },
    });
    return programSkills.map((skill) => ({
      program: skill.program,
      experience: skill.experience,
    }));
  } catch (error) {
    throw new Error(`Failed to get program skills: ${error}`);
  }
}

export async function getOtherSkills(userId: string): Promise<string[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user.otherSkills ?? [];
  } catch (error) {
    throw new Error(`Failed to get other skills: ${error}`);
  }
}

export async function deleteProgramSkill(skillId: string): Promise<void> {
  try {
    await prisma.programSkill.delete({
      where: { id: skillId },
    });
  } catch (error) {
    throw new Error(`Failed to delete program skill: ${error}`);
  }
}
export async function setWorkHours(
  userId: string,
  workHours: number,
): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        workHours: workHours,
      },
    });
  } catch (error) {
    throw new Error(`Failed to set work hours: ${error}`);
  }
}

// You can add more CRUD operations as needed
