
import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../src";
const USER_ID = "6";
async function seed(){
    await prismaClient.user.create({
        data: {
            id: USER_ID,
            email: "test@gmail.com"
        }
    })

    
    const website = await prismaClient.website.create({
        data: {
            
            url: "https://test.com",
            userId: USER_ID
        }
    })


    const validator = await prismaClient.validator.create({
        data: {
            
            publicKey: "0x5435832489",
            location: "Delhi",
            ip: "9098.432.432.432"
        }
    })

    await prismaClient.websiteTick.create({
        data: {
            websiteId: website.id,
            status: "Good",
            createdAt: new Date(),
            latency: 100,
            validatorId: validator.id
        }
    })

    await prismaClient.websiteTick.create({
        data: {
            
            websiteId: website.id,
            status: "Good",
            createdAt: new Date(),
            latency: 100,
            validatorId: validator.id
        }
    })
    await prismaClient.websiteTick.create({
        data: {
            websiteId: website.id,
            status: "Good",
            createdAt: new Date(Date.now() - 1000 * 60 *10),
            latency: 100,
            validatorId: validator.id
        }
    })

    await prismaClient.websiteTick.create({
        data: {
            websiteId: website.id,
            status: "Bad",
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
            latency: 100,
            validatorId: validator.id
        }
    })
}

seed();