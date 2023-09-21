import cors from "cors"
import express from "express"
import { download } from "./download.js"
import { transcribe } from "./transcribe.js"
import { summarize } from "./summarize.js"
import { convert } from "./convert.js"

const app = express()
app.use(cors())

app.use(express.json())

app.get("/summary/:id", async (req, res) => {
  try {
    const id = req.params.id
    await download(id)
    const audioConverted = await convert()
    const result = await transcribe(audioConverted)
    return res.json({ result })
  } catch (error) {
    console.log(error)
    return res.json({ error })
  }
})

app.post("/summary", async (req, res) => {
  try {
    const result = await summarize(req.body.text)
    return res.json({ result })
  } catch (error) {
    console.log(error)
    return res.json({ error })
  }
})
app.listen(3333, () => console.log("Server is running on port 3333"))
/* app.route('/summary/:id').get(async (req, res) => {
  const id = req.params.id;
  await download(id);
  const result = await transcribe()
  res.json({ result });
}); */
