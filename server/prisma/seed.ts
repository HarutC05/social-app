/// <reference types="node" />

import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    const usersData = [];
    for (let i = 0; i < 20; i++) {
        usersData.push({
            username: faker.internet.username(),
            email: faker.internet.email(),
            password_hash: faker.internet.password({ length: 12 }),
            bio: faker.lorem.sentence(),
            avatar_url: faker.image.avatar(),
        });
    }

    const createdUsers = [];
    for (const user of usersData) {
        const created = await prisma.user.create({ data: user });
        createdUsers.push(created);
    }

    const postsData = [];
    for (let i = 0; i < 50; i++) {
        const randomUserId = faker.helpers.arrayElement(createdUsers).id;
        postsData.push({
            authorId: randomUserId,
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs({ min: 1, max: 3 }),
            image_url: faker.image
                .urlPicsumPhotos({ width: 600, height: 400 })
                .replace(/\?.*$/, ""),
            tags: faker.helpers
                .arrayElements(
                    ["fun", "tech", "life", "news", "music"],
                    faker.number.int({ min: 1, max: 3 })
                )
                .join(","),
        });
    }

    const createdPosts = [];
    for (const post of postsData) {
        const created = await prisma.post.create({ data: post });
        createdPosts.push(created);
    }

    const commentsData = [];
    for (let i = 0; i < 200; i++) {
        const randomUserId = faker.helpers.arrayElement(createdUsers).id;
        const randomPostId = faker.helpers.arrayElement(createdPosts).id;
        commentsData.push({
            authorId: randomUserId,
            postId: randomPostId,
            content: faker.lorem.sentences({ min: 1, max: 2 }),
        });
    }
    for (const comment of commentsData) {
        await prisma.comment.create({ data: comment });
    }

    const likesSet = new Set<string>();
    const likesData = [];
    while (likesData.length < 150) {
        const userId = faker.helpers.arrayElement(createdUsers).id;
        const postId = faker.helpers.arrayElement(createdPosts).id;
        const key = `${userId}-${postId}`;
        if (!likesSet.has(key)) {
            likesSet.add(key);
            likesData.push({ userId, postId });
        }
    }
    for (const like of likesData) {
        await prisma.like.create({ data: like });
    }

    console.log("✅ Seeding finished successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
