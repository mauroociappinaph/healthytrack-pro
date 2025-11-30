import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BADGES = [
  {
    name: 'Primer Paso',
    description: 'Completa tu primer workout',
    icon: '🎯',
    category: 'special',
    requirement: JSON.stringify({ type: 'workouts', value: 1 }),
  },
  {
    name: 'Racha de 7 Días',
    description: 'Mantén una racha de 7 días consecutivos',
    icon: '🔥',
    category: 'consistency',
    requirement: JSON.stringify({ type: 'streak', value: 7 }),
  },
  {
    name: 'Racha de 30 Días',
    description: 'Mantén una racha de 30 días consecutivos',
    icon: '💎',
    category: 'consistency',
    requirement: JSON.stringify({ type: 'streak', value: 30 }),
  },
  {
    name: 'Nivel 5',
    description: 'Alcanza el nivel 5',
    icon: '⭐',
    category: 'special',
    requirement: JSON.stringify({ type: 'level', value: 5 }),
  },
  {
    name: 'Nivel 10',
    description: 'Alcanza el nivel 10',
    icon: '🌟',
    category: 'special',
    requirement: JSON.stringify({ type: 'level', value: 10 }),
  },
  {
    name: 'Atleta Dedicado',
    description: 'Completa 100 workouts',
    icon: '💪',
    category: 'activity',
    requirement: JSON.stringify({ type: 'workouts', value: 100 }),
  },
  {
    name: 'Madrugador',
    description: 'Entrena antes de las 7am',
    icon: '🌅',
    category: 'special',
    requirement: JSON.stringify({ type: 'early_bird', value: true }),
  },
];

async function main() {
  console.log('Seeding badges...');

  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }

  console.log('✅ Badges seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
