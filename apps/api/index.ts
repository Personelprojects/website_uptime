import express from "express"
import { authMiddleware } from "./middleware"
import { prismaClient } from "db/client"
import cors from "cors";

const app = express()
app.use(express.json())
app.use(cors());
// console.log("server is running");
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.post("/api/v1/website", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const { url } = req.body;
  
      const data = await prismaClient.website.create({
        data: {
          userId,
          url
        }
      });
  
      res.json({
        id: data.id
      });
    } catch (error) {
      console.error('Error creating website:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.get("/api/v1/website/status",authMiddleware,async (req, res) =>{
    const websiteId = req.query.websiteId! as unknown as string;
    const userId = req.userId;
    const data = await prismaClient.website.findFirst({
        where: {
            id: websiteId,
            userId,
            disabled: false
        },
        include: {
            ticks: true
        }
    })


    res.json(data)
})


app.get("/api/v1/websites", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
  
      const websites = await prismaClient.website.findMany({
        where: {
          userId,
          disabled: false
        },
        include: {
          ticks: true
        }
      });
  
      res.json({
        websites
      });
    } catch (error) {
      console.error('Error fetching websites:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete("/api/v1/website/",authMiddleware, async (req, res) =>{
    const websiteId = req.body.websiteId;

    const userId = req.body.userId;

    await prismaClient.website.update({
        where: {
            id: websiteId,
            userId
        },
        data: {
            disabled: true
        }
    })

    res.json({
        message: "Deleted website successfully"
    })

})

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});