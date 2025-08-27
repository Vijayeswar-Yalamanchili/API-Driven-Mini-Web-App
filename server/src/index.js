import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
import RepoModel from './models/repoModel.js'

dotenv.config()
const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin : 'https://api-driven-mini-web-app-iota.vercel.app',
    methods : 'GET, POST, PUT, DELETE',
    credentials : true
}))

app.get("/api/search", async (req, res) => {
  try {
    const keyword = req.query.keyword
    if (!keyword) return res.status(400).json({ error: "Keyword required" })

    // Fetch from GitHub
    const response = await axios.get(`https://api.github.com/search/repositories?q=${keyword}&per_page=10`)

    // Store in DB
    const repos = response.data.items.map(repo => ({
      name: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language
    }))
    await RepoModel.deleteMany({}); // clear old results
    await RepoModel.insertMany(repos);

    res.status(200).send({
      repos
    })

  } catch (error) {
    res.status(500).send({
        message : "Internal server error in searching keyword"
    })
  }
})

app.get("/api/getRepos", async (req, res) => {
  try {
    const repos = await RepoModel.find();
    res.status(200).send({
        repos
    })
  } catch (error) {
    res.status(500).send({
        message : "Internal server error in getting Repositories list"
    })
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})